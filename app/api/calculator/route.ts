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

    // Mock Mode Check (If no OPENAI API key is set)
    if (!process.env.OPENAI_API_KEY) {
      console.warn("MOCK MODE ENABLED: No OPENAI_API_KEY set.");
      const mockRequirements = {
        complexity: 'Medium' as const,
        features: ['Mock Feature 1', 'Mock Feature 2'],
        integrations: ['Stripe', 'Twilio'],
        isRealtime: true,
        needsHighSecurity: false
      };
      const mockBr =
        "### Mock Business Requirements\nThis is a mocked response because OPENAI_API_KEY is not set.\n\n**Features:**\n- Mock Feature 1\n- Mock Feature 2";

      const estimate = await calculateEstimate(mockRequirements);

      // Store the mock submission too, so the gate flow works end-to-end.
      const [mockRow] = await db
        .insert(calculatorSubmissions)
        .values({
          locale,
          ipHash,
          rawInputFeatures: features,
          rawInputProblem: problem,
          rawInputIntegrations: integrations,
          generatedBrText: mockBr,
          extractedTags: mockRequirements,
          complexity: mockRequirements.complexity,
          minPrice: String(estimate.minPrice),
          maxPrice: String(estimate.maxPrice),
          estimatedDays: estimate.estimatedDays,
        })
        .returning({ id: calculatorSubmissions.id });

      return NextResponse.json({
        success: true,
        tier1: {
          br_summary: mockBr,
          complexity: mockRequirements.complexity,
        },
        submission_id: mockRow.id,
      });
    }

    // Call LLM
    const { object: llmResult } = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: CalculatorSchema,
      prompt: `
        You are a senior Business Analyst at UzTeam, an IT Business Automation company.
        A potential client has described their product idea. 
        Your task is to analyze the input, generate a concise and professional Business Requirements (BR) summary in ${locale === 'uz' ? 'Uzbek' : locale === 'ru' ? 'Russian' : 'English'}, and extract strict JSON metadata.

        DO NOT include pricing or timelines in the BR text.
        
        <user_query>
        Core Functionalities: ${features}
        Problem Solved: ${problem}
        Needed Integrations: ${integrations}
        </user_query>
      `,
    });

    const estimate = await calculateEstimate({
      complexity: llmResult.complexity,
      features: llmResult.features,
      integrations: llmResult.integrations,
      isRealtime: llmResult.isRealtime,
      needsHighSecurity: llmResult.needsHighSecurity,
    });

    // Save to database
    const [insertData] = await db
      .insert(calculatorSubmissions)
      .values({
        locale,
        ipHash,
        rawInputFeatures: features,
        rawInputProblem: problem,
        rawInputIntegrations: integrations,
        generatedBrText: llmResult.br_summary_text,
        extractedTags: llmResult,
        complexity: llmResult.complexity,
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
        br_summary: llmResult.br_summary_text,
        complexity: llmResult.complexity
      }
    });

  } catch (error) {
    console.error("Calculator API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
