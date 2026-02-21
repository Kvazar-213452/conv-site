"use client";

import { useState, useEffect, useRef } from "react";
import { THEMES } from "@/lib/const";
import type { ThemeKey } from "@/lib/type";
import { Sun, Moon, Snowflake, Flower, Command } from "lucide-react";

import "@/app/css/header.css";

export default function Header() {
  // спробуємо взяти тему з localStorage або дефолт
  const [theme, setTheme] = useState<ThemeKey>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as ThemeKey | null;
      return stored ?? "dark";
    }
    return "dark";
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // закриття дропдауну при кліку поза ним
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // застосування теми на document + збереження в localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const pickTheme = (t: ThemeKey) => {
    setTheme(t);
    setThemeOpen(false);
    setMenuOpen(false);
  };

  const ICONS: any = {
    dark: <Moon size={16} />,
    light: <Sun size={16} />,
    nord: <Snowflake size={16} />,
    rose: <Flower size={16} />,
    matrix: <Command size={16} />,
  };

  return (
    <header className="header">
      <div className="header-inner">
        <a href="/" className="logo">
          <div className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16">
              <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM11.5 9v2.5H9v2h2.5V16h2v-2.5H16v-2h-2.5V9z" />
            </svg>
          </div>
          <span className="logo-name">DevTools</span>
          <span className="logo-badge">BETA</span>
        </a>

        {/* Desktop nav */}
        <nav className="nav-desktop" aria-label="Main navigation">
          <a href="#">Converters</a>
          <a href="#">Formatters</a>
          <a href="#">Validators</a>

          {/* Theme switcher */}
          <div className="theme-switcher" ref={dropdownRef}>
            <button
              className={`btn-theme${themeOpen ? " open" : ""}`}
              onClick={() => setThemeOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={themeOpen}
              aria-label="Switch theme"
            >
              <span>{ICONS[theme]}</span>
              {THEMES[theme].label}
              <span className="btn-theme-chevron">▾</span>
            </button>

            {themeOpen && (
              <div className="theme-dropdown" role="listbox" aria-label="Choose theme">
                {(Object.keys(THEMES) as ThemeKey[]).map((t) => (
                  <button
                    key={t}
                    className={`theme-option${theme === t ? " active" : ""}`}
                    onClick={() => pickTheme(t)}
                    role="option"
                    aria-selected={theme === t}
                  >
                    <span className="theme-option-icon">{ICONS[t]}</span>
                    {THEMES[t].label}
                    {theme === t && <span className="theme-option-check">✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Hamburger */}
        <button
          className={`burger${menuOpen ? " open" : ""}`}
          onClick={() => {
            setMenuOpen((v) => !v);
            setThemeOpen(false);
          }}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          <span className="burger-line" />
          <span className="burger-line" />
          <span className="burger-line" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav id="mobile-nav" className="mobile-menu open" aria-label="Mobile navigation">
          <a href="#" onClick={() => setMenuOpen(false)}>
            Converters
          </a>
          <a href="#" onClick={() => setMenuOpen(false)}>
            Formatters
          </a>
          <a href="#" onClick={() => setMenuOpen(false)}>
            Validators
          </a>

          {/* Mobile theme picker */}
          <div className="mobile-theme-section">
            <div className="mobile-theme-label">Theme</div>
            <div className="mobile-theme-grid">
              {(Object.keys(THEMES) as ThemeKey[]).map((t) => (
                <button
                  key={t}
                  className={`mobile-theme-btn${theme === t ? " active" : ""}`}
                  onClick={() => pickTheme(t)}
                  aria-label={`Switch to ${THEMES[t].label} theme`}
                >
                  <span className="mobile-theme-btn-icon">{ICONS[t]}</span>
                  {THEMES[t].label}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}