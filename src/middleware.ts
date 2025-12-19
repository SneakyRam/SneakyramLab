import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard/:path*', '/learn/:path*', '/tools/:path*', '/account/:path*'];
const ALLOWED_COUNTRY = 'IN';
const BLOCKED_IP_SCORE_THRESHOLD = 50;

async function checkIpReputation(ip: string): Promise<number> {
    try {
        const res = await fetch(new URL('/api/ip-check', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ip }),
        });
        if (!res.ok) {
            console.warn(`IP check API failed with status: ${res.status}`);
            return 0; // Fail open (allow) if the check fails
        }
        const data = await res.json();
        return data.score || 0;
    } catch (error) {
        console.error('Error checking IP reputation:', error);
        return 0; // Fail open
    }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => {
    const pattern = new RegExp(`^${route.replace(':path*', '.*')}$`);
    return pattern.test(pathname);
  });


  if (isProtectedRoute) {
    const country = req.geo?.country;
    const ip = req.ip;

    // 1. Country-based restriction
    if (country !== ALLOWED_COUNTRY) {
      console.log(`Access denied for country: ${country}`);
      const url = req.nextUrl.clone();
      url.pathname = '/denied';
      return NextResponse.rewrite(url);
    }
    
    // 2. IP Reputation Check (only if country is allowed)
    if (ip) {
      const score = await checkIpReputation(ip);
      if (score > BLOCKED_IP_SCORE_THRESHOLD) {
        console.log(`Access denied for high-risk IP: ${ip} (Score: ${score})`);
        const url = req.nextUrl.clone();
        url.pathname = '/denied';
        return NextResponse.rewrite(url);
      }
    }
  }

  // Allow the request to proceed if it passes all checks
  return NextResponse.next();
}

export const config = {
  // Matcher includes all protected routes, plus the API route to prevent it from being processed by this middleware.
  matcher: ['/((?!api/ip-check|_next/static|_next/image|favicon.ico|logo.png).*)'],
};
