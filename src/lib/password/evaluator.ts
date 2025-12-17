export type Strength =
  | "Very Weak"
  | "Weak"
  | "Moderate"
  | "Strong"
  | "Very Strong";

export function evaluatePassword(password: string) {
  let score = 0;
  const missing: string[] = [];

  if (password.length >= 12) score++;
  else missing.push("12+ characters");

  if (/[a-z]/.test(password)) score++;
  else missing.push("lowercase letters");

  if (/[A-Z]/.test(password)) score++;
  else missing.push("uppercase letters");

  if (/[0-9]/.test(password)) score++;
  else missing.push("numbers");

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else missing.push("symbols");

  const strength: Strength =
    score <= 1 ? "Very Weak" :
    score === 2 ? "Weak" :
    score === 3 ? "Moderate" :
    score === 4 ? "Strong" :
    "Very Strong";

  return {
    score,
    strength,
    missing,
    percentage: (score / 5) * 100,
  };
}
