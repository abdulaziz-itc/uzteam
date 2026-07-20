import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages, locale } = (await req.json()) as {
      messages: ChatMessage[];
      locale?: string;
    };

    // ── Mock mode (no API key) — plain text stream ──────────────
    if (!process.env.OPENAI_API_KEY) {
      const mock =
        "This is a mock response because OPENAI_API_KEY is not set. In production, replies stream from the LLM. Try the Calculator page for a real project estimate.";
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for (const word of mock.split(' ')) {
            controller.enqueue(encoder.encode(word + ' '));
            await new Promise((r) => setTimeout(r, 40));
          }
          controller.close();
        },
      });
      return new Response(stream, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }

    const lang = locale === 'uz' ? 'Uzbek' : locale === 'ru' ? 'Russian' : 'English';
    const systemPrompt = `You are the official AI assistant for UzTeam, a premium IT Business Automation company.
You must respond in ${lang}.
UzTeam builds ERP, CRM, MRP systems, and custom AI assistants.
Be concise, professional, and helpful. If the user asks about pricing, mention it starts at $5,000 and recommend they use the Calculator page.`;

    const result = streamText({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    // Plain UTF-8 text stream — consumed directly by the widget.
    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
