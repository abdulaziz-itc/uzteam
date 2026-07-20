import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { signSession, SESSION_COOKIE, sessionCookieOptions } from '@/lib/auth';

// Runs in the Node.js runtime (bcrypt is not edge-compatible).
export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const [user] = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, String(email).toLowerCase().trim()))
      .limit(1);

    if (!user || !user.isActive) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = await signSession({
      sub: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });

    const res = NextResponse.json({ success: true });
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    return res;
  } catch (err) {
    console.error('Admin login error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
