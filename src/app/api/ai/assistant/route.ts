
import { NextResponse } from 'next/server';
import passwordsKB from '@/ai/knowledge/passwords.json';
import hashingKB from '@/ai/knowledge/hashing.json';
import mainKB from '@/ai/knowledge/main.json';

// --- START: Intent and Knowledge Base Definitions ---

type KB = Record<string, any>;
const knowledgeBases: Record<string, KB> = {
  passwords: passwordsKB,
  hashing: hashingKB,
  main: mainKB,
};

const intents = [
  // Hashing Intents
  { name: 'hash_definition', keywords: ['what is hash', 'what is hashing', 'cryptographic hashing', 'explain hash', 'define hash'], scope: 'hashing' },
  { name: 'hash_usage', keywords: ['how to use', 'use this', 'use hash', 'generate hash', 'how do i use'], scope: 'hashing' },
  { name: 'hash_deterministic', keywords: ['always the same', 'same hash', 'deterministic'], scope: 'hashing' },
  { name: 'hash_avalanche', keywords: ['avalanche effect', 'different hash', 'small change'], scope: 'hashing' },
  { name: 'hash_security', keywords: ['is hash safe', 'can hash be reversed', 'is hash secure', 'crack hash', 'reverse hash', 'decrypt hash'], scope: 'hashing' },
  { name: 'hash_md5_unsafe', keywords: ['why is md5', 'md5 unsafe', 'md5 broken', 'is md5 bad'], scope: 'hashing' },
  { name: 'hash_algorithm_diff', keywords: ['sha-256 vs', 'difference between', 'which algorithm'], scope: 'hashing' },
  
  // Password Intents
  { name: 'password_strength_check', keywords: ["is my password", "is password", "check password", "rate password", "test a password"], scope: 'passwords' },
  { name: 'password_definition', keywords: ['what is a password', 'define password'], scope: 'passwords' },
  { name: 'password_strength', keywords: ['what makes a password strong', 'strong password', 'password strength', 'improve password'], scope: 'passwords' },
  { name: 'password_entropy', keywords: ['what is entropy', 'password entropy'], scope: 'passwords' },
  { name: 'password_generator', keywords: ['password generator', 'generate a password'], scope: 'passwords' },
  
  // General Intents
  { name: 'greeting', keywords: ['hi', 'hello', 'hey', '?', 'what'], scope: 'general' },
  { name: 'help', keywords: ['help', 'what can you do'], scope: 'general' },
];

function detectIntent(message: string): { name: string; extractedValue?: string | null } {
  const text = message.toLowerCase().trim();

  // Special case for password checking to extract the password
  const passCheckMatch = text.match(/is(?:\s+my\s+password)?\s+['"]?([^'"]+)['"]?\s+(strong|safe|good)/);
  if (passCheckMatch && passCheckMatch[1]) {
    return { name: 'password_strength_check', extractedValue: passCheckMatch[1] };
  }

  for (const intent of intents) {
    if (intent.keywords.some(k => text.includes(k))) {
      return { name: intent.name, extractedValue: null };
    }
  }

  return { name: 'fallback', extractedValue: null };
}

// --- END: Intent and Knowledge Base Definitions ---


// --- START: Password Analysis Engine ---

