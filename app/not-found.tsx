"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const GLITCH_CHARS = "!<>-_\\/[]{}—=+*^?#@$%&";

function useGlitch(text: string, active: boolean) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (!active) { setDisplay(text); return; }
    let frame = 0;
    const total = 18;
    const id = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((char, i) => {
            if (char === " ") return " ";
            if (i < (frame / total) * text.length) return char;
            return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
          })
          .join("")
      );
      frame++;
      if (frame > total) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, [active, text]);

  return display;
}

export default function NotFound() {
  const [hovered, setHovered] = useState(false);
  const glitched = useGlitch("PAGE NOT FOUND", hovered);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600&family=Geist:wght@300;400;500;600;700&display=swap');

        /* ═══════════════════════════════════════════════════
           ТЕМИ — всі кольори через CSS-змінні
        ═══════════════════════════════════════════════════ */
        :root,
        :root[data-theme="dark"] {
          --color-bg:            #000000;
          --color-surface:       #0a0a0a;
          --color-border:        #1a1a1a;
          --color-border-bright: #2e2e2e;
          --color-text:          #ededed;
          --color-text-muted:    #666666;
          --color-text-dim:      #333333;
          --color-text-inverse:  #000000;
          --color-accent:        #ededed;
          --color-accent-soft:   rgba(255,255,255,0.04);
          --color-error:         #ff4040;
          --color-error-dim:     rgba(255,64,64,0.08);
          --color-grid-line:     rgba(255,255,255,0.03);
          --color-glow:          rgba(255,64,64,0.15);
          --color-scan:          rgba(255,255,255,0.02);
        }
        :root[data-theme="light"] {
          --color-bg:            #ffffff;
          --color-surface:       #fafafa;
          --color-border:        #e5e5e5;
          --color-border-bright: #d0d0d0;
          --color-text:          #111111;
          --color-text-muted:    #888888;
          --color-text-dim:      #cccccc;
          --color-text-inverse:  #ffffff;
          --color-accent:        #111111;
          --color-accent-soft:   rgba(0,0,0,0.04);
          --color-error:         #cc2200;
          --color-error-dim:     rgba(204,34,0,0.06);
          --color-grid-line:     rgba(0,0,0,0.04);
          --color-glow:          rgba(204,34,0,0.08);
          --color-scan:          rgba(0,0,0,0.01);
        }
        :root[data-theme="nord"] {
          --color-bg:            #2e3440;
          --color-surface:       #3b4252;
          --color-border:        #434c5e;
          --color-border-bright: #4c566a;
          --color-text:          #eceff4;
          --color-text-muted:    #9199aa;
          --color-text-dim:      #4c566a;
          --color-text-inverse:  #2e3440;
          --color-accent:        #eceff4;
          --color-accent-soft:   rgba(236,239,244,0.06);
          --color-error:         #bf616a;
          --color-error-dim:     rgba(191,97,106,0.10);
          --color-grid-line:     rgba(236,239,244,0.04);
          --color-glow:          rgba(191,97,106,0.15);
          --color-scan:          rgba(236,239,244,0.02);
        }
        :root[data-theme="rose"] {
          --color-bg:            #0d0608;
          --color-surface:       #130a0d;
          --color-border:        #2a1520;
          --color-border-bright: #3d1f2d;
          --color-text:          #f5dde4;
          --color-text-muted:    #9d7585;
          --color-text-dim:      #3d2030;
          --color-text-inverse:  #0d0608;
          --color-accent:        #f5dde4;
          --color-accent-soft:   rgba(245,221,228,0.05);
          --color-error:         #ff6b7a;
          --color-error-dim:     rgba(255,107,122,0.08);
          --color-grid-line:     rgba(245,221,228,0.03);
          --color-glow:          rgba(255,107,122,0.15);
          --color-scan:          rgba(245,221,228,0.02);
        }
        :root[data-theme="matrix"] {
          --color-bg:            #000d00;
          --color-surface:       #010f01;
          --color-border:        #0a2a0a;
          --color-border-bright: #0f3d0f;
          --color-text:          #b3ffb3;
          --color-text-muted:    #52a352;
          --color-text-dim:      #1a3a1a;
          --color-text-inverse:  #000d00;
          --color-accent:        #00ff41;
          --color-accent-soft:   rgba(0,255,65,0.05);
          --color-error:         #00ff41;
          --color-error-dim:     rgba(0,255,65,0.07);
          --color-grid-line:     rgba(0,255,65,0.04);
          --color-glow:          rgba(0,255,65,0.2);
          --color-scan:          rgba(0,255,65,0.02);
        }

        /* ═══════════════════════════════════════════════════
           BASE
        ═══════════════════════════════════════════════════ */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        html, body {
          height: 100%;
          background: var(--color-bg);
          color: var(--color-text);
          font-family: 'Geist', -apple-system, sans-serif;
          -webkit-font-smoothing: antialiased;
          overflow: hidden;
          transition: background .35s, color .35s;
        }

        /* ═══════════════════════════════════════════════════
           KEYFRAMES
        ═══════════════════════════════════════════════════ */
        @keyframes fadeUp   { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
        @keyframes flicker  {
          0%,19%,21%,23%,25%,54%,56%,100% { opacity:1; }
          20%,24%,55% { opacity:.4; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes pulse    { 0%,100% { opacity:1; } 50% { opacity:.3; } }
        @keyframes blink    { 0%,100% { opacity:1; } 50% { opacity:0; } }
        @keyframes float    {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes drift {
          0%   { transform: translate(0, 0) rotate(0deg); opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: .6; }
          100% { transform: translate(var(--dx), var(--dy)) rotate(var(--dr)); opacity: 0; }
        }

        /* ═══════════════════════════════════════════════════
           LAYOUT
        ═══════════════════════════════════════════════════ */
        .nf-root {
          width: 100vw; height: 100vh;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          position: relative; overflow: hidden;
          animation: fadeIn .4s ease;
        }

        /* ── Grid background ── */
        .nf-grid {
          position: absolute; inset: 0; z-index: 0;
          background-image:
            linear-gradient(var(--color-grid-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-grid-line) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
        }

        /* ── Scanline effect ── */
        .nf-scan {
          position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden;
        }
        .nf-scan::after {
          content: '';
          position: absolute; left: 0; right: 0; height: 120px;
          background: linear-gradient(transparent, var(--color-scan) 50%, transparent);
          animation: scanline 6s linear infinite;
        }

        /* ── Glow orb ── */
        .nf-glow {
          position: absolute; z-index: 0;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, var(--color-glow) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          pointer-events: none; transition: background .35s;
        }

        /* ── Floating particles ── */
        .nf-particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .nf-particle {
          position: absolute;
          width: 2px; height: 2px; border-radius: 50%;
          background: var(--color-error);
          animation: drift linear infinite;
          opacity: 0;
        }

        /* ═══════════════════════════════════════════════════
           CONTENT
        ═══════════════════════════════════════════════════ */
        .nf-content {
          position: relative; z-index: 10;
          display: flex; flex-direction: column;
          align-items: center; text-align: center;
          padding: 0 24px;
          gap: 0;
        }

        /* Status bar */
        .nf-status {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-family: 'Geist Mono', monospace;
          color: var(--color-error); letter-spacing: .12em; text-transform: uppercase;
          padding: 5px 12px; border-radius: 100px;
          border: 1px solid var(--color-error);
          background: var(--color-error-dim);
          margin-bottom: 40px;
          animation: fadeUp .5s ease .1s both;
          transition: background .35s, border-color .35s, color .35s;
        }
        .nf-status-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--color-error); animation: pulse 1.5s ease-in-out infinite; transition: background .35s; }

        /* 404 number */
        .nf-code {
          font-size: clamp(96px, 20vw, 180px);
          font-weight: 700; line-height: 1;
          font-family: 'Geist Mono', monospace;
          letter-spacing: -.04em;
          color: var(--color-text);
          margin-bottom: 4px;
          animation: fadeUp .5s ease .15s both, flicker 8s ease-in-out 2s infinite;
          user-select: none;
          transition: color .35s;
        }
        .nf-code-accent { color: var(--color-error); transition: color .35s; }

        /* Divider line */
        .nf-divider {
          width: 1px; height: 40px;
          background: linear-gradient(to bottom, var(--color-error), transparent);
          margin: 16px auto 24px;
          animation: fadeUp .5s ease .25s both;
          transition: background .35s;
        }

        /* Title */
        .nf-title {
          font-size: clamp(14px, 2.5vw, 18px);
          font-weight: 600; letter-spacing: .18em; text-transform: uppercase;
          font-family: 'Geist Mono', monospace;
          color: var(--color-text);
          margin-bottom: 16px;
          animation: fadeUp .5s ease .3s both;
          cursor: default; user-select: none;
          min-height: 1.4em;
          transition: color .35s;
        }

        /* Description */
        .nf-desc {
          font-size: 14px; color: var(--color-text-muted); line-height: 1.7;
          max-width: 380px; margin-bottom: 48px;
          animation: fadeUp .5s ease .38s both;
          transition: color .35s;
        }
        .nf-desc code {
          font-family: 'Geist Mono', monospace;
          font-size: 12px; color: var(--color-error);
          background: var(--color-error-dim);
          border: 1px solid var(--color-error);
          padding: 1px 6px; border-radius: 4px;
          transition: background .35s, border-color .35s, color .35s;
        }

        /* Actions */
        .nf-actions {
          display: flex; align-items: center; gap: 12px;
          flex-wrap: wrap; justify-content: center;
          animation: fadeUp .5s ease .45s both;
        }
        .nf-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; font-weight: 600; font-family: 'Geist', sans-serif;
          padding: 11px 24px; border-radius: 8px;
          background: var(--color-accent); color: var(--color-text-inverse);
          text-decoration: none; border: none; cursor: pointer;
          transition: opacity .15s, transform .12s, background .35s, color .35s;
          animation: float 4s ease-in-out infinite;
        }
        .nf-btn-primary:hover  { opacity: .85; transform: scale(1.03); animation-play-state: paused; }
        .nf-btn-primary:active { transform: scale(.97); }
        .nf-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--color-text-muted); font-family: 'Geist', sans-serif;
          padding: 10px 20px; border-radius: 8px;
          border: 1px solid var(--color-border-bright);
          background: transparent; text-decoration: none; cursor: pointer;
          transition: all .15s;
        }
        .nf-btn-secondary:hover { background: var(--color-accent-soft); color: var(--color-text); border-color: var(--color-text-muted); }

        /* Cursor blink after glitch text */
        .nf-cursor {
          display: inline-block; width: 2px; height: 1em;
          background: var(--color-text); margin-left: 2px; vertical-align: middle;
          animation: blink 1s step-end infinite;
          transition: background .35s;
        }

        /* ── Bottom metadata ── */
        .nf-meta {
          position: absolute; bottom: 24px;
          display: flex; align-items: center; gap: 24px;
          font-size: 11px; font-family: 'Geist Mono', monospace;
          color: var(--color-text-dim);
          animation: fadeIn .5s ease .7s both;
          flex-wrap: wrap; justify-content: center; padding: 0 16px;
          transition: color .35s;
        }
        .nf-meta-item { display: flex; align-items: center; gap: 6px; }
        .nf-meta-dot  { width: 4px; height: 4px; border-radius: 50%; background: var(--color-border-bright); transition: background .35s; }

        /* ── Corner decorations ── */
        .nf-corner {
          position: absolute; width: 20px; height: 20px;
          border-color: var(--color-border-bright); border-style: solid;
          animation: fadeIn .5s ease .6s both;
          transition: border-color .35s;
        }
        .nf-corner-tl { top: 24px; left: 24px;  border-width: 1px 0 0 1px; }
        .nf-corner-tr { top: 24px; right: 24px;  border-width: 1px 1px 0 0; }
        .nf-corner-bl { bottom: 24px; left: 24px;  border-width: 0 0 1px 1px; }
        .nf-corner-br { bottom: 24px; right: 24px;  border-width: 0 1px 1px 0; }

        /* ── RESPONSIVE ── */
        @media (max-width: 480px) {
          .nf-code    { font-size: 96px; }
          .nf-corner  { display: none; }
          .nf-meta    { bottom: 16px; gap: 12px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
        }
      `}</style>

      <div className="nf-root">
        {/* Background layers */}
        <div className="nf-grid"    aria-hidden="true" />
        <div className="nf-scan"    aria-hidden="true" />
        <div className="nf-glow"    aria-hidden="true" />

        {/* Floating particles */}
        <div className="nf-particles" aria-hidden="true">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className="nf-particle"
              style={{
                left: `${10 + (i * 7.5) % 80}%`,
                top:  `${20 + (i * 11)  % 60}%`,
                ["--dx" as string]: `${(Math.random() - .5) * 120}px`,
                ["--dy" as string]: `${(Math.random() - .5) * 120}px`,
                ["--dr" as string]: `${(Math.random() - .5) * 360}deg`,
                animationDuration: `${3 + (i % 4)}s`,
                animationDelay:    `${i * .4}s`,
              }}
            />
          ))}
        </div>

        {/* Corner decorations */}
        <div className="nf-corner nf-corner-tl" aria-hidden="true" />
        <div className="nf-corner nf-corner-tr" aria-hidden="true" />
        <div className="nf-corner nf-corner-bl" aria-hidden="true" />
        <div className="nf-corner nf-corner-br" aria-hidden="true" />

        {/* Main content */}
        <main className="nf-content">
          <div className="nf-status" role="status">
            <div className="nf-status-dot" />
            HTTP 404 · Resource not found
          </div>

          <div className="nf-code" aria-label="Error 404">
            4<span className="nf-code-accent">0</span>4
          </div>

          <div className="nf-divider" aria-hidden="true" />

          <h1
            className="nf-title"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            aria-label="Page not found"
          >
            {glitched}<span className="nf-cursor" aria-hidden="true" />
          </h1>

          <p className="nf-desc">
            The page at <code>{typeof window !== "undefined" ? window.location.pathname : "/this-path"}</code> doesn't exist or has been moved. Check the URL or head back home.
          </p>

          <nav className="nf-actions" aria-label="Recovery actions">
            <button
              className="nf-btn-secondary"
              onClick={() => window.history.back()}
            >
              ← Go Back
            </button>
          </nav>
        </main>

        {/* Bottom metadata */}
        <footer className="nf-meta" aria-hidden="true">
          <span className="nf-meta-item">
            <span className="nf-meta-dot" />
            STATUS_CODE: 404
          </span>
          <span className="nf-meta-item">
            <span className="nf-meta-dot" />
            {new Date().toISOString().split("T")[0]}
          </span>
          <span className="nf-meta-item">
            <span className="nf-meta-dot" />
            NEXT.JS / APP ROUTER
          </span>
        </footer>
      </div>
    </>
  );
}