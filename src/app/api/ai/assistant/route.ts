import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { pageContext, userQuery } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
        response: 'AI service is not configured. Missing API key.'
    }, { status: 500 });
  }

  const prompt = `
You are a cybersecurity teaching assistant.

Rules:
- Educational, ethical, defensive
- No hacking, cracking, malware, or illegal guidance
- Explain concepts simply
- Never access private user data
- If unsure, say so clearly

Current page: ${pageContext}

User question:
${userQuery}
`;

  try {
    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/text-bison-001:generateText?key=${process.env.GEMINI_API_KEY}`,
        {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            prompt: { text: prompt },
            temperature: 0.4,
            maxOutputTokens: 400,
        }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini API Error:', errorText);
        return NextResponse.json({ response: `Sorry, there was an error with the AI service. The API returned: ${errorText}` }, { status: response.status });
    }

    const data = await response.json();
    
    const responseText = data.candidates?.[0]?.output;

    if (!responseText) {
        console.error('Invalid response structure from Gemini API:', data);
        return NextResponse.json({ response: 'I could not generate a response. The AI returned an empty answer.' }, { status: 500 });
    }

    return NextResponse.json({ response: responseText });

    } catch (error: any) {
        console.error('Error fetching from Gemini API:', error);
        return NextResponse.json({ response: `An unexpected error occurred: ${error.message}` }, { status: 500 });
    }
}
