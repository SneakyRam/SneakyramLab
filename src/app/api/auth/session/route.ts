// src/app/api/auth/session/route.ts
import { cookies } from 'next/headers';
import { adminAuth } from '@/lib/firebase-admin';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    // Set session expiration to 7 days.
    const expiresIn = 60 * 60 * 24 * 7 * 1000;

    const sessionCookie = await adminAuth.createSessionCookie(idToken, {
      expiresIn,
    });

    cookies().set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      sameSite: 'lax',
      path: '/',
      maxAge: expiresIn,
    });

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Session login error:', error);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}
