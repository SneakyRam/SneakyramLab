
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
  
    if (!/\d/.test(pw)) {
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
        return `✅ Your password "${password}" is Strong. It meets all the recommended criteria. Well done!`;
    }

    const reasonText = reasons.map(r => `- It ${r}`).join('\n');
    const bestPracticesText = passwordsKB.password_strength.best_practices.map(p => `- ${p}`).join('\n');

    return `
Your password "${password}" is rated as **${verdict}**.

Here's why:
${reasonText}

To improve your password security, remember these best practices:
${bestPracticesText}
    `;
}

// --- END: Reasoning Engine ---


// Simple keyword-based intent detection
function detectIntent(message: string): { intent: string; passwordCandidate?: string } {
    const lowerMessage = message.toLowerCase();

    // Regex to find quoted strings, which we'll assume is a password to check
    const passwordMatch = message.match(/"([^"]+)"|'([^']+)'/);
    if (passwordMatch) {
        const password = passwordMatch[1] || passwordMatch[2];
        if (lowerMessage.includes('strong') || lowerMessage.includes('weak') || lowerMessage.includes('check')) {
            return { intent: 'check_password', passwordCandidate: password };
        }
    }
    
    if (lowerMessage.includes('password')) return { intent: 'passwords' };
    if (lowerMessage.includes('hash')) return { intent: 'hashing' };
    if (lowerMessage.includes('what is') || lowerMessage.includes('explain')) return { intent: 'definition' };
    if (lowerMessage.includes('help') || lowerMessage.includes('start')) return { intent: 'help' };
    return { intent: 'general' };
}

function getContextualIntent(intent: string, pageContext: string): string {
    if (pageContext.includes('password-strength-checker') && intent !== 'check_password') return 'passwords';
    if (pageContext.includes('hash-generator')) return 'hashing';
    return intent;
}

function generateResponse(intent: string, page: string, passwordCandidate?: string): string {
    if (intent === 'check_password' && passwordCandidate) {
        return generatePasswordExplanation(passwordCandidate);
    }
    
    const kbKey = intent === 'definition' ? 'main' : intent;
    const kb = knowledgeBases[kbKey];

    if (!kb) {
        return mainKB.general.explanation;
    }

    if (intent === 'passwords') {
        const info = kb.password_strength;
        const response = `${info.definition} ${info.why_important}\n\n**Best Practices:**\n${info.best_practices?.map(p => `- ${p}`).join('\n') || ''}`;
        return response + `\n\nI can also check a specific password for you. Just ask me something like: "Is 'my-test-password' strong?"`;
    }
    if (intent === 'hashing') {
        const info = kb.cryptographic_hashing;
        return `${info.definition} ${info.why_important}`;
    }
    if (intent === 'help') {
        if (page === 'Home Page') return mainKB.getting_started.explanation;
        if (page.startsWith('Blog')) return "I can help summarize this post or explain key terms. Just ask!";
        if (page.startsWith('Learn')) return "I can clarify concepts from this lesson. What are you curious about?";
        if (page.startsWith('Tool')) return `This tool helps with a specific cybersecurity task. I can explain what it does, the concepts behind it, or even check an input for you. For example, on the password checker page, you can ask me "Is 'P@ssw0rd123!' strong?"`;
        return mainKB.general.explanation;
    }
    if (intent === 'definition' && page && mainKB[page.toLowerCase().replace(/ /g,'_')]) {
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

    const { intent, passwordCandidate } = detectIntent(userQuery);
    const finalIntent = getContextualIntent(intent, pageContext);
    const response = generateResponse(finalIntent, page, passwordCandidate);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI assistant API:', error);
    return NextResponse.json({ response: 'Sorry, I encountered an internal error.' }, { status: 500 });
  }
}
