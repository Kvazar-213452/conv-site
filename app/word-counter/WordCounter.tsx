"use client";

import { useState, useCallback } from "react";
import {
  countText,
  formatReadingTime,
  DEFAULT_OPTIONS,
  EXAMPLE_INPUTS,
  type CountOptions,
  type CountResult,
} from "./utils";
import { BarChart2, Lock, Settings2 } from "lucide-react";

import "@/app/css/main.css";
import "@/app/css/bar.css";
import "@/app/css/bar_footer.css";
import "./main.css";

const STAT_CARDS = (r: CountResult) => [
  { value: r.words, label: "Words", accent: true },
  { value: r.characters, label: "Characters", accent: false },
  { value: r.charactersNoSpaces, label: "No spaces", accent: false },
  { value: r.sentences, label: "Sentences", accent: false },
  { value: r.paragraphs, label: "Paragraphs", accent: false },
  { value: r.lines, label: "Lines", accent: false },
  { value: r.uniqueWords, label: "Unique words", accent: false },
  { value: formatReadingTime(r.readingTimeSec), label: "Reading time", accent: false },
];

export default function WordCounter() {
  const [input, setInput] = useState(EXAMPLE_INPUTS[0]);
  const [opts, setOpts] = useState<CountOptions>(DEFAULT_OPTIONS);
  const [result, setResult] = useState<CountResult | null>(null);
  const [counting, setCounting] = useState(false);
  const [error, setError] = useState("");

  const count = useCallback(() => {
    setError("");
    if (!input.trim()) { setResult(null); return; }
    setCounting(true);
    setTimeout(() => {
      try {
        setResult(countText(input, opts));
      } catch (e) {
        setError((e as Error).message);
      }
      setCounting(false);
    }, 180);
  }, [input, opts]);

  const loadExample = () => {
    const r = EXAMPLE_INPUTS[Math.floor(Math.random() * EXAMPLE_INPUTS.length)];
    setInput(r);
    setResult(null);
    setError("");
  };

  const clearAll = () => { setInput(""); setResult(null); setError(""); };

  const setOpt = <K extends keyof CountOptions>(key: K, val: CountOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: val }));
    setResult(null);
  };

  const maxTopCount = result?.topWords[0]?.count ?? 1;

  return (
    <>
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-eyebrow">
          <div className="hero-dot" aria-hidden="true" />
          Free · No sign-up · Runs in browser
        </div>
        <h1 id="hero-heading">
          Word <em>Counter</em>
        </h1>
        <p>
          Paste any text and instantly get words, characters, sentences, paragraphs,
          reading time, unique words, and top word frequency. Runs 100% in your
          browser — nothing leaves your device.
        </p>
      </section>

      {error && (
        <div className="error-bar" role="alert" aria-live="assertive">
          <span aria-hidden="true">✕</span>
          <span>Error: {error}</span>
        </div>
      )}

      <section aria-label="Word Counter">

        {/* Single textarea panel */}
        <div className={`panel panel--full${error ? " has-error" : ""}`}>
          <div className="panel-header">
            <div className="panel-title">
              <div className="dot json" aria-hidden="true" />
              Text Input
              {result && !counting && (
                <span className="success-tag">✓ {result.words} words</span>
              )}
            </div>
            <div className="panel-actions">
              <button className="btn-ghost" onClick={loadExample}>Example</button>
              <button className="btn-ghost" onClick={() => { setInput(""); setResult(null); setError(""); }}>Clear</button>
            </div>
          </div>
          <textarea
            aria-label="Text Input"
            placeholder={"Paste or type your text here…"}
            value={input}
            onChange={(e) => { setInput(e.target.value); setResult(null); setError(""); }}
            spellCheck={false}
            autoCorrect="off"
            autoCapitalize="off"
            style={{ minHeight: "220px" }}
          />
        </div>

        {/* Options */}
        <div className="options-bar">
          <label>
            <Settings2 size={14} aria-hidden="true" />
            Options:
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.ignoreCase}
              onChange={(e) => setOpt("ignoreCase", e.target.checked)}
            />
            Case-insensitive word frequency
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.excludePunctuation}
              onChange={(e) => setOpt("excludePunctuation", e.target.checked)}
            />
            Exclude punctuation
          </label>
          <label>
            <input
              type="checkbox"
              checked={opts.excludeNumbers}
              onChange={(e) => setOpt("excludeNumbers", e.target.checked)}
            />
            Exclude numbers
          </label>
        </div>

        {/* Action Buttons */}
        <div className="actions">
          <button className="btn-secondary" onClick={loadExample}>Load Example</button>
          <button
            className="btn-convert"
            onClick={count}
            disabled={counting || !input.trim()}
            aria-busy={counting}
          >
            {counting
              ? <><div className="btn-spinner" aria-hidden="true" /> Counting…</>
              : <><BarChart2 size={16} aria-hidden="true" className="mr-1" /> Count Words</>
            }
          </button>
          <button className="btn-secondary" onClick={clearAll}>Clear All</button>
        </div>

        {/* Stats grid */}
        {result && !counting && (
          <div className="wc-stats" aria-live="polite">
            <div className="wc-grid">
              {STAT_CARDS(result).map(({ value, label, accent }) => (
                <div className={`wc-card${accent ? " wc-card--accent" : ""}`} key={label}>
                  <span className="wc-card-value">{value}</span>
                  <span className="wc-card-label">{label}</span>
                </div>
              ))}
            </div>

            {/* Top words */}
            {result.topWords.length > 0 && (
              <div className="wc-top">
                <h3 className="wc-top-title">Top Words</h3>
                <div className="wc-bars">
                  {result.topWords.map(({ word, count }) => (
                    <div className="wc-bar-row" key={word}>
                      <span className="wc-bar-word">{word}</span>
                      <div className="wc-bar-track">
                        <div
                          className="wc-bar-fill"
                          style={{ width: `${Math.round((count / maxTopCount) * 100)}%` }}
                          aria-label={`${count} occurrences`}
                        />
                      </div>
                      <span className="wc-bar-count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="seo-content" aria-labelledby="about-heading">
        <h2 id="about-heading">About Word Counter & Text Statistics Tool</h2>
        <p>
          This free online word counter tool provides instant, comprehensive text analysis including word count, character
          count (with and without spaces), sentence count, paragraph count, line count, unique word count, estimated reading
          time, and top word frequency analysis. Whether you're a writer tracking word limits, a student checking essay
          length, a content creator optimizing articles, or an SEO specialist analyzing text density, our tool delivers
          detailed statistics instantly with configurable options for case-insensitive counting, punctuation exclusion,
          and number filtering. Everything runs 100% in your browser with real-time analysis.
        </p>

        <h3>Why Use a Word Counter?</h3>
        <p>
          Word count matters in countless scenarios: academic essays have strict word limits (500, 1000, 2500 words), blog
          posts need optimal length for SEO (1500-2500 words), social media has character restrictions (Twitter 280, LinkedIn
          3000), manuscripts require specific ranges for submission, grant proposals must meet exact requirements, and
          content writers bill by word count. Manual counting is tedious, error-prone, and time-consuming, especially for
          long documents. Automated word counting provides instant accuracy, tracks progress toward goals, ensures compliance
          with requirements, analyzes text complexity and readability, identifies overused words, estimates reading time for
          audience planning, and helps optimize content length for different platforms and purposes.
        </p>

        <h3>How to Use This Word Counter</h3>
        <p>
          Simply paste or type your text into the input area and the word counter automatically analyzes it when you click
          "Count Words." The tool displays comprehensive statistics: total word count (your primary metric), character count
          with spaces (for platforms with character limits), character count without spaces (for certain academic requirements),
          sentence count (for readability analysis), paragraph count (for structure assessment), line count (for poetry or
          formatted text), unique word count (vocabulary diversity), and estimated reading time based on average reading
          speed. Configure options to enable case-insensitive word frequency (treat "Word" and "word" as the same), exclude
          punctuation from counts, or exclude numbers from word counts. View top word frequency with visual bar charts showing
          your most-used words.
        </p>

        <h3>Key Benefits</h3>
        <ul>
          <li><strong>No installation required:</strong> Works directly in your browser without any software downloads</li>
          <li><strong>Completely free:</strong> No registration, credit card, or hidden fees</li>
          <li><strong>Secure and private:</strong> All counting happens locally - your text never reaches our servers</li>
          <li><strong>Instant analysis:</strong> Real-time word count and statistics with no waiting</li>
          <li><strong>Comprehensive stats:</strong> 8+ metrics including reading time and word frequency</li>
          <li><strong>Top words analysis:</strong> Visual bar chart of most frequently used words</li>
          <li><strong>Configurable options:</strong> Case-insensitive counting, punctuation/number exclusion</li>
          <li><strong>Reading time estimate:</strong> Helps plan content length for target audience attention spans</li>
        </ul>

        <h3>Common Use Cases</h3>
        <p>
          Students and academics use word counters for meeting essay requirements (250, 500, 1000, 1500 words), checking
          dissertation and thesis chapters against guidelines, verifying abstract lengths (150-300 words), ensuring research
          paper sections meet journal requirements, tracking progress on writing assignments, staying within scholarship
          essay limits. Content writers and bloggers optimize article length for SEO (1500-2500 words ideal), track word
          count for client deliverables and billing, ensure social media posts meet character limits, analyze keyword density
          and word frequency, check meta description lengths (150-160 characters), maintain consistent post lengths across
          series. Authors and editors track manuscript word counts for publisher requirements (novels 80,000-100,000 words),
          monitor chapter lengths for consistency, analyze vocabulary diversity with unique word counts, identify overused
          words and repetitive phrasing, estimate reading time for chapters or sections. Marketing professionals verify ad
          copy character limits, optimize email subject lines (40-50 characters), ensure landing page content hits target
          lengths, analyze competitor content word counts. SEO specialists analyze content length against ranking competitors,
          optimize for featured snippet lengths (40-60 words), verify title tag lengths (50-60 characters), check keyword
          frequency and density.
        </p>

        <h3>Understanding Text Statistics</h3>
        <p>
          Words: Counted using whitespace and punctuation separation (contractions like "don't" count as one word). Characters
          with spaces: Total character count including spaces, tabs, and line breaks (important for Twitter, SMS, meta
          descriptions). Characters without spaces: Useful for certain academic and technical requirements that exclude
          whitespace. Sentences: Counted by detecting period, exclamation mark, and question mark endings (helps assess
          readability). Paragraphs: Separated by blank lines or double line breaks (indicates content structure). Lines:
          Physical lines in the text (useful for poetry, code, or formatted content). Unique words: Distinct words used,
          indicating vocabulary diversity (higher is better for rich content). Reading time: Estimated at 200-250 words per
          minute average reading speed (helps plan content consumption time). Top words: Most frequently used words with
          occurrence counts (helps identify keyword density and potential overuse).
        </p>

        <h3>Supported Features</h3>
        <p>
          The word counter handles comprehensive text analysis with multiple counting algorithms: word detection using Unicode
          word boundaries, punctuation-aware sentence detection, paragraph separation by blank lines, line counting with
          different line ending formats (Unix LF, Windows CRLF), character counting with and without whitespace, unique word
          identification with optional case-insensitive matching, reading time calculation based on average reading speed,
          word frequency analysis showing top 10 most-used words with visual bar charts. Configuration options include
          case-insensitive word frequency (treats "Word", "word", "WORD" as identical), punctuation exclusion (removes
          periods, commas, quotes from counts), number exclusion (filters out numeric values from word counts), and real-time
          updates as you type or paste content. Supports all languages including English, Spanish, French, German, Russian,
          Chinese, Arabic, and other Unicode text.
        </p>

        <h3>Technical Features</h3>
        <p>
          The counter uses efficient text parsing algorithms that handle large documents (10,000+ words) instantly, correctly
          identifies word boundaries for multiple languages, handles various punctuation marks and special characters,
          processes different line ending formats, calculates reading time based on research-backed averages (200-250 WPM),
          generates word frequency distributions with O(n) complexity, supports Unicode text including emoji and special
          characters, displays top words with visual bar charts showing relative frequencies, provides accurate counts even
          with complex formatting, and updates statistics in real-time. The tool includes clear visual presentation of
          statistics, highlighted primary metrics, and responsive design for mobile and desktop use.
        </p>

        <h3>Privacy and Security</h3>
        <p>
          Unlike online word counters that upload your documents to remote servers, this tool processes everything locally
          in your browser using JavaScript. Your essays, articles, manuscripts, blog posts, academic papers, creative writing,
          personal notes, confidential documents, or any text content never leave your computer, making it completely safe
          for counting words in unpublished manuscripts, confidential reports, sensitive documents, draft articles, personal
          journals, or any private writing. No cookies, tracking, data storage, or server communication. Perfect for working
          with proprietary content, academic research before publication, confidential business documents, draft books or
          articles, or any text that requires strict privacy controls. Your content remains 100% private and secure on your
          device.
        </p>
      </section>

      {/* Features */}
      <section className="features" aria-label="Features">
        {[
          {
            icon: <BarChart2 size={24} />,
            title: "Detailed statistics",
            desc: "Words, characters, sentences, paragraphs, lines, unique words, and estimated reading time — all at a glance.",
          },
          {
            icon: <Lock size={24} />,
            title: "Fully private",
            desc: "Your text never leaves the browser. Safe for drafts, essays, emails, or any sensitive content.",
          },
          {
            icon: <Settings2 size={24} />,
            title: "Configurable counting",
            desc: "Toggle case-insensitive frequency, exclude punctuation or numbers to suit your specific analysis needs.",
          },
        ].map(({ icon, title, desc }) => (
          <div className="feature" key={title}>
            <div className="feature-icon" aria-hidden="true">{icon}</div>
            <h3>{title}</h3>
            <p>{desc}</p>
          </div>
        ))}
      </section>
    </>
  );
}