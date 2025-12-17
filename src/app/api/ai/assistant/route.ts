
import { NextResponse } from 'next/server';
import passwordsKB from '@/ai/knowledge/passwords.json';
import hashingKB from '@/ai/knowledge/hashing.json';
import mainKB from '@/ai/knowledge/main.json';

// --- START: Types and Interfaces ---

type KnowledgeBase = Record<string, any>;
type QuickReply = { label: string; query: string };
type AIResponse = {
  text: string;
  quickReplies?: QuickReply[];
};

// --- END: Types and Interfaces ---


// --- START: Knowledge Base and Intent Definitions ---

const knowledgeBases: Record<string, KnowledgeBase> = {
  passwords: passwordsKB,
  hashing: hashingKB,
  main: mainKB,
};

const intents = [
  // Password Intents (High Priority)
  { name: 'password_strength_check', keywords: ["is my password", "is password", "check password", "rate password", "test a password", "is this password"], scope: 'passwords' },
  { name: 'password_strength', keywords: ['what makes a password strong', 'strong password', 'password strength', 'improve password'], scope: 'passwords' },
  { name: 'password_entropy', keywords: ['what is entropy', 'password entropy'], scope: 'passwords' },
  { name: 'password_generator', keywords: ['password generator', 'generate a password'], scope: 'passwords' },
  { name: 'password_manager', keywords: ['password manager', 'password managers'], scope: 'passwords' },
  { name: 'passphrase_definition', keywords: ['what is a passphrase', "what's a passphrase"], scope: 'passwords' },
  
  // Hashing Intents
  { name: 'hash_definition', keywords: ['what is hash', 'what is hashing', 'cryptographic hashing', 'explain hash', 'define hash'], scope: 'hashing' },
  {
    name: 'hash_vs_encryption',
    keywords: [
      'hash vs encryption',
      'difference between hashing and encryption',
      'hashing vs encryption'
    ],
    scope: 'hashing'
  },
  { name: 'hash_usage', keywords: ['how to use', 'use this', 'use hash', 'generate hash', 'how do i use', 'where are hashes used'], scope: 'hashing' },
  { name: 'hash_security', keywords: ['is hash safe', 'can hash be reversed', 'is hash secure', 'crack hash', 'reverse hash', 'decrypt hash', "why hashes can't be reversed", "why is hash one-way"], scope: 'hashing' },
  { name: 'hash_avalanche', keywords: ['avalanche effect', 'different hash', 'small change', 'why hashes look random'], scope: 'hashing' },
  { name: 'hash_deterministic', keywords: ['always the same', 'same hash', 'deterministic', 'why is my hash always the same'], scope: 'hashing' },
  { name: 'hash_md5_unsafe', keywords: ['why is md5', 'md5 unsafe', 'md5 broken', 'is md5 bad'], scope: 'hashing' },
  { name: 'hash_algorithm_diff', keywords: ['sha-256 vs', 'difference between', 'which algorithm', 'compare two algorithms'], scope: 'hashing' },
  
  // General Intents
  { name: 'greeting', keywords: ['hi', 'hello', 'hey'], scope: 'general' },
  { name: 'help', keywords: ['help', 'what can you do', '?'], scope: 'general' },
];

function detectIntent(message: string): { name: string; extractedValue?: string | null } {
  const text = message.toLowerCase().trim();

  // Regex specifically for password checking intent to extract the password
  const passCheckMatch = text.match(/is\s+['"]?([^'"]+)['"]?\s+(strong|safe|good|weak|ok)\??/);
  if (passCheckMatch && passCheckMatch[1]) {
    return { name: 'password_strength_check', extractedValue: passCheckMatch[1] };
  }

  // Check for keywords with prioritization (order of `intents` array matters)
  for (const intent of intents) {
    if (intent.keywords.some(k => text.includes(k))) {
      return { name: intent.name, extractedValue: null };
    }
  }

  return { name: 'fallback', extractedValue: null };
}

// --- END: Knowledge Base and Intent Definitions ---


// --- START: Deterministic Password Analysis Engine ---

function analyzePassword(pw: string): { score: number; verdict: "Very Weak" | "Weak" | "Moderate" | "Strong"; reasons: string[] } {
    let score = 0;
    const reasons: string[] = [];
  
    if (!pw) {
        reasons.push("No password was provided.");
        return { score: 0, verdict: "Very Weak", reasons };
    }

    const commonPasswords = ["password", "123456", "qwerty", "12345678", "asdf", "123456789"];
    if (commonPasswords.includes(pw.toLowerCase())) {
        reasons.push("is a very common and easily guessed password");
        score = 0;
        return { score, verdict: "Very Weak", reasons };
    }

    // Length score
    if (pw.length < 8) {
      reasons.push("is less than 8 characters long");
    } else if (pw.length >= 12) {
      score += 2;
    } else {
      score += 1;
    }
  
    // Character variety score
    if (/[a-z]/.test(pw)) {
      score += 1;
    } else {
      reasons.push("does not contain lowercase letters");
    }
  
    if (/[A-Z]/.test(pw)) {
      score += 1;
    } else {
      reasons.push("does not contain uppercase letters");
    }
  
    if (/\d]/.test(pw)) {
      score += 1;
    } else {
      reasons.push("does not contain numbers");
    }
  
    if (/[^a-zA-Z0-9]/.test(pw)) {
      score += 2;
    } else {
      reasons.push("does not contain special symbols");
    }
    
    let verdict: "Very Weak" | "Weak" | "Moderate" | "Strong";
    if (score <= 2) verdict = "Very Weak";
    else if (score <= 4) verdict = "Weak";
    else if (score <= 6) verdict = "Moderate";
    else verdict = "Strong";

    return { score, verdict, reasons };
}

