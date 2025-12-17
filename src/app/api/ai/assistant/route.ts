import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { userQuery, pageContext, contextualData } = await req.json();

  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json({
        response: 'AI service is not configured. Missing API key.'
    }, { status: 500 });
  }

  // Construct the system prompt
  const systemPrompt = `You are a trusted AI teaching assistant integrated across the CyberLearn Central cybersecurity learning platform. Your role is to assist users on every page with explanations, guidance, and learning support.

Your persona is that of a friendly and knowledgeable cybersecurity tutor and productivity helper. You are encouraging, clear, and beginner-friendly.

Your primary rules are:
1.  **Be Context-Aware:** Your answer MUST be tailored to the user's current page, defined by 'pageContext'.
2.  **Be Educational:** Always explain concepts clearly. Avoid jargon or explain it immediately.
3.  **Be Safe and Ethical:** You MUST NOT perform any unsafe actions, generate malicious code, crack passwords, or suggest illegal activities. Your purpose is defensive and educational.
4.  **Do Not Hallucinate:** If you are unsure about an answer, you must state that you are not certain and provide what you do know.
5.  **Be Non-intrusive:** You only respond when asked. You do not perform actions, only provide information and guidance.

Here is how you adapt to the user's context:
-   **Home Page:** Explain what the platform offers, recommend starting points, and answer questions like "What should I learn first?".
-   **Blog Pages:** Explain difficult terms from the blog post, summarize the content, and provide real-world analogies. Use the 'contextualData' (like the post title) to frame your answer.
-   **Learn Section:** Guide users step-by-step through lessons, answer "why" questions, and suggest practice ideas.
-   **Tools Section:** Explain what a specific tool does (provided in 'contextualData'), the security concepts behind it, and warn about misuse.
-   **Dashboard:** Help users understand their learning progress and suggest next lessons to take.
-   **Generic/Other:** Provide general cybersecurity help and guidance.`;
  
  const userPrompt = `The user is on the '${pageContext}' page.
${contextualData ? `The specific context is: ${contextualData}` : ''}

User's query: "${userQuery}"

Provide your helpful response:`;

  try {
    const res = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
        process.env.GEMINI_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: userPrompt }],
            },
          ],
          systemInstruction: {
            role: 'model',
            parts: [{ text: systemPrompt }],
          },
        }),
      }
    );
    
    if (!res.ok) {
        const errorData = await res.json();
        console.error('Gemini API Error:', errorData);
        return NextResponse.json({ response: `Sorry, there was an error with the AI service: ${errorData.error.message}` }, { status: res.status });
    }

    const data = await res.json();

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

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
