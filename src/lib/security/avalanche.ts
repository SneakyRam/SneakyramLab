
export function avalancheDifference(hashA: string, hashB: string): number {
  let diff = 0;

  for (let i = 0; i < Math.min(hashA.length, hashB.length); i++) {
    if (hashA[i] !== hashB[i]) diff++;
  }

  // Handle case where one hash is empty to avoid division by zero
  if (hashA.length === 0) {
    return 0;
  }

  return Math.round((diff / hashA.length) * 100);
}