function generatePasswordExplanation(password: string): AIResponse {
    const analysis = analyzePassword(password);

    if (analysis.reasons.length === 0) {
        return {
          text: `✅ This password is rated as **Strong**.\n\nHere's why:\n• It meets the recommended length of 12+ characters.\n• It includes a mix of uppercase letters, lowercase letters, numbers, and symbols.\n\nThis is a solid password for general use.`,
          quickReplies: [
            { label: "What is entropy?", query: "What is password entropy?" },
            { label: "What's a passphrase?", query: "What is a passphrase?" },
          ]
        };
    }

    const reasonText = analysis.reasons.map(r => `• It ${r}`).join('\n');
    
    return {
      text: `This password is rated as **${analysis.verdict}**. Here's why:\n\n${reasonText}`,
      quickReplies: [
        { label: "How do I improve it?", query: "How do I improve my password?"},
        { label: "Why is length important?", query: "What is password length important?"},
      ]
    };
}


// --- END: Deterministic Password Analysis Engine ---


// --- START: Response Generation ---

function getPageScope(pageContext: string): 'hashing' | 'passwords' | 'general' {
    if (pageContext.includes('hash-generator')) return 'hashing';
    if (pageContext.includes('password-strength-checker')) return 'passwords';
    return 'general';
}

