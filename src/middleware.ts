
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// With client-side authentication managed by Firebase's provider and context,
// the middleware's role is simplified. It no longer needs to check for session
// cookies, as that was causing redirect loops. Route protection is now handled
// by client-side components that react to the global auth state.
export function middleware(req: NextRequest) {
  // This middleware is now a pass-through. The route protection logic
  // is handled on the client-side, which is the correct pattern for
  // Firebase client-side authentication.
  return NextResponse.next();
}

export const config = {
  // The matcher still defines which routes will trigger the middleware,
  // but the middleware itself will simply allow the request to proceed.
  // This setup is clean, avoids server/client auth conflicts, and is ready
  // for any future (non-auth) middleware logic you might want to add.
  matcher: [
    '/dashboard/:path*',
    '/login',
    '/signup',
    '/verify-email',
    '/reset-password'
  ],
};
