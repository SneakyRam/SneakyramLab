export function estimateCrackTime(entropy: number) {
  if (entropy === 0) return "Instantly";
  // Assuming 1 billion guesses per second (a high-end estimate for educational purposes)
  const guessesPerSecond = 1e9; 
  const combinations = Math.pow(2, entropy);
  const seconds = combinations / guessesPerSecond;

  if (seconds < 1) return "< 1 second";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.round(seconds / 86400)} days`; // 30 days
  if (seconds < 31536000) return `${Math.round(seconds / 2592000)} months`;
  if (seconds < 31536000000) return `${Math.round(seconds / 31536000)} years`; // 1000 years
  
  return "Centuries+";
}
