// ── Word Counter utils ─────────────────────────────

export type CountOptions = {
  ignoreCase: boolean;
  excludeNumbers: boolean;
  excludePunctuation: boolean;
};

export type CountResult = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  uniqueWords: number;
  readingTimeSec: number;
  topWords: { word: string; count: number }[];
};

export const DEFAULT_OPTIONS: CountOptions = {
  ignoreCase: true,
  excludeNumbers: false,
  excludePunctuation: true,
};

export function countText(text: string, opts: CountOptions): CountResult {
  const lineCount = text.split("\n").length;

  const paragraphs =
    text.split(/\n{2,}/).filter((p) => p.trim().length > 0).length ||
    (text.trim() ? 1 : 0);

  const sentences = (text.match(/[^.!?]*[.!?]+/g) || []).length;

  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;

  let wordSource = text;
  if (opts.excludePunctuation) wordSource = wordSource.replace(/[^\w\s]|_/g, " ");
  if (opts.excludeNumbers) wordSource = wordSource.replace(/\b\d+\b/g, " ");

  const rawWords = wordSource.match(/\b\w+\b/g) || [];
  const words = rawWords.length;

  const freq = new Map<string, number>();
  for (const w of rawWords) {
    const key = opts.ignoreCase ? w.toLowerCase() : w;
    freq.set(key, (freq.get(key) || 0) + 1);
  }
  const uniqueWords = freq.size;

  const topWords = [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  const readingTimeSec = Math.ceil((words / 200) * 60);

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines: lineCount,
    uniqueWords,
    readingTimeSec,
    topWords,
  };
}

export function formatReadingTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s read`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `${m}m ${s}s read` : `${m}m read`;
}

export const EXAMPLE_INPUTS = [
  `The quick brown fox jumps over the lazy dog. This classic sentence contains every letter of the alphabet at least once. It has been used for decades to test typewriters, keyboards, and fonts.`,
  `To be, or not to be, that is the question.\nWhether 'tis nobler in the mind to suffer\nThe slings and arrows of outrageous fortune,\nOr to take arms against a sea of troubles.`,
  `Word counters are useful tools for writers, students, and content creators. They help you track progress toward a goal, stay within a limit, or simply understand the scope of your writing.`,
  `In 2024, artificial intelligence transformed how we work and communicate. Over 1 billion users adopted AI tools daily. The technology advanced rapidly, with new models releasing every few months.`,
];