import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { leads } from '@/lib/db/schema';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { name, email, phone, company, message } = await req.json();

    if (!name || (!email && !phone)) {
      return NextResponse.json(
        { error: 'Name and either email or phone are required.' },
        { status: 400 },
      );
    }

    await db.insert(leads).values({
      name: String(name).slice(0, 255),
      email: email ? String(email).slice(0, 255) : null,
      phone: phone ? String(phone).slice(0, 50) : null,
      company: company ? String(company).slice(0, 255) : null,
      message: message ? String(message).slice(0, 5000) : null,
      source: 'contact_form',
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Lead submission error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
