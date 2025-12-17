import { NextResponse } from 'next/server';
import passwordsKB from '@/ai/knowledge/passwords.json';
import hashingKB from '@/ai/knowledge/hashing.json';
import mainKB from '@/ai/knowledge/main.json';

type KnowledgeBase = {
  [key: string]: {
    definition: string;
    explanation?: string;
    why_important?: string;
    common_weaknesses?: string[];
    best_practices?: string[];
  };
};

const knowledgeBases: { [key: string]: KnowledgeBase } = {
  passwords: passwordsKB,
  hashing: hashingKB,
  main: mainKB,
};

// Simple keyword-based intent detection
function detectIntent(message: string): string {
  const lowerMessage = message.toLowerCase();
  if (lowerMessage.includes('password')) return 'passwords';
  if (lowerMessage.includes('hash')) return 'hashing';
  if (lowerMessage.includes('what is') || lowerMessage.includes('explain')) return 'definition';
  if (lowerMessage.includes('help') || lowerMessage.includes('start')) return 'help';
  return 'general';
}

function getContextualIntent(intent: string, pageContext: string): string {
    if (pageContext.includes('password-strength-checker')) return 'passwords';
    if (pageContext.includes('hash-generator')) return 'hashing';
    return intent;
}


function generateResponse(intent: string, page: string): string {
    const kbKey = intent === 'definition' ? 'main' : intent;
    const kb = knowledgeBases[kbKey];

    if (!kb) {
        return mainKB.general.explanation;
    }

    if (intent === 'passwords') {
        const info = kb.password_strength;
        return `${info.definition} ${info.why_important} Best practices include: ${info.best_practices?.join(', ')}.`;
    }
    if (intent === 'hashing') {
        const info = kb.cryptographic_hashing;
        return `${info.definition} ${info.why_important}`;
    }
    if (intent === 'help') {
        if (page === 'Home Page') return mainKB.getting_started.explanation;
        if (page.startsWith('Blog')) return "I can help summarize this post or explain key terms. Just ask!";
        if (page.startsWith('Learn')) return "I can clarify concepts from this lesson. What are you curious about?";
        if (page.startsWith('Tool')) return `This tool helps with a specific cybersecurity task. I can explain what it does and the concepts behind it.`;
        return mainKB.general.explanation;
    }
    if (intent === 'definition' && mainKB[page.toLowerCase().replace(/ /g,'_')]) {
        return mainKB[page.toLowerCase().replace(/ /g,'_')].explanation;
    }

    return mainKB.general.explanation;
}


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userQuery, pageContext, page } = body;

    if (!userQuery || !pageContext || !page) {
      return NextResponse.json({ response: 'Missing required parameters.' }, { status: 400 });
    }

    const basicIntent = detectIntent(userQuery);
    const finalIntent = getContextualIntent(basicIntent, pageContext);
    const response = generateResponse(finalIntent, page);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI assistant API:', error);
    return NextResponse.json({ response: 'Sorry, I encountered an internal error.' }, { status: 500 });
  }
}
