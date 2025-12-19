
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/reset-password');
  
  // Allow direct access to /verify-email, the page itself will handle auth state
  if (pathname.startsWith('/verify-email')) {
    return NextResponse.next();
  }

  // If no session, redirect to login for protected routes.
  if (!session && !isAuthPage) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If there IS a session and the user is on an auth page, redirect to dashboard.
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/verify-email',
    '/reset-password'
  ],
};
