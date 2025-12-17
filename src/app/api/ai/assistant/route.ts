
import { NextResponse } from 'next/server';
import passwordsKB from '@/ai/knowledge/passwords.json';
import hashingKB from '@/ai/knowledge/hashing.json';
import mainKB from '@/ai/knowledge/main.json';

type KnowledgeBase = {
  [key: string]: {
    definition?: string;
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

// --- START: Reasoning Engine ---

function analyzePassword(pw: string): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
  
    if (!pw) {
      reasons.push("No password was provided.");
      return { score: 0, reasons };
    }

    if (pw.length < 8) {
      reasons.push("is less than 8 characters long");
    } else if (pw.length < 12) {
      score += 1;
    } else {
      score += 2;
    }
  
    if (!/[a-z]/.test(pw)) {
      reasons.push("does not contain lowercase letters");
    } else {
      score += 1;
    }
  
    if (!/[A-Z]/.test(pw)) {
      reasons.push("does not contain uppercase letters");
    } else {
      score += 1;
    }
  
    if (!/\d]/.test(pw)) {
      reasons.push("does not contain numbers");
    } else {
      score += 1;
    }
  
    if (!/[^a-zA-Z0-9]/.test(pw)) {
      reasons.push("does not contain special symbols");
    } else {
      score += 2;
    }

    const commonPasswords = ["password", "123456", "qwerty", "12345678", "asdf"];
    if (commonPasswords.includes(pw.toLowerCase())) {
        reasons.push("is a very common and easily guessed password");
        score = 0;
    }
  
    return { score, reasons };
}

function getPasswordVerdict(score: number): "Very Weak" | "Weak" | "Moderate" | "Strong" {
    if (score <= 2) return "Very Weak";
    if (score <= 4) return "Weak";
    if (score <= 6) return "Moderate";
    return "Strong";
}

function generatePasswordExplanation(password: string): string {
    const { score, reasons } = analyzePassword(password);
    const verdict = getPasswordVerdict(score);

    if (reasons.length === 0) {
        return `✅ Your password is **Strong**. It meets all the recommended criteria. Well done!`;
    }

    const reasonText = reasons.map(r => `• It ${r}`).join('\n');
    const bestPracticesText = passwordsKB.password_strength.best_practices.map(p => `• ${p}`).join('\n');

    return `
Your password is rated as **${verdict}**.

Here's why:
${reasonText}

To improve your password security, remember these best practices:
${bestPracticesText}
    `.trim();
}

// --- END: Reasoning Engine ---

function normalize(text: string) {
    return text
      .toLowerCase()
      .replace(/[“”"]/g, "'")
      .replace(/[?,.!]/g, "")
      .trim();
}

function extractPassword(message: string): string | null {
    const text = normalize(message);
  
    // 1. Quoted password: 'password'
    const quoted = text.match(/'([^']+)'/);
    if (quoted) return quoted[1];
  
    // 2. Pattern: is <password> strong
    const pattern = text.match(/is\s+([^\s]+)\s+strong/);
    if (pattern) return pattern[1];
  
    // 3. Single token fallback (likely password)
    const words = text.split(" ");
    if (words.length === 1 && words[0].length >= 4 && words[0].length <= 50) {
      return words[0];
    }

    // 4. Fallback for simple pattern "check <password>" or similar
    const checkPattern = text.match(/(check|rate)\s+([^\s]+)/);
    if (checkPattern) return checkPattern[2];

    // 5. If the intent is clearly evaluation, and there's a single word that could be a password
    const potentialPasswordWords = text.split(' ').filter(word => !['is', 'my', 'a', 'an', 'the', 'strong', 'weak', 'password', 'check', 'rate'].includes(word));
    if (potentialPasswordWords.length === 1 && potentialPasswordWords[0].length > 0) {
        return potentialPasswordWords[0];
    }
  
    return null;
}


function detectIntent(message: string, pageContext: string, passwordCandidate: string | null): { intent: string; passwordCandidate?: string | null } {
    const lowerMessage = message.toLowerCase();
    
    if (passwordCandidate) {
        return { intent: 'check_password', passwordCandidate };
    }
    
    const keywords = ['strong', 'weak', 'check', 'rate', 'my password'];
    if (keywords.some(kw => lowerMessage.includes(kw)) || pageContext.includes('password-strength-checker')) {
        return { intent: 'check_password', passwordCandidate: null };
    }
    
    if (lowerMessage.includes('password')) return { intent: 'passwords' };
    if (lowerMessage.includes('hash')) return { intent: 'hashing' };
    if (lowerMessage.startsWith('what is') || lowerMessage.startsWith('explain')) return { intent: 'definition' };
    if (['hi', 'hello', 'hey'].includes(lowerMessage.trim())) return { intent: 'greeting' };
    
    return { intent: 'unknown' };
}

function generateResponse(intent: string, page: string, pageContext: string, passwordCandidate?: string | null): string {
    if (intent === 'check_password') {
        if (passwordCandidate) {
            return generatePasswordExplanation(passwordCandidate);
        }
        return `Of course! What password would you like me to check? For example, you can ask me: "Is 'MyP@ssword123!' strong?"`;
    }
    
    const kbKey = intent === 'definition' ? 'main' : intent;
    const kb = knowledgeBases[kbKey];

    if (intent === 'passwords') {
        const info = kb.password_strength;
        const response = `${info.definition} ${info.why_important}\n\n**Best Practices:**\n${info.best_practices?.map(p => `- ${p}`).join('\n') || ''}`;
        return response + `\n\nI can also check a specific password for you. Just ask me something like: "Is 'my-test-password' strong?"`;
    }
    if (intent === 'hashing') {
        const info = kb.cryptographic_hashing;
        return `${info.definition} ${info.why_important}`;
    }
    if (intent === 'greeting') {
        return `Hello! I'm your AI cybersecurity tutor. You can ask me to explain concepts or check the strength of a password. How can I help?`;
    }
    if (intent === 'definition' && page && mainKB[page.toLowerCase().replace(/ /g, '_')]) {
        return mainKB[page.toLowerCase().replace(/ /g, '_')].explanation;
    }

    // New, better fallback
    return `I can help explain cybersecurity concepts, evaluate password safety, and guide you through the tools on this site.
    \nTry asking me:
    \n• "What is cryptographic hashing?"
    \n• "Is 'P@ssword!23' a strong password?"
    \n• "How do I use the hash generator?"
    `;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userQuery, pageContext, page } = body;

    if (!userQuery || !pageContext || !page) {
      return NextResponse.json({ response: 'Missing required parameters.' }, { status: 400 });
    }
    
    const extractedPassword = extractPassword(userQuery);
    const { intent, passwordCandidate } = detectIntent(userQuery, pageContext, extractedPassword);
    const response = generateResponse(intent, page, pageContext, passwordCandidate);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI assistant API:', error);
    return NextResponse.json({ response: 'Sorry, I encountered an internal error.' }, { status: 500 });
  }
}
