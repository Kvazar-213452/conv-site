// ── Unix Permissions utils ──────────────────────────────────

export type Who = "owner" | "group" | "other";

export type Perms = {
  owner: { r: boolean; w: boolean; x: boolean };
  group: { r: boolean; w: boolean; x: boolean };
  other: { r: boolean; w: boolean; x: boolean };
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
};

export const EMPTY_PERMS: Perms = {
  owner: { r: false, w: false, x: false },
  group: { r: false, w: false, x: false },
  other: { r: false, w: false, x: false },
  setuid: false,
  setgid: false,
  sticky: false,
};

export function numericToPerms(numeric: string): Perms {
  const cleaned = numeric.trim();
  if (!/^[0-7]{3,4}$/.test(cleaned)) {
    throw new Error("Expected 3 or 4 octal digits, e.g. 755 or 0755");
  }
  const padded = cleaned.length === 3 ? "0" + cleaned : cleaned;
  const [special, u, g, o] = padded.split("").map((d) => parseInt(d, 10));
  const triad = (n: number) => ({
    r: (n & 4) !== 0,
    w: (n & 2) !== 0,
    x: (n & 1) !== 0,
  });
  return {
    owner: triad(u),
    group: triad(g),
    other: triad(o),
    setuid: (special & 4) !== 0,
    setgid: (special & 2) !== 0,
    sticky: (special & 1) !== 0,
  };
}

export function permsToNumeric(p: Perms): string {
  const triad = (t: { r: boolean; w: boolean; x: boolean }) =>
    (t.r ? 4 : 0) + (t.w ? 2 : 0) + (t.x ? 1 : 0);
  const special = (p.setuid ? 4 : 0) + (p.setgid ? 2 : 0) + (p.sticky ? 1 : 0);
  return `${special}${triad(p.owner)}${triad(p.group)}${triad(p.other)}`;
}

export function permsToSymbolic(p: Perms): string {
  const bit = (b: boolean, ch: string) => (b ? ch : "-");
  const triad = (t: { r: boolean; w: boolean; x: boolean }, specialX: boolean, specialCh: string) => {
    const r = bit(t.r, "r");
    const w = bit(t.w, "w");
    let x = bit(t.x, "x");
    if (specialX) x = t.x ? specialCh.toLowerCase() : specialCh.toUpperCase();
    return r + w + x;
  };
  return (
    triad(p.owner, p.setuid, "s") +
    triad(p.group, p.setgid, "s") +
    triad(p.other, p.sticky, "t")
  );
}

export function symbolicToPerms(sym: string): Perms {
  const s = sym.trim();
  if (s.length !== 9 && s.length !== 10) {
    throw new Error("Expected 9 characters (rwxrwxrwx) or 10 with leading type bit");
  }
  const body = s.length === 10 ? s.slice(1) : s;
  if (!/^[r-][w-][xsStT-][r-][w-][xsStT-][r-][w-][xsStT-]$/.test(body)) {
    throw new Error("Invalid symbolic permissions");
  }
  const parseTriad = (block: string, specialCh: string) => {
    const r = block[0] === "r";
    const w = block[1] === "w";
    const specialUpper = specialCh.toUpperCase();
    const special = block[2] === specialCh || block[2] === specialUpper;
    const x = block[2] === "x" || block[2] === specialCh.toLowerCase();
    return { r, w, x, special };
  };
  const u = parseTriad(body.slice(0, 3), "s");
  const g = parseTriad(body.slice(3, 6), "s");
  const o = parseTriad(body.slice(6, 9), "t");
  return {
    owner: { r: u.r, w: u.w, x: u.x },
    group: { r: g.r, w: g.w, x: g.x },
    other: { r: o.r, w: o.w, x: o.x },
    setuid: u.special,
    setgid: g.special,
    sticky: o.special,
  };
}

export function describePerms(p: Perms): string[] {
  const describe = (name: string, t: { r: boolean; w: boolean; x: boolean }) => {
    const parts: string[] = [];
    if (t.r) parts.push("read");
    if (t.w) parts.push("write");
    if (t.x) parts.push("execute");
    return `${name}: ${parts.length ? parts.join(" + ") : "no access"}`;
  };
  const lines = [
    describe("Owner", p.owner),
    describe("Group", p.group),
    describe("Other", p.other),
  ];
  const special: string[] = [];
  if (p.setuid) special.push("setuid");
  if (p.setgid) special.push("setgid");
  if (p.sticky) special.push("sticky bit");
  if (special.length) lines.push(`Special: ${special.join(", ")}`);
  return lines;
}