function generateResponse(intentName: string, pageContext: string, value?: string | null): AIResponse {
    const pageScope = getPageScope(pageContext);
    const intentScope = intents.find(i => i.name === intentName)?.scope;
    
    // Page-aware intent redirection
    if (intentScope && pageScope !== 'general' && intentScope !== pageScope) {
        if (intentScope === 'hashing') return { text: "It looks like you're asking about hashing. For the best experience, try asking me on the Hash Generator page!", quickReplies: [{label: "Take me to Hash Generator", query: "NAVIGATE:/tools/hash-generator"}] };
        if (intentScope === 'passwords') return { text: "You're asking about passwords, but you're on the Hash Generator page. Let's head over to the Password Strength Checker page for that!", quickReplies: [{label: "Go to Password Checker", query: "NAVIGATE:/tools/password-strength-checker"}] };
    }

    // Page-specific greetings for generic intents
    if (intentName === 'greeting' || intentName === 'help') {
        if (pageScope === 'hashing') {
            return {
              text: "You’re using the Hash Generator. This tool converts text into a cryptographic hash. Hashes are used to verify data integrity, store passwords securely, and detect tampering. Want a quick demo or an explanation?",
              quickReplies: [
                { label: "Give me an experiment", query: "Suggest a hashing experiment" },
                { label: "Explain hashing", query: "What is cryptographic hashing?" }
              ]
            };
        }
        if (pageScope === 'passwords') {
            return {
              text: "You’re on the Password Strength Checker. This tool helps you understand password security. You can test a password or ask me questions about creating strong, secure credentials.",
              quickReplies: [
                { label: "Test a password", query: "Is 'MyP@ssw0rd!123' strong?" },
                { label: "Why are some passwords weak?", query: "Why are passwords weak?" },
                { label: "What is 'entropy'?", query: "What is password entropy?" },
              ]
            };
        }
    }

    switch (intentName) {
        // Hashing Responses
        case 'hash_definition':
            return {
              text: `Cryptographic hashing turns data into a fixed-length fingerprint called a **hash**.\n\nKey properties:\n• **One-way:** Hashes cannot be reversed to get the original input.\n• **Deterministic:** The same input always creates the same hash.\n• **Avalanche Effect:** A tiny change to the input completely changes the output hash.\n\nIt's a fundamental tool for verifying data integrity, but it is NOT encryption.`,
              quickReplies: [
                { label: "Where are hashes used?", query: "Where are hashes used?" },
                { label: "What's the difference vs. encryption?", query: "What is the difference between hashing and encryption?" },
              ]
            };
        case 'hash_usage':
            return {
              text: "To use the Hash Generator:\n\n1.  Enter any text into the input field.\n2.  Select a hashing algorithm (like SHA-256).\n3.  View the generated hash instantly.\n\nThis is great for learning how hashes work or for verifying file checksums. Everything is processed in your browser for privacy.",
              quickReplies: [
                { label: "Suggest an experiment", query: "Suggest a hashing experiment" },
                { label: "Why can't hashes be reversed?", query: "Why are hashes one-way?" },
              ]
            };
        case 'hash_avalanche':
            return {
              text: `The **avalanche effect** is a core security principle of hashing. It means even a tiny change to the input (like changing one letter or capitalization) results in a completely different and unpredictable hash. This prevents attackers from guessing inputs by looking for patterns in the output.`
            };
        case 'hash_deterministic':
            return {
              text: `Hashes are **deterministic**, which means the same input will always produce the exact same hash. This is a critical feature for verifying data integrity, like checking if a downloaded file is correct or validating a password without storing it.`
            };
        case 'hash_security':
            return {
              text: `No. Cryptographic hashes are one-way functions and **cannot be reversed** or "decrypted." The mathematical process destroys information, making it impossible to get the original input back from the output hash. When you hear about "hash cracking," it refers to guessing inputs until a match is found, not reversing the hash itself.`
            };
        case 'hash_md5_unsafe':
            return {
              text: `MD5 is considered broken and unsafe for security because it suffers from **collision vulnerabilities**. This means attackers can create two different inputs that produce the exact same MD5 hash, which makes it useless for things like digital signatures or verifying file authenticity against malicious changes.`
            };
        case 'hash_vs_encryption':
            return {
                text: `This is a critical distinction:\n\n• **Hashing** is a **one-way** function used for **verification** (e.g., checking a password without storing it).\n• **Encryption** is a **two-way** function used for **secrecy** (e.g., protecting a private message so it can be read later).\n\nHashing verifies. Encryption hides.`,
                quickReplies: [
                    { label: "Where are hashes used?", query: "Where are hashes used?" },
                ]
            };

        // Password Responses
        case 'password_strength_check':
            if (value) {
                // Here, we use the deterministic analyzer. The AI only explains the result.
                return generatePasswordExplanation(value);
            }
            return {
              text: `I can check that for you. Just send the password you want to test. \n\nExample: Is 'MyP@ssw0rd123!' strong?\n\nDon’t worry — I don't store or transmit the passwords you enter here.`
            };
        case 'password_strength':
            return {
              text: `A strong password has high **entropy**, which means it's unpredictable. This is achieved through:\n\n• **Length:** At least 16+ characters is ideal.\n• **Character Variety:** A mix of uppercase, lowercase, numbers, and symbols.\n• **Unpredictability:** Avoids common words, names, or keyboard patterns.`
            };
        case 'password_entropy':
             return {
              text: `**Entropy** is a measure of a password's unpredictability, measured in "bits". The higher the entropy, the more guesses an attacker would need to make to crack it. It's the most accurate way to measure password strength.`,
               quickReplies: [
                { label: "What makes a password strong?", query: "What makes a password strong?" },
              ]
             };
        case 'passphrase_definition':
            return {
                text: "A **passphrase** is a sequence of words used as a password, like `river-orange-laptop-moon`. They are often much more secure than traditional complex passwords because their length provides very high entropy, while still being easier for a human to remember."
            };
        case 'password_manager':
            return {
                text: "A **password manager** is an application that securely stores all your different passwords in an encrypted vault. They can also generate unique, strong passwords for you. Using one is the single best thing you can do for your password security."
            };

        // General Responses
        case 'greeting':
             return {
                text: "Hello! I'm your AI cybersecurity tutor. You can ask me to explain concepts or check the strength of a password. How can I help?",
                quickReplies: [
                    { label: "What is hashing?", query: "What is cryptographic hashing?" },
                    { label: "Check a password", query: "Is 'MyP@ssword123!' a strong password?" },
                ]
            };
        
        // Smart Fallback
        default: 
            if (pageScope === 'hashing') {
                return {
                  text: `I'm not fully sure what you meant. On this page, I can help with:`,
                  quickReplies: [
                    { label: "Why hashes look random", query: "What is the avalanche effect?"},
                    { label: "Why hashes can't be reversed", query: "Can hashes be reversed?"},
                    { label: "How to use this tool", query: "How do I use this tool?"}
                  ]
                };
            }
            if (pageScope === 'passwords') {
                return {
                  text: `I'm not fully sure what you meant. On this page, people usually ask:`,
                  quickReplies: [
                    { label: "To check a password", query: "Check a password" },
                    { label: "What 'entropy' is", query: "What is password entropy?" },
                    { label: "How to create a secure password", query: "How do I make a strong password?" },
                  ]
                };
            }
             return {
               text: `I can help explain cybersecurity concepts, evaluate password safety, and guide you through the tools on this site.`,
                quickReplies: [
                    { label: "What is hashing?", query: "What is cryptographic hashing?" },
                    { label: "Is 'MyP@ssword123!' strong?", query: "Is 'MyP@ssword123!' strong?" },
                ]
             };
    }
}

// --- END: Response Generation ---


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userQuery, pageContext } = body;

    if (typeof userQuery !== 'string' || typeof pageContext !== 'string') {
      return NextResponse.json({ response: { text: 'Invalid request parameters.' } }, { status: 400 });
    }
    
    const { name, extractedValue } = detectIntent(userQuery);
    const response = generateResponse(name, pageContext, extractedValue);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in AI assistant API:', error);
    return NextResponse.json({ response: { text: 'Sorry, I encountered an internal error.' } }, { status: 500 });
  }
}
