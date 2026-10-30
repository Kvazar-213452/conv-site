// ── Password Generator utils ─────────────────────────────────

export type PasswordOptions = {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
};

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>/?";
const AMBIGUOUS = /[Il1O0oB8S5Z2]/g;

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 20,
  lowercase: true,
  uppercase: true,
  digits: true,
  symbols: true,
  excludeAmbiguous: false,
};

function secureInt(max: number): number {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] % max;
}

function buildAlphabet(opts: PasswordOptions): string {
  let alphabet = "";
  if (opts.lowercase) alphabet += LOWER;
  if (opts.uppercase) alphabet += UPPER;
  if (opts.digits) alphabet += DIGITS;
  if (opts.symbols) alphabet += SYMBOLS;
  if (opts.excludeAmbiguous) alphabet = alphabet.replace(AMBIGUOUS, "");
  return alphabet;
}

export function generatePassword(opts: PasswordOptions): string {
  const alphabet = buildAlphabet(opts);
  if (!alphabet) {
    throw new Error("Select at least one character set");
  }
  const length = Math.max(4, Math.min(opts.length, 256));
  let out = "";
  for (let i = 0; i < length; i++) {
    out += alphabet[secureInt(alphabet.length)];
  }
  return out;
}

export type StrengthLevel = "weak" | "fair" | "strong" | "excellent";

export function estimateStrength(password: string): {
  level: StrengthLevel;
  entropyBits: number;
} {
  const classes = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
  const poolSize =
    (/[a-z]/.test(password) ? 26 : 0) +
    (/[A-Z]/.test(password) ? 26 : 0) +
    (/[0-9]/.test(password) ? 10 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 26 : 0);
  const entropyBits = password.length * Math.log2(Math.max(poolSize, 2));

  let level: StrengthLevel = "weak";
  if (entropyBits >= 128) level = "excellent";
  else if (entropyBits >= 80) level = "strong";
  else if (entropyBits >= 50) level = "fair";

  if (classes <= 1 && level === "excellent") level = "strong";
  return { level, entropyBits: Math.round(entropyBits) };
}
