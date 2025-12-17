
import { NextResponse } from 'next/server';

/* =========================================================
   TYPES
========================================================= */

type QuickReply = {
  label: string;
  query: string;
};

type AIResponse = {
  text: string;
  quickReplies?: QuickReply[];
};

/* =========================================================
   INTENTS
========================================================= */

const intents = [
  // Password-related
  { name: 'password_check', keywords: ['is', 'password'], scope: 'passwords' },
  { name: 'password_strength', keywords: ['strong password', 'password strength'], scope: 'passwords' },
  { name: 'password_entropy', keywords: ['entropy'], scope: 'passwords' },
  { name: 'password_generator', keywords: ['generate password'], scope: 'passwords' },

  // Hash-related
  { name: 'hash_definition', keywords: ['what is hash', 'hashing'], scope: 'hashing' },
  { name: 'hash_vs_encryption', keywords: ['hash vs encryption'], scope: 'hashing' },
  { name: 'hash_usage', keywords: ['how to use hash', 'use hash'], scope: 'hashing' },
  { name: 'hash_security', keywords: ['reverse hash', 'crack hash'], scope: 'hashing' },

  // General
  { name: 'greeting', keywords: ['hi', 'hello', 'hey'], scope: 'general' },
  { name: 'help', keywords: ['help', '?'], scope: 'general' },
];

/* =========================================================
   INTENT DETECTION
========================================================= */

function detectIntent(message: string) {
  const text = message.toLowerCase().trim();

  // Extract password safely
  const pwMatch = text.match(/is\s+['"]?([^'"]{3,})['"]?\s+(strong|weak|safe|good)/);
  if (pwMatch) {
    return { name: 'password_check', value: pwMatch[1] };
  }

  for (const intent of intents) {
    if (intent.keywords.some(k => text.includes(k))) {
      return { name: intent.name, value: null };
    }
  }

  return { name: 'fallback', value: null };
}

/* =========================================================
   PASSWORD ENGINE (ACCURATE)
========================================================= */

function analyzePassword(pw: string) {
  let score = 0;
  const reasons: string[] = [];

  const common = ['password', '123456', 'qwerty', 'asdf'];
  if (common.includes(pw.toLowerCase())) {
    return { verdict: 'Very Weak', reasons: ['It is extremely common'] };
  }

  if (pw.length >= 16) score += 3;
  else if (pw.length >= 12) score += 2;
  else reasons.push('Too short (use 12–16+ characters)');

  if (/[a-z]/.test(pw)) score++;
  else reasons.push('Missing lowercase letters');

  if (/[A-Z]/.test(pw)) score++;
  else reasons.push('Missing uppercase letters');

  if (/\d/.test(pw)) score++;
  else reasons.push('Missing numbers');

  if (/[^a-zA-Z0-9]/.test(pw)) score += 2;
  else reasons.push('Missing symbols');

  let verdict: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong';
  if (score <= 2) verdict = 'Very Weak';
  else if (score <= 4) verdict = 'Weak';
  else if (score <= 6) verdict = 'Moderate';
  else verdict = 'Strong';

  return { verdict, reasons };
}

/* =========================================================
   PAGE CONTEXT
========================================================= */

function getPageScope(ctx: string) {
  if (ctx.includes('password')) return 'passwords';
  if (ctx.includes('hash')) return 'hashing';
  return 'general';
}

/* =========================================================
   RESPONSE ENGINE (THIS IS THE MAGIC)
========================================================= */

function generateResponse(
  intent: string,
  pageContext: string,
  value?: string | null
): AIResponse {
  const scope = getPageScope(pageContext);

  /* ---------- PASSWORD CHECK ---------- */
  if (intent === 'password_check' && value) {
    const result = analyzePassword(value);

    if (result.verdict === 'Strong') {
      return {
        text: `✅ **Strong password**

Why this is good:
• Long enough to resist brute-force attacks  
• Uses multiple character types  
• High entropy (hard to guess)

You’re doing this right 👍`,
        quickReplies: [
          { label: 'What is entropy?', query: 'What is password entropy?' },
          { label: 'Generate another', query: 'Generate a strong password' },
        ],
      };
    }

    return {
      text: `⚠️ **${result.verdict} password**

Issues detected:
${result.reasons.map(r => `• ${r}`).join('\n')}

Tip: Length matters more than complexity.`,
      quickReplies: [
        { label: 'How to fix this?', query: 'How do I make a strong password?' },
        { label: 'Use a password manager', query: 'What is a password manager?' },
      ],
    };
  }

  /* ---------- HASHING ---------- */
  if (intent === 'hash_definition') {
    return {
      text: `🔐 **Cryptographic hashing** turns any input into a fixed-length fingerprint.

Key ideas:
• One-way (cannot be reversed)
• Deterministic (same input → same output)
• Avalanche effect (tiny change → totally different hash)

Used for password storage, file integrity, and security checks.`,
      quickReplies: [
        { label: 'Hash vs encryption', query: 'Hash vs encryption' },
        { label: 'Why hashes are one-way', query: 'Can hashes be reversed?' },
      ],
    };
  }

  if (intent === 'hash_vs_encryption') {
    return {
      text: `Hashing and encryption solve different problems:

🔹 Hashing  
• One-way  
• Used for verification  
• Example: storing passwords securely  

🔹 Encryption  
• Two-way  
• Used for secrecy  
• Example: secure messages  

You hash passwords. You encrypt data.`,
    };
  }

  /* ---------- GREETING / HELP ---------- */
  if (intent === 'greeting' || intent === 'help') {
    if (scope === 'passwords') {
      return {
        text: `You’re on the **Password Strength Checker**.

You can:
• Test a password  
• Learn why passwords fail  
• Understand entropy & brute-force attacks  

Nothing you type is stored.`,
        quickReplies: [
          { label: 'Test a password', query: "Is 'P@ssword123' strong?" },
          { label: 'Why passwords fail', query: 'Why are weak passwords dangerous?' },
        ],
      };
    }

    if (scope === 'hashing') {
      return {
        text: `You’re using the **Hash Generator**.

This tool shows how data becomes a cryptographic fingerprint.
Try changing one character and watch the hash completely change.`,
        quickReplies: [
          { label: 'Explain hashing', query: 'What is cryptographic hashing?' },
          { label: 'Try an experiment', query: 'Why do hashes change so much?' },
        ],
      };
    }

    return {
      text: `I’m your cybersecurity tutor.

Ask me about:
• Password security  
• Hashing & encryption  
• How these tools work safely`,
    };
  }

  /* ---------- FALLBACK ---------- */
  return {
    text:
      scope === 'passwords'
        ? 'Try testing a password or ask how to improve one.'
        : scope === 'hashing'
        ? 'Ask how hashing works or why hashes are one-way.'
        : 'Ask me about cybersecurity basics or tools.',
  };
}

/* =========================================================
   API HANDLER
========================================================= */

export async function POST(req: Request) {
  try {
    const { userQuery, pageContext } = await req.json();

    if (!userQuery || !pageContext) {
      return NextResponse.json(
        { response: { text: 'Invalid request.' } },
        { status: 400 }
      );
    }

    const { name, value } = detectIntent(userQuery);
    const response = generateResponse(name, pageContext, value);

    return NextResponse.json({ response });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { response: { text: 'Internal server error.' } },
      { status: 500 }
    );
  }
}
