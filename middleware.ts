import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;

  // If no session cookie, redirect to login page
  if (!session) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Verify the session cookie with your serverless function
  // We point to the function on the same Vercel deployment
  const verificationUrl = new URL('/api/auth/verify', req.url);

  try {
    const response = await fetch(verificationUrl, {
      headers: {
        Cookie: `session=${session}`,
      },
    });

    // If verification is successful, proceed
    if (response.ok) {
      return NextResponse.next();
    }
    
    // If verification fails, redirect to login
    return NextResponse.redirect(new URL('/login', req.url));
  } catch (error) {
    console.error('Middleware verification error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  // Protect all routes under /dashboard
  matcher: ['/dashboard/:path*'],
};
