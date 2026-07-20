import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextResponse, type NextRequest } from 'next/server';
import { verifySession, SESSION_COOKIE } from './lib/auth';

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API routes must not be touched by the i18n middleware (no locale prefix).
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Protect /admin routes with our own JWT session cookie.
  if (pathname.includes('/admin')) {
    const isLoginPath = pathname.endsWith('/admin/login');
    const session = await verifySession(request.cookies.get(SESSION_COOKIE)?.value);

    if (!session && !isLoginPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/en/admin/login';
      return NextResponse.redirect(url);
    }

    // Already logged in but visiting the login page → send to dashboard.
    if (session && isLoginPath) {
      const url = request.nextUrl.clone();
      url.pathname = '/en/admin';
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/(uz|en|ru)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)'],
};
