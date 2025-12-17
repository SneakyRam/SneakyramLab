
import { EncodingType } from './textEncoderEngine';

export function explainEncoding(type: EncodingType) {
  switch (type) {
    case 'base64':
      return `Base64 is an **encoding**, not encryption. It converts binary data (like images or files) into a readable string of ASCII characters. It's commonly used to embed data in text-based formats like JSON or XML. Anyone can decode it.`;

    case 'url':
      return `URL encoding (or percent-encoding) makes sure that data in a URL is correctly interpreted. It replaces unsafe characters like spaces, slashes, and ampersands with a % followed by two hexadecimal digits.`;

    case 'html':
      return `HTML entity encoding is a crucial security measure to prevent Cross-Site Scripting (XSS). It converts characters like < and > into safe codes (e.g., &lt; and &gt;), so the browser displays them as text instead of executing them as code.`;

    case 'hex':
      return `Hexadecimal is a base-16 number system. It's a more human-friendly way to represent binary data than staring at 1s and 0s. It's often used in low-level programming, memory dumps, and to represent cryptographic keys or hashes.`;

    case 'binary':
      return `Binary is the fundamental language of computers, representing all data as a series of 1s and 0s (bits). This view shows you the raw binary representation of each character in your text, typically using the 8-bit ASCII or UTF-8 standard.`;

    default:
      return 'Select an encoding type to learn about its purpose and common uses in cybersecurity and web development.';
  }
}
