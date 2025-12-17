
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
  { name: 'password_check', keywords: ["is '", "is \"", 'check password'], scope: 'passwords' },
  { name: 'password_strength', keywords: ['strong password', 'password strength', 'make a strong password', 'how do i make a strong password'], scope: 'passwords' },
  { name: 'password_entropy', keywords: ['entropy', 'password entropy'], scope: 'passwords' },
  { name: 'password_generator', keywords: ['generate password'], scope: 'passwords' },
  { name: 'password_manager', keywords: ['password manager'], scope: 'passwords' },
  { name: 'passphrase', keywords: ['passphrase'], scope: 'passwords' },

  // Hashing Intents
  { name: 'hash_definition', keywords: ['what is hash', 'what is hashing', 'cryptographic hashing', 'explain hash', 'define hash'], scope: 'hashing' },
  { name: 'hash_vs_encryption', keywords: ["hash vs encryption", "difference between hashing and encryption", "hashing vs encryption"], scope: 'hashing' },
  { name: 'hash_usage', keywords: ['how to use', 'use this', 'use hash', 'generate hash', 'how do i use', 'where are hashes used'], scope: 'hashing' },
  { name: 'hash_security', keywords: ['is hash safe', 'can hash be reversed', 'is hash secure', 'crack hash', 'reverse hash', 'decrypt hash', "why hashes can't be reversed", "why is hash one-way"], scope: 'hashing' },
  { name: 'hash_avalanche', keywords: ['avalanche effect', 'different hash', 'small change', 'why hashes look random'], scope: 'hashing' },

  // General
  { name: 'greeting', keywords: ['hi', 'hello', 'hey'], scope: 'general' },
  { name: 'help', keywords: ['help', '?'], scope: 'general' },
];

/* =========================================================
   INTENT DETECTION
========================================================= */

