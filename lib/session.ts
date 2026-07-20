import 'server-only';
import { cookies } from 'next/headers';
import { verifySession, SESSION_COOKIE, type AdminSession } from './auth';

/** Read the current admin session from cookies (server components / route handlers). */
export async function getSession(): Promise<AdminSession | null> {
  const store = await cookies();
  return verifySession(store.get(SESSION_COOKIE)?.value);
}

export type { AdminSession };
