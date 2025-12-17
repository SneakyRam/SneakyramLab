export type PasswordAnalysis = {
  score: number;               // 0–100
  verdict: 'Very Weak' | 'Weak' | 'Moderate' | 'Strong' | 'Very Strong';
  entropy: number;             // bits
  crackTimeSeconds: number;
  crackTimeHuman: string;
  issues: string[];
};

const COMMON_PASSWORDS = ['password', '123456', 'qwerty', 'asdf'];

export function analyzePassword(password: string): PasswordAnalysis {
  let poolSize = 0;
  const issues: string[] = [];

  if (!password) {
    return emptyResult('No password provided');
  }

  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    return emptyResult('Extremely common password');
  }

  if (/[a-z]/.test(password)) poolSize += 26;
  else issues.push('Missing lowercase letters');

  if (/[A-Z]/.test(password)) poolSize += 26;
  else issues.push('Missing uppercase letters');

  if (/\d/.test(password)) poolSize += 10;
  else issues.push('Missing numbers');

  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 32;
  else issues.push('Missing symbols');

  if (password.length < 12) {
    issues.push('Too short (use 12–16+ characters)');
  }

  const entropy = password.length > 0 && poolSize > 0 ? Math.log2(Math.pow(poolSize, password.length)) : 0;
  const crackTimeSeconds = entropy > 0 ? Math.pow(2, entropy) / 1e10 : 0; // 10B guesses/sec
  const crackTimeHuman = formatTime(crackTimeSeconds);

  const score = Math.min(100, Math.round(entropy));

  const verdict =
    score < 30 ? 'Very Weak' :
    score < 50 ? 'Weak' :
    score < 70 ? 'Moderate' :
    score < 90 ? 'Strong' : 'Very Strong';

  return {
    score,
    verdict,
    entropy: Math.round(entropy),
    crackTimeSeconds,
    crackTimeHuman,
    issues,
  };
}

function emptyResult(reason: string): PasswordAnalysis {
  return {
    score: 0,
    verdict: 'Very Weak',
    entropy: 0,
    crackTimeSeconds: 0,
    crackTimeHuman: 'Instant',
    issues: [reason],
  };
}

function formatTime(seconds: number): string {
  if (seconds < 1) return 'Instant';
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  return `${Math.round(seconds / 31536000)} years`;
}
