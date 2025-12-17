export function calculateEntropy(length: number, charsetSize: number): number {
  if (!length || !charsetSize) {
    return 0;
  }
  // Entropy H = L * log2(N)
  // L = length of the password
  // N = number of possible characters (charset size)
  const entropy = length * Math.log2(charsetSize);
  return Math.round(entropy);
}
