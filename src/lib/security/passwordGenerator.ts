export function generatePassword(length = 16): string {
  const chars =
    'abcdefghijklmnopqrstuvwxyz' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
    '0123456789' +
    '!@#$%^&*()-_=+[]{}<>?';

  let result = '';
  crypto.getRandomValues(new Uint32Array(length)).forEach(v => {
    result += chars[v % chars.length];
  });

  return result;
}
