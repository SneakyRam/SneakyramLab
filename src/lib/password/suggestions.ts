export function generateSuggestions(missing: string[]) {
  if (missing.length === 0) {
    return ["Great password! Use a password manager to store it safely."];
  }

  return missing.map((item) => `Add ${item}`);
}
