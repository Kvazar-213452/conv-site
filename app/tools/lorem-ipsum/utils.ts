// ── Lorem Ipsum Generator utils ─────────────────────────────────────

export type LoremUnit = "paragraphs" | "sentences" | "words";

export type LoremOptions = {
  unit: LoremUnit;
  count: number;
  startWithLorem: boolean;
};

const WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "eu", "fugiat", "nulla", "pariatur", "excepteur",
  "sint", "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui",
  "officia", "deserunt", "mollit", "anim", "id", "est", "laborum", "curabitur",
  "pretium", "tincidunt", "lacus", "nulla", "gravida", "orci", "a", "odio",
  "nullam", "varius", "turpis", "molestie",
];

const LOREM_START = ["lorem", "ipsum", "dolor", "sit", "amet"];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomWord(): string {
  return WORDS[randomInt(0, WORDS.length - 1)];
}

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function buildSentence(wordCount: number): string {
  const words: string[] = [];
  for (let i = 0; i < wordCount; i++) {
    words.push(randomWord());
  }
  words[0] = capitalize(words[0]);
  if (wordCount > 6 && Math.random() < 0.4) {
    const commaIdx = randomInt(2, wordCount - 3);
    words[commaIdx] = words[commaIdx] + ",";
  }
  return words.join(" ") + ".";
}

function buildParagraph(sentenceCount: number): string {
  const sentences: string[] = [];
  for (let i = 0; i < sentenceCount; i++) {
    sentences.push(buildSentence(randomInt(8, 16)));
  }
  return sentences.join(" ");
}

export function generateLorem(opts: LoremOptions): string {
  const count = Math.max(1, Math.min(opts.count, 500));

  switch (opts.unit) {
    case "words": {
      const words: string[] = [];
      if (opts.startWithLorem) {
        for (const w of LOREM_START.slice(0, Math.min(count, LOREM_START.length))) {
          words.push(w);
        }
      }
      while (words.length < count) {
        words.push(randomWord());
      }
      words[0] = capitalize(words[0]);
      return words.slice(0, count).join(" ") + ".";
    }
    case "sentences": {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && opts.startWithLorem) {
          const rest: string[] = [];
          for (let j = 0; j < randomInt(5, 11); j++) rest.push(randomWord());
          sentences.push(
            capitalize(LOREM_START.join(" ")) + " " + rest.join(" ") + ".",
          );
        } else {
          sentences.push(buildSentence(randomInt(8, 16)));
        }
      }
      return sentences.join(" ");
    }
    case "paragraphs": {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        if (i === 0 && opts.startWithLorem) {
          const first = capitalize(LOREM_START.join(" ")) + " " +
            buildSentence(randomInt(10, 14));
          const rest = buildParagraph(randomInt(2, 4));
          paragraphs.push(first + " " + rest);
        } else {
          paragraphs.push(buildParagraph(randomInt(3, 6)));
        }
      }
      return paragraphs.join("\n\n");
    }
  }
}

export const DEFAULT_LOREM_OPTIONS: LoremOptions = {
  unit: "paragraphs",
  count: 3,
  startWithLorem: true,
};
