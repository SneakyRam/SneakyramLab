
export type EncodingType =
  | 'base64'
  | 'url'
  | 'html'
  | 'hex'
  | 'binary';

export function encode(text: string, type: EncodingType): string {
  switch (type) {
    case 'base64':
      try {
        return btoa(unescape(encodeURIComponent(text)));
      } catch (e) {
        return '⚠️ Error during Base64 encoding. Ensure input is valid.';
      }

    case 'url':
      return encodeURIComponent(text);

    case 'html':
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

    case 'hex':
      return Array.from(text)
        .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(' ');

    case 'binary':
      return Array.from(text)
        .map(c => c.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ');

    default:
      return text;
  }
}

export function decode(text: string, type: EncodingType): string {
  try {
    switch (type) {
      case 'base64':
        return decodeURIComponent(escape(atob(text)));

      case 'url':
        return decodeURIComponent(text);

      case 'html':
        if (typeof window === 'undefined') return 'HTML decoding only works in a browser.';
        const txt = document.createElement('textarea');
        txt.innerHTML = text;
        return txt.value;

      case 'hex':
        return text
          .split(' ')
          .filter(h => h) // Remove empty strings from trailing spaces
          .map(h => String.fromCharCode(parseInt(h, 16)))
          .join('');

      case 'binary':
        return text
          .split(' ')
          .filter(b => b) // Remove empty strings from trailing spaces
          .map(b => String.fromCharCode(parseInt(b, 2)))
          .join('');

      default:
        return text;
    }
  } catch (e) {
    console.error(`Error decoding ${type}:`, e);
    return `⚠️ Invalid input for ${type} decoding.`;
  }
}
