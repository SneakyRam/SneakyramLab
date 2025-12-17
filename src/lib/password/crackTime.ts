export function estimateCrackTime(password: string) {
  const length = password.length;
  let charsetSize = 0;

  if (/[a-z]/.test(password)) charsetSize += 26;
  if (/[A-Z]/.test(password)) charsetSize += 26;
  if (/[0-9]/.test(password)) charsetSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32;

  if (charsetSize === 0) return "Instantly";

  const combinations = Math.pow(charsetSize, length);
  const guessesPerSecond = 1e9; // educational estimate
  const seconds = combinations / guessesPerSecond;

  if (seconds < 60) return "Seconds";
  if (seconds < 3600) return "Minutes";
  if (seconds < 86400) return "Hours";
  if (seconds < 31536000) return "Days";
  if (seconds < 3153600000) return "Years";
  return "Centuries+";
}
