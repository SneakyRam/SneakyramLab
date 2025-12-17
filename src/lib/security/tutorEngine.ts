import { PasswordAnalysis } from './passwordEngine';

export function tutorResponse(result: PasswordAnalysis) {
  if (result.verdict === 'Very Strong') {
    return `Excellent password. This would take **${result.crackTimeHuman}** to crack.
You’re well above average security.`;
  }
  
  if (result.issues.length === 0 && result.verdict !== 'Very Strong') {
     return `
Your password is **${result.verdict}**.

🔎 Entropy: ${result.entropy} bits
⏳ Estimated crack time: ${result.crackTimeHuman}

This is a good start, but you can make it even stronger by increasing the length.

Tip: Length increases security more than complexity.
`;
  }

  return `
Your password is **${result.verdict}**.

🔎 Entropy: ${result.entropy} bits
⏳ Estimated crack time: ${result.crackTimeHuman}

Issues:
${result.issues.map(i => `• ${i}`).join('\n')}

Tip: Length increases security more than complexity.
`;
}