function detectIntent(message: string) {
  const text = message.toLowerCase().trim();

  // More robust password extraction
  const pwMatch = text.match(/(is|check)\s+['"](.+?)['"]?/);
  if (pwMatch && pwMatch[2]) {
    return { name: 'password_check', value: pwMatch[2] };
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

  const common = ['password', '123456', 'qwerty', 'asdf', '12345678', '111111'];
  if (common.includes(pw.toLowerCase())) {
    return { verdict: 'Very Weak', reasons: ['This is a very common and easily guessed password.'] };
  }

  if (pw.length >= 12) {
    score += 2;
  } else if (pw.length >= 8) {
    score += 1;
  } else {
    reasons.push('Is shorter than 12 characters.');
  }

  if (/[a-z]/.test(pw)) {
    score++;
  } else {
    reasons.push('Does not contain lowercase letters.');
  }

  if (/[A-Z]/.test(pw)) {
    score++;
  } else {
    reasons.push('Does not contain uppercase letters.');
  }

  if (/\d/.test(pw)) {
    score++;
  } else {
    reasons.push('Does not contain numbers.');
  }

  if (/[^a-zA-Z0-9]/.test(pw)) {
    score++;
  } else {
    reasons.push('Does not contain symbols.');
  }

  let verdict: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong';
  if (score <= 2) verdict = 'Very Weak';
  else if (score <= 4) verdict = 'Weak';
  else if (score <= 5) verdict = 'Moderate';
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

Here's the analysis:
• Good length
• Uses multiple character types (uppercase, lowercase, numbers, and symbols)
• No obvious patterns found

This is a solid password. Remember to use a unique one for every site.`,
        quickReplies: [
          { label: 'What is entropy?', query: 'What is password entropy?' },
          { label: 'What\'s a passphrase?', query: 'What is a passphrase?' },
        ],
      };
    }

    return {
      text: `⚠️ **${result.verdict} password**

Here's what the analysis found:
${result.reasons.map(r => `• ${r}`).join('\n')}

**Tip:** A long passphrase is often stronger and easier to remember than a short, complex password.`,
      quickReplies: [
        { label: 'How to make a strong password?', query: 'How do I make a strong password?' },
        { label: 'Explain passphrases', query: 'What is a passphrase?' },
      ],
    };
  }
  
  if (intent === 'password_strength') {
    return {
        text: `A strong password has:
• **Length:** 16+ characters is best.
• **Variety:** A mix of uppercase, lowercase, numbers, and symbols.
• **Unpredictability:** Avoids common words or personal info.

The best way to create and manage strong passwords is to use a password manager.`,
        quickReplies: [
            { label: "What is a password manager?", query: "What is a password manager?" },
            { label: "What is a passphrase?", query: "What is a passphrase?" },
        ]
    }
  }

  if (intent === 'passphrase') {
      return {
          text: `A **passphrase** is a password made of multiple words, like "correct-horse-battery-staple".

They are often **more secure** and **easier to remember** than traditional passwords because their length provides massive security (high entropy).`
      }
  }


  /* ---------- HASHING ---------- */
  if (intent === 'hash_definition') {
    return {
      text: `🔐 **Cryptographic hashing** turns any input (like a password or a file) into a unique, fixed-length fingerprint called a hash.

Key properties:
• **One-way:** You can't get the original input back from the hash.
• **Deterministic:** The same input always produces the same hash.
• **Avalanche Effect:** A tiny change in the input creates a completely different hash.`,
      quickReplies: [
        { label: 'Hash vs. encryption?', query: 'What is the difference between hashing and encryption?' },
        { label: "Why can't hashes be reversed?", query: "Why can't hashes be reversed?" },
      ],
    };
  }

  if (intent === 'hash_vs_encryption') {
    return {
      text: `Hashing and encryption solve different problems:

🔹 **Hashing** is a one-way process used for **verification**. You hash a password to check if it's correct without ever storing the password itself.

🔹 **Encryption** is a two-way process used for **secrecy**. You encrypt a message to hide it, and the recipient uses a key to decrypt it.

In short: **Hashing verifies, encryption hides.**`,
    };
  }
  
  if (intent === 'hash_usage') {
    return {
        text: `Hashes are used everywhere for security! Common uses include:

• **Storing Passwords Securely:** Websites store the hash of your password, not the password itself.
• **Verifying File Downloads:** A file's hash (checksum) proves it wasn't corrupted or tampered with.
• **Blockchains:** Hashes link blocks of transactions together in cryptocurrencies like Bitcoin.`
    }
  }


  /* ---------- GREETING / HELP ---------- */
  if (intent === 'greeting' || intent === 'help') {
    if (scope === 'passwords') {
      return {
        text: `You’re on the **Password Strength Checker**. I can analyze a password for you or explain security concepts.

What would you like to know?`,
        quickReplies: [
          { label: 'Test a password', query: "Is 'P@ssword123' strong?" },
          { label: 'What is a strong password?', query: 'What is a strong password?' },
          { label: "What's a passphrase?", query: 'What is a passphrase?' },
        ],
      };
    }

    if (scope === 'hashing') {
      return {
        text: `You’re using the **Hash Generator**. This tool shows how data becomes a cryptographic fingerprint.

Ask me a question or try an experiment!`,
        quickReplies: [
          { label: 'What is hashing for?', query: 'Where are hashes used?' },
          { label: 'Hash vs. Encryption', query: 'What is the difference between hashing and encryption?' },
        ],
      };
    }

    return {
      text: `I’m your AI cybersecurity tutor. How can I help you today?`,
       quickReplies: [
          { label: 'What is hashing?', query: 'What is hashing?' },
          { label: 'Check a password', query: "Is 'password123' good?" },
        ]
    };
  }

  /* ---------- FALLBACK ---------- */
  return {
    text:
      scope === 'passwords'
        ? "I can help with that. Try asking me to check a password, like \"Is 'MyP@ssw0rd' strong?\", or ask a question like 'What is a passphrase?'"
        : scope === 'hashing'
        ? "I can help with that. Try asking 'What is hashing?' or 'What is the difference between hashing and encryption?'"
        : "Sorry, I'm not sure how to answer that. I can explain cybersecurity concepts or check passwords. How can I help?",
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
