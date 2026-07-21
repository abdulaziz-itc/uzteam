import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { testimonials } from '@/lib/db/schema';

export const runtime = 'nodejs';

// Public: submit a testimonial — stored unapproved until an admin reviews it.
export async function POST(req: Request) {
  try {
    const { name, position, message, locale } = await req.json();

    if (!name || !message || String(message).trim().length < 10) {
      return NextResponse.json(
        { error: 'Name and a message (min 10 chars) are required.' },
        { status: 400 },
      );
    }

    await db.insert(testimonials).values({
      name: String(name).slice(0, 255),
      position: position ? String(position).slice(0, 255) : null,
      message: String(message).slice(0, 2000),
      locale: locale ? String(locale).slice(0, 10) : 'uz',
      isApproved: false,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Testimonial submission error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
