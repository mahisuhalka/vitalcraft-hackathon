// Crockford-style alphabet without ambiguous characters (no I, L, O, U, 0, 1).
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTVWXYZ";

/**
 * Non-sequential, random registration reference, e.g. "VC-7KQ2-M9XD".
 * A reference is an identifier for humans — it is never an auth credential.
 */
export function generateReference(prefix = "VC"): string {
  const bytes = new Uint8Array(8);
  globalThis.crypto.getRandomValues(bytes);
  const chars = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${prefix}-${chars.slice(0, 4)}-${chars.slice(4)}`;
}
