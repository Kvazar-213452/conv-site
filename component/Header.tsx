"use client";

import { useState, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { THEMES } from "@/lib/const";
import type { ThemeKey } from "@/lib/type";
import { Sun, Moon, Snowflake, Flower, Command } from "lucide-react";
import Link from "next/link";
import HeaderSearch from "./HeaderSearch";

import "@/style/header.css";

type Tool = { slug: string; title: string; description: string; href: string };

export default function Header({ tools = [] }: { tools?: Tool[] }) {
  const [theme, setTheme] = useState<ThemeKey>("dark");
  const [themeReady, setThemeReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("theme") as ThemeKey | null;
    if (stored && Object.hasOwn(THEMES, stored)) setTheme(stored);
    setThemeReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (themeReady) localStorage.setItem("theme", theme);
  }, [theme, themeReady]);

  useEffect(() => {
    if (!menuOpen && !themeOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setMenuOpen(false); setThemeOpen(false); }
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, themeOpen]);

  const pickTheme = (t: ThemeKey) => {
    setTheme(t);
    setThemeOpen(false);
    setMenuOpen(false);
  };

  const ICONS: Record<ThemeKey, ReactNode> = {
    dark: <Moon size={16} />,
    light: <Sun size={16} />,
    nord: <Snowflake size={16} />,
    rose: <Flower size={16} />,
    matrix: <Command size={16} />,
  };


  return (
      <header className={`header${scrolled ? " scrolled" : ""}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM11.5 9v2.5H9v2h2.5V16h2v-2.5H16v-2h-2.5V9z" />
              </svg>
            </div>
            <span className="logo-name">Utilixio</span>
            <span className="logo-badge">FREE</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Main navigation">
            <Link href="/#tools">Browse tools</Link>
            <Link href="/blog">Guides</Link>
            <Link href="/contacts">Contacts</Link>

            <HeaderSearch tools={tools} />

            {/* Theme switcher */}
            <div className="theme-switcher" ref={dropdownRef}>
              <button
                className={`btn-theme${themeOpen ? " open" : ""}`}
                onClick={() => setThemeOpen((v) => !v)}
                aria-haspopup="listbox"
                aria-expanded={themeOpen}
                aria-label={`Color theme: ${THEMES[theme].label}`}
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
            <Link href="/#tools" onClick={() => setMenuOpen(false)}>Browse tools</Link>
            <Link href="/blog" onClick={() => setMenuOpen(false)}>Guides</Link>
            <Link href="/contacts" onClick={() => setMenuOpen(false)}>
              Contacts
            </Link>


            {/* Mobile theme picker */}
            <div className="mobile-theme-section">
              <div className="mobile-theme-label">Choose a color theme</div>
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
