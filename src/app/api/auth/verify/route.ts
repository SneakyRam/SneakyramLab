
// src/app/api/auth/verify/route.ts
import { getAdminAuth } from '@/lib/firebase-admin';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const adminAuth = getAdminAuth();
  const headersList = headers();
  const session = headersList.get('cookie')?.split('; ').find(c => c.startsWith('session='))?.split('=')[1];

  if (!session) {
    return NextResponse.json({ error: 'No session cookie' }, { status: 401 });
  }

  try {
    // verifySessionCookie checks for revocation and expiry
    await adminAuth.verifySessionCookie(session, true);
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired session' }, { status: 401 });
  }
}
