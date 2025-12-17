
export function explainHashing(context: {
  algorithm: string;
  avalanche?: number;
}) {
  if (context.avalanche && context.avalanche > 40) { // Lowered threshold to trigger more often
    return `This demonstrates the **avalanche effect**.

A tiny input change caused over **${context.avalanche}%** of the hash to change. This property is crucial for security, as it prevents attackers from predicting hash outputs based on similar inputs.`;
  }

  if (context.algorithm === 'SHA-256') {
    return `SHA-256 is a modern, secure cryptographic hash function used in:
• Password storage verification
• Digital signatures & file integrity
• Blockchain systems like Bitcoin

It's considered a standard for security applications. It is one-way and collision-resistant.`;
  }
  
    if (context.algorithm === 'SHA-512') {
    return `SHA-512 is a stronger variant of SHA-256, producing a longer 512-bit hash. It's used in very high-security scenarios where maximum collision resistance is required.`;
  }

  return `Cryptographic hashes convert data of any size into a fixed-length fingerprint. They are used for **verifying data integrity**, not for keeping data secret (that's encryption).`;
}
