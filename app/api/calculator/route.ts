import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { calculateEstimate } from '@/lib/pricing-engine';
import { db } from '@/lib/db';
import { calculatorRateLimits, calculatorSubmissions } from '@/lib/db/schema';
import crypto from 'crypto';

export const runtime = 'nodejs';

// ─── Fallback analysis (no AI key / AI failure) ────────────────────────
// Builds a clean, professional BR summary in the user's language from their
// OWN inputs — users must never see any "mock/AI unavailable" wording.

const FALLBACK_STRINGS = {
  uz: {
    goal: 'Loyiha maqsadi',
    features: 'Rejalashtirilgan asosiy imkoniyatlar',
    integrations: 'Tashqi integratsiyalar',
    none: 'Dastlabki bosqichda talab qilinmaydi',
    outro:
      "Ushbu xulosa siz kiritgan ma'lumotlar asosida tuzildi. Mutaxassislarimiz talablarni batafsil o'rganib, texnik yechim va aniq taklifni tayyorlaydi.",
  },
  ru: {
    goal: 'Цель проекта',
    features: 'Планируемые ключевые возможности',
    integrations: 'Внешние интеграции',
    none: 'На первом этапе не требуются',
    outro:
      'Это резюме составлено на основе введённых вами данных. Наши специалисты детально изучат требования и подготовят техническое решение с точным предложением.',
  },
  en: {
    goal: 'Project goal',
    features: 'Planned key capabilities',
    integrations: 'External integrations',
    none: 'Not required at the first stage',
    outro:
      'This summary is based on the information you provided. Our specialists will study the requirements in detail and prepare a technical solution with an exact proposal.',
  },
} as const;

function splitItems(raw: string): string[] {
  return String(raw || '')
    .split(/[\n;,•]+/)
    .map((s) => s.trim().replace(/^[-–—*]\s*/, ''))
    .filter((s) => s.length > 1)
    .slice(0, 8);
}

function buildFallbackAnalysis(
  features: string,
  problem: string,
  integrations: string,
  locale: string,
) {
  const lang = (['uz', 'ru', 'en'] as const).includes(locale as 'uz')
    ? (locale as 'uz' | 'ru' | 'en')
    : 'uz';
  const s = FALLBACK_STRINGS[lang];

  const featureList = splitItems(features);
  const integrationList = splitItems(integrations);

  // Simple deterministic complexity heuristic.
  const score = featureList.length + integrationList.length * 2;
  const complexity: 'Low' | 'Medium' | 'High' = score <= 3 ? 'Low' : score <= 7 ? 'Medium' : 'High';

  const brParts: string[] = [];
  if (problem?.trim()) brParts.push(`${s.goal}:\n${problem.trim()}`);
  brParts.push(
    `${s.features}:\n${(featureList.length ? featureList : [features]).map((f) => `• ${f}`).join('\n')}`,
  );
  brParts.push(
    `${s.integrations}:\n${integrationList.length ? integrationList.map((i) => `• ${i}`).join('\n') : s.none}`,
  );
  brParts.push(s.outro);

  return {
    br: brParts.join('\n\n'),
    requirements: {
      complexity,
      features: featureList.length ? featureList : [String(features).slice(0, 120)],
      integrations: integrationList,
      isRealtime: /realtime|real-time|jonli|чат|chat|websocket/i.test(features + ' ' + problem),
      needsHighSecurity: /payment|to'lov|оплат|bank|karta|card/i.test(
        features + ' ' + integrations,
      ),
    },
  };
}

// The schema matching the required LLM output
const CalculatorSchema = z.object({
  br_summary_text: z.string().describe('The generated Business Requirements summary text, formatted beautifully in Markdown.'),
  features: z.array(z.string()).describe('List of main extracted features (e.g. "OAuth login", "Payment processing").'),
  integrations: z.array(z.string()).describe('List of detected external integrations.'),
  isRealtime: z.boolean().describe('True if the app needs realtime data syncing, websockets, or chat.'),
  needsHighSecurity: z.boolean().describe('True if the app handles sensitive data, payments, or requires strict compliance.'),
  complexity: z.enum(['Low', 'Medium', 'High']).describe('Overall project complexity estimation.'),
});

