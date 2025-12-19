import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware is now responsible ONLY for matching routes.
// The authentication and redirection logic is handled in `src/app/(protected)/layout.tsx`.
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // This matcher applies the middleware to all learning and practice routes,
  // allowing for future edge-based logic like geo-blocking or IP reputation checks.
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/tools/:path*',
    '/practice/:path*',
    '/ctf/:path*',
    '/cheatsheets/:path*',
    '/profile/:path*',
  ],
};
