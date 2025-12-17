import { NextResponse } from 'next/server';
import { analyzePassword } from '@/lib/security/passwordEngine';
import { tutorResponse } from '@/lib/security/tutorEngine';

export async function POST(req: Request) {
  const { password } = await req.json();

  if (typeof password !== 'string') {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
  }

  const analysis = analyzePassword(password);
  const explanation = tutorResponse(analysis);

  return NextResponse.json({
    analysis,
    explanation,
  });
}
