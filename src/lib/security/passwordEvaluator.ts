import { calculateEntropy } from "./entropy";

export type Strength =
  | "Very Weak"
  | "Weak"
  | "Moderate"
  | "Strong"
  | "Very Strong";

export function evaluatePassword(password: string): {
  strength: Strength;
  entropy: number;
  missing: string[];
  percent: number;
} {
  let charset = 0;
  const missing: string[] = [];

  if (/[a-z]/.test(password)) {
    charset += 26;
  } else {
    missing.push("lowercase letters (a-z)");
  }

  if (/[A-Z]/.test(password)) {
    charset += 26;
  } else {
    missing.push("uppercase letters (A-Z)");
  }

  if (/[0-9]/.test(password)) {
    charset += 10;
  } else {
    missing.push("numbers (0-9)");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    charset += 32; // A common estimate for symbols
  } else {
    missing.push("symbols (!@#$, etc.)");
  }

  if (password.length < 12) {
    missing.push("at least 12 characters");
  }
  
  const entropy = calculateEntropy(password.length, charset);

  let strength: Strength;
  if (entropy < 40) {
    strength = "Very Weak";
  } else if (entropy < 60) {
    strength = "Weak";
  } else if (entropy < 80) {
    strength = "Moderate";
  } else if (entropy < 100) {
    strength = "Strong";
  } else {
    strength = "Very Strong";
  }

  return {
    strength,
    entropy,
    missing,
    // We cap the percentage at 100 for the progress bar display
    percent: Math.min(entropy, 100), 
  };
}
