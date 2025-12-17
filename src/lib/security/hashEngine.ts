
export async function generateHash(
  text: string,
  algorithm: 'SHA-256' | 'SHA-384' | 'SHA-512'
): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));

  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
