// ── CIDR Calculator utils (IPv4) ────────────────────────────

export type CidrInfo = {
  cidr: string;
  prefix: number;
  mask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalHosts: number;
  usableHosts: number;
  networkDec: number;
  broadcastDec: number;
  rangeBinary: string;
};

const IPV4 = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;

export function ipToInt(ip: string): number {
  const m = ip.match(IPV4);
  if (!m) throw new Error(`Invalid IPv4 address: ${ip}`);
  let out = 0;
  for (let i = 1; i <= 4; i++) {
    const n = parseInt(m[i], 10);
    if (n < 0 || n > 255) throw new Error(`Octet out of range in ${ip}`);
    out = (out * 256) + n;
  }
  return out >>> 0;
}

export function intToIp(n: number): string {
  return [
    (n >>> 24) & 255,
    (n >>> 16) & 255,
    (n >>> 8)  & 255,
    n & 255,
  ].join(".");
}

export function prefixToMaskInt(prefix: number): number {
  if (prefix < 0 || prefix > 32) throw new Error("Prefix must be between 0 and 32");
  if (prefix === 0) return 0;
  return (0xffffffff << (32 - prefix)) >>> 0;
}

export function parseCidr(input: string): CidrInfo {
  const trimmed = input.trim();
  if (!trimmed.includes("/")) throw new Error("Expected ip/prefix format, e.g. 192.168.1.0/24");
  const [ip, prefixStr] = trimmed.split("/");
  const prefix = parseInt(prefixStr, 10);
  if (!Number.isFinite(prefix)) throw new Error(`Invalid prefix "${prefixStr}"`);
  const ipInt = ipToInt(ip);
  const mask = prefixToMaskInt(prefix);
  const wildcard = (~mask) >>> 0;
  const network = (ipInt & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;

  const totalHosts = prefix === 32 ? 1 : (prefix === 31 ? 2 : (wildcard + 1));
  const usableHosts =
    prefix >= 31 ? totalHosts : Math.max(0, totalHosts - 2);

  const firstHostInt = prefix >= 31 ? network   : (network + 1) >>> 0;
  const lastHostInt  = prefix >= 31 ? broadcast : (broadcast - 1) >>> 0;

  return {
    cidr: `${intToIp(network)}/${prefix}`,
    prefix,
    mask: intToIp(mask),
    wildcard: intToIp(wildcard),
    network: intToIp(network),
    broadcast: intToIp(broadcast),
    firstHost: intToIp(firstHostInt),
    lastHost: intToIp(lastHostInt),
    totalHosts,
    usableHosts,
    networkDec: network,
    broadcastDec: broadcast,
    rangeBinary: ipToBinary(network) + "  →  " + ipToBinary(broadcast),
  };
}

export function ipToBinary(n: number): string {
  const bits = n.toString(2).padStart(32, "0");
  return `${bits.slice(0, 8)}.${bits.slice(8, 16)}.${bits.slice(16, 24)}.${bits.slice(24, 32)}`;
}

export function classifyNetwork(info: CidrInfo): string {
  const first = info.networkDec >>> 24;
  if (first === 10) return "Private (RFC 1918 Class A)";
  if (first === 127) return "Loopback";
  if (first === 169 && ((info.networkDec >>> 16) & 255) === 254) return "Link-local (APIPA)";
  if (first === 172) {
    const second = (info.networkDec >>> 16) & 255;
    if (second >= 16 && second <= 31) return "Private (RFC 1918 Class B)";
  }
  if (first === 192 && ((info.networkDec >>> 16) & 255) === 168) return "Private (RFC 1918 Class C)";
  if (first >= 224 && first <= 239) return "Multicast";
  if (first >= 240) return "Reserved";
  return "Public";
}
