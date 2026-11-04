import bcrypt from 'bcryptjs';
export async function bcryptOperation(password: string, mode: string, cost: number, encoded = ''): Promise<string> {
  const size = new TextEncoder().encode(password).length;
  if (!size || size > 72) throw new Error('Enter a password containing 1–72 UTF-8 bytes; longer input is rejected to avoid bcrypt truncation.');
  if (mode === 'hash') {
    if (!Number.isInteger(cost) || cost < 4 || cost > 12) throw new Error('Generation cost must be an integer from 4 to 12.');
    return bcrypt.hash(password, cost);
  }
  if (mode !== 'verify') throw new Error('Choose hash generation or verification.');
  const hash = encoded.trim();
  if (!/^\$2[aby]\$(?:0[4-9]|1[0-4])\$[./A-Za-z0-9]{53}$/.test(hash)) throw new Error('Paste a complete bcrypt hash with an encoded cost from 4 to 14.');
  const matched = await bcrypt.compare(password, hash);
  return matched ? 'MATCH — the supplied password matches this bcrypt hash.' : 'NO MATCH — the supplied password does not match this bcrypt hash.';
}
