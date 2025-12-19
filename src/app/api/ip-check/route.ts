
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { ip } = await req.json();

    if (!ip) {
      return NextResponse.json({ error: 'IP address is required.' }, { status: 400 });
    }

    if (!process.env.ABUSEIPDB_API_KEY) {
        console.warn("ABUSEIPDB_API_KEY is not set. Skipping IP check.");
        // In a real production scenario, you might want to fail open or closed depending on policy.
        // For this educational platform, we'll allow the request but with a score of 0.
        return NextResponse.json({ score: 0 });
    }

    const res = await fetch(
      `https://api.abuseipdb.com/api/v2/check?ipAddress=${ip}&maxAgeInDays=90`,
      {
        headers: {
          Key: process.env.ABUSEIPDB_API_KEY!,
          Accept: 'application/json',
        },
      }
    );
    
    if (!res.ok) {
        // Log the error from the external API
        console.error(`AbuseIPDB API error: ${res.status} ${res.statusText}`);
        // Return a neutral score to avoid blocking users due to an external service failure.
        return NextResponse.json({ score: 0 });
    }

    const data = await res.json();
    const score = data?.data?.abuseConfidenceScore ?? 0;

    return NextResponse.json({ score });

  } catch (error) {
    console.error("IP check internal error:", error);
    // Return a neutral score on internal failure
    return NextResponse.json({ score: 0 }, { status: 500 });
  }
}
