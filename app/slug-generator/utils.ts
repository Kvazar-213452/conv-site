// ── Slug Generator utils ─────────────────────────────────────

export type SlugOptions = {
  separator: "-" | "_" | ".";
  lowercase: boolean;
  removeStopWords: boolean;
  maxLength: number | null;
  locale: "en" | "uk" | "de" | "fr" | "es";
};

const STOP_WORDS: Record<string, string[]> = {
  en: ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "of", "with", "by", "is", "are", "was", "were"],
  uk: ["і", "та", "або", "але", "у", "в", "на", "до", "для", "за", "з", "що", "як", "це", "він", "вона", "вони"],
  de: ["der", "die", "das", "ein", "eine", "und", "oder", "aber", "in", "an", "auf", "zu", "für", "von", "mit", "ist"],
  fr: ["le", "la", "les", "un", "une", "des", "et", "ou", "mais", "dans", "sur", "à", "pour", "de", "du", "par"],
  es: ["el", "la", "los", "las", "un", "una", "y", "o", "pero", "en", "sobre", "a", "para", "de", "del", "por"],
};

// Transliteration map for Cyrillic
const CYRILLIC_MAP: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",є:"ye",ж:"zh",з:"z",и:"y",і:"i",ї:"yi",
  й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",
  х:"kh",ц:"ts",ч:"ch",ш:"sh",щ:"shch",ь:"",ю:"yu",я:"ya",ё:"yo",э:"e",ъ:"",ы:"y",
  А:"A",Б:"B",В:"V",Г:"G",Д:"D",Е:"E",Є:"Ye",Ж:"Zh",З:"Z",И:"Y",І:"I",Ї:"Yi",
  Й:"Y",К:"K",Л:"L",М:"M",Н:"N",О:"O",П:"P",Р:"R",С:"S",Т:"T",У:"U",Ф:"F",
  Х:"Kh",Ц:"Ts",Ч:"Ch",Ш:"Sh",Щ:"Shch",Ь:"",Ю:"Yu",Я:"Ya",Ё:"Yo",Э:"E",Ъ:"",Ы:"Y",
};

function transliterate(text: string): string {
  return text.split("").map(ch => CYRILLIC_MAP[ch] ?? ch).join("");
}

export function generateSlug(text: string, opts: SlugOptions): string {
  if (!text.trim()) return "";

  let result = transliterate(text);

  // Normalize unicode: decompose accented chars
  result = result.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  if (opts.lowercase) {
    result = result.toLowerCase();
  }

  // Remove stop words
  if (opts.removeStopWords) {
    const stopWords = STOP_WORDS[opts.locale] ?? STOP_WORDS.en;
    const words = result.split(/\s+/);
    const filtered = words.filter(
      (w) => !stopWords.includes(w.toLowerCase())
    );
    result = filtered.length > 0 ? filtered.join(" ") : result;
  }

  // Replace non-alphanumeric chars (except spaces) with separator
  result = result.replace(/[^a-zA-Z0-9\s]/g, " ");

  // Replace whitespace runs with the separator
  result = result.trim().replace(/\s+/g, opts.separator);

  // Remove leading/trailing separators
  const sep = opts.separator;
  const escapedSep = sep.replace(".", "\\.");
  result = result.replace(new RegExp(`^${escapedSep}+|${escapedSep}+$`, "g"), "");

  // Collapse multiple separators
  result = result.replace(new RegExp(`${escapedSep}{2,}`, "g"), sep);

  // Max length (trim at separator boundary)
  if (opts.maxLength && result.length > opts.maxLength) {
    result = result.slice(0, opts.maxLength);
    result = result.replace(new RegExp(`${escapedSep}[^${escapedSep}]*$`), "");
  }

  return result;
}

export const DEFAULT_OPTIONS: SlugOptions = {
  separator: "-",
  lowercase: true,
  removeStopWords: false,
  maxLength: null,
  locale: "en",
};

export const EXAMPLE_INPUTS = [
  "Hello World! This is a Test",
  "Привіт Світ! Це тест для генератора",
  "10 Ways to Boost Your SEO in 2025",
  "Über die Straße / Auf dem Weg",
  "  Multiple   Spaces   And---Dashes  ",
];