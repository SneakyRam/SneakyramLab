
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/reset-password');

  // Allow access to /verify-email for anyone, as its content will handle auth state
  if (pathname.startsWith('/verify-email')) {
    return NextResponse.next();
  }

  if (!session) {
    if (isAuthPage) {
      return NextResponse.next();
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const decodedToken = await adminAuth.verifySessionCookie(session, true);

    // If user is logged in and tries to access an auth page, redirect to dashboard
    if (isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }
    
    // Add user info to headers to be accessed in server components if needed
    const requestHeaders = new Headers(req.headers);
    requestHeaders.set('x-user-id', decodedToken.uid);
    requestHeaders.set('x-user-email', decodedToken.email || '');

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    // Session is invalid. Clear the cookie and redirect to login.
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('session');
    
    if (!isAuthPage) {
        response.nextUrl.searchParams.set('from', pathname);
    }
    
    return response;
  }
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
