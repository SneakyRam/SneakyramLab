
// src/app/api/auth/logout/route.ts
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  // The only job of this route is to clear the session cookie
  // and redirect the user.
  
  const options = {
    name: 'session',
    value: '',
    maxAge: -1, // Expire the cookie immediately
  };

  cookies().set(options);

  // Redirect to the home page after clearing the cookie
  const homeUrl = new URL('/', req.url);
  return NextResponse.redirect(homeUrl);
}