function analyzePassword(pw: string): { score: number; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
  
    if (!pw) {
      reasons.push("No password was provided.");
      return { score: 0, reasons };
    }

    const commonPasswords = ["password", "123456", "qwerty", "12345678", "asdf", "123456789"];
    if (commonPasswords.includes(pw.toLowerCase())) {
        reasons.push("is a very common and easily guessed password");
        score = 0;
        return { score, reasons };
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

    if (reasons.length === 0 && score > 0) {
        return `✅ Your password is rated as **Strong**. It meets all the recommended criteria for a modern password. 

Quick tip: Adding length improves security more than symbols. Would you like me to generate a strong example password?`;
    }

    const reasonText = reasons.map(r => `• It ${r}`).join('\n');
    
    return `
Your password is rated as **${verdict}**.

Here's why:
${reasonText}

To improve your password security, try making it longer and including all character types: lowercase, uppercase, numbers, and symbols.

Want to see:
1. How long it would take to crack (educational)
2. How to improve it
3. Examples of strong passwords
    `.trim();
}


// --- END: Password Analysis Engine ---


// --- START: Response Generation ---

function getPageScope(pageContext: string): 'hashing' | 'passwords' | 'general' {
    if (pageContext.includes('hash-generator')) return 'hashing';
    if (pageContext.includes('password-strength-checker')) return 'passwords';
    return 'general';
}

function generateResponse(intentName: string, pageContext: string, value?: string | null): string {
    const pageScope = getPageScope(pageContext);
    const intentScope = intents.find(i => i.name === intentName)?.scope;
    
    // Page-aware intent redirection
    if (intentScope && pageScope !== 'general' && intentScope !== pageScope) {
        if (intentScope === 'hashing') return "It looks like you're asking about hashing. This tool is for passwords. Try asking me on the Hash Generator page!";
        if (intentScope === 'passwords') return "You're asking about passwords, but you're on the Hash Generator page. Try asking me on the Password Strength Checker page!";
    }

    // Page-specific greetings for generic intents
    if (intentName === 'greeting') {
        if (pageScope === 'hashing') {
            return `No worries — curious or confused is how learning starts.

Try this experiment:
• Hash the word \`hello\`
• Then hash \`Hello\`

Notice how the output completely changes. That’s called the **avalanche effect**. Want me to explain why this matters?`;
        }
        if (pageScope === 'passwords') {
            return `No worries — this tool is best learned by trying.

Try this:
• Type a simple password like \`password123\`
• Then try a longer one like \`river-orange-laptop-moon\`

Want me to explain why one is safer than the other?`;
        }
    }


    switch (intentName) {
        // Hashing Responses
        case 'hash_definition':
            return `Cryptographic hashing turns data into a fixed-length fingerprint.

**Key properties:**
• **One-way** (cannot be reversed)
• **Deterministic** (same input → same output)
• **Sensitive to changes** (avalanche effect)

Hashes are **not** encryption. Would you like to see where hashes are used in real systems?`;
        case 'hash_usage':
            return `To use the Hash Generator:

1.  Enter text in the input box
2.  Select a hashing algorithm
3.  View the generated hash instantly

Your text is processed locally in your browser. Nothing is sent or stored. Want to compare two algorithms side by side?`;
        case 'hash_avalanche':
            return `The **avalanche effect** is a core security principle of hashing. It means even a tiny change to the input (like changing one letter or capitalization) results in a completely different and unpredictable hash. This prevents attackers from guessing inputs by looking for patterns in the output.`
        case 'hash_deterministic':
            return `Hashes are **deterministic**, which means the same input will always produce the exact same hash. This is a critical feature for verifying data integrity, like checking if a downloaded file is correct or validating a password without storing it.`;
        case 'hash_security':
            return `No. Cryptographic hashes are one-way functions and **cannot be reversed** or "decrypted." The mathematical process destroys information, making it impossible to get the original input back from the output hash. When you hear about "hash cracking," it refers to guessing inputs until a match is found, not reversing the hash itself.`;
        case 'hash_md5_unsafe':
            return `MD5 is considered broken and unsafe for security because it suffers from **collision vulnerabilities**. This means attackers can create two different inputs that produce the exact same MD5 hash, which makes it useless for things like digital signatures or verifying file authenticity against malicious changes.`;

        // Password Responses
        case 'password_strength_check':
            if (value) {
                return generatePasswordExplanation(value);
            }
            return `I can check that for you. Just send the password you want to test. 
            
Example: Is \`MyP@ssw0rd123!\` strong?
            
Don’t worry — this tool does not store passwords.`;
        case 'password_strength':
            return `A strong password has high **entropy**, which means it's unpredictable. This is achieved through:\n\n• **Length:** At least 16+ characters is ideal.\n• **Character Variety:** A mix of uppercase, lowercase, numbers, and symbols.\n• **Unpredictability:** Avoids common words, names, or keyboard patterns.`;
        case 'password_entropy':
             return `**Entropy** is a measure of a password's unpredictability, measured in "bits". The higher the entropy, the more guesses an attacker would need to make to crack it. It's the most accurate way to measure password strength.`;

        // General Responses
        case 'greeting':
            return `Hello! I'm your AI cybersecurity tutor. You can ask me to explain concepts or check the strength of a password. How can I help?`;
        
        // Smart Fallback
        default: 
            if (pageScope === 'hashing') {
                return `I'm not fully sure what you meant.\n\nOn this page, people usually ask:\n• Why hashes look random\n• Why the same input gives the same hash\n• Why hashes can’t be reversed\n\nWhich one are you curious about?`;
            }
            if (pageScope === 'passwords') {
                return `I'm not fully sure what you meant.\n\nOn this page, people usually ask:\n• To check if a password is strong\n• What entropy is\n• How to create a secure password\n\nTry asking me: "Is 'Tr0ub4dor&3' a good password?"`;
            }
             return `I can help explain cybersecurity concepts, evaluate password safety, and guide you through the tools on this site.\n\nTry asking me:\n• "What is cryptographic hashing?"\n• "Is 'MyP@ssword123!' a strong password?"\n• "How do I use the hash generator?"`;
    }
}

// --- END: Response Generation ---


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userQuery, pageContext } = body;

    if (typeof userQuery !== 'string' || typeof pageContext !== 'string') {
      return NextResponse.json({ response: 'Invalid request parameters.' }, { status: 400 });
    }
    
    const { name, extractedValue } = detectIntent(userQuery);
    const response = generateResponse(name, pageContext, extractedValue);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI assistant API:', error);
    return NextResponse.json({ response: 'Sorry, I encountered an internal error.' }, { status: 500 });
  }
}