export async function POST(req: Request) {
  try {
    const { features, problem, integrations, locale } = await req.json();

    // Basic rate limit by IP hash (simulated for serverless environment)
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex');

    // Check rate limit in DB
    const [rlData] = await db
      .select()
      .from(calculatorRateLimits)
      .where(eq(calculatorRateLimits.ipHash, ipHash))
      .limit(1);

    if (rlData) {
      const windowStart = new Date(rlData.windowStart ?? new Date()).getTime();
      const now = Date.now();
      // 24 hours window
      if (now - windowStart < 24 * 60 * 60 * 1000) {
        if ((rlData.attemptCount ?? 0) >= 3) {
          return NextResponse.json({ error: 'Rate limit exceeded. Try again tomorrow.' }, { status: 429 });
        }
        await db
          .update(calculatorRateLimits)
          .set({ attemptCount: (rlData.attemptCount ?? 0) + 1 })
          .where(eq(calculatorRateLimits.ipHash, ipHash));
      } else {
        // Reset window
        await db
          .update(calculatorRateLimits)
          .set({ attemptCount: 1, windowStart: new Date() })
          .where(eq(calculatorRateLimits.ipHash, ipHash));
      }
    } else {
      await db.insert(calculatorRateLimits).values({ ipHash });
    }

    // Analyze the request: AI when available, clean deterministic fallback otherwise.
    let br: string;
    let requirements: {
      complexity: 'Low' | 'Medium' | 'High';
      features: string[];
      integrations: string[];
      isRealtime: boolean;
      needsHighSecurity: boolean;
    };

    if (process.env.OPENAI_API_KEY) {
      try {
        const { object: llmResult } = await generateObject({
          model: openai('gpt-4o-mini'),
          schema: CalculatorSchema,
          prompt: `
            You are a senior Business Analyst at UzTeam, an IT Business Automation company.
            A potential client has described their product idea.
            Your task is to analyze the input, generate a concise and professional Business Requirements (BR) summary in ${locale === 'uz' ? 'Uzbek' : locale === 'ru' ? 'Russian' : 'English'}, and extract strict JSON metadata.

            DO NOT include pricing or timelines in the BR text.
            Write the BR summary as plain text (no markdown symbols like ### or **).

            <user_query>
            Core Functionalities: ${features}
            Problem Solved: ${problem}
            Needed Integrations: ${integrations}
            </user_query>
          `,
        });
        br = llmResult.br_summary_text;
        requirements = {
          complexity: llmResult.complexity,
          features: llmResult.features,
          integrations: llmResult.integrations,
          isRealtime: llmResult.isRealtime,
          needsHighSecurity: llmResult.needsHighSecurity,
        };
      } catch (aiError) {
        console.error('AI analysis failed — using fallback:', aiError);
        const fb = buildFallbackAnalysis(features, problem, integrations, locale);
        br = fb.br;
        requirements = fb.requirements;
      }
    } else {
      const fb = buildFallbackAnalysis(features, problem, integrations, locale);
      br = fb.br;
      requirements = fb.requirements;
    }

    const estimate = await calculateEstimate(requirements);

    // Save to database
    const [insertData] = await db
      .insert(calculatorSubmissions)
      .values({
        locale,
        ipHash,
        rawInputFeatures: features,
        rawInputProblem: problem,
        rawInputIntegrations: integrations,
        generatedBrText: br,
        extractedTags: requirements,
        complexity: requirements.complexity,
        minPrice: String(estimate.minPrice),
        maxPrice: String(estimate.maxPrice),
        estimatedDays: estimate.estimatedDays,
      })
      .returning({ id: calculatorSubmissions.id });

    // Return Tier 1 result and submission ID
    return NextResponse.json({
      success: true,
      submission_id: insertData.id,
      tier1: {
        br_summary: br,
        complexity: requirements.complexity,
      },
    });

  } catch (error) {
    console.error("Calculator API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
