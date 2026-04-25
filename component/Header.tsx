"use client";

import { useState, useEffect, useRef } from "react";
import { THEMES } from "@/lib/const";
import type { ThemeKey } from "@/lib/type";
import { Sun, Moon, Snowflake, Flower, Command, User as UserIcon, LogOut, Settings } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import "@/style/header.css";

interface User {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
}

export default function Header() {
  const router = useRouter();

  const [theme, setTheme] = useState<ThemeKey>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("theme") as ThemeKey | null;
      return stored ?? "dark";
    }
    return "dark";
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  // Завантажити юзера
  useEffect(() => {
    fetch("/api/user")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  // Закриття дропдаунів по кліку поза ними
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setThemeOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const pickTheme = (t: ThemeKey) => {
    setTheme(t);
    setThemeOpen(false);
    setMenuOpen(false);
  };

  const handleLogout = async () => {
    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setUser(null);
    setProfileOpen(false);
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  const ICONS: any = {
    dark: <Moon size={16} />,
    light: <Sun size={16} />,
    nord: <Snowflake size={16} />,
    rose: <Flower size={16} />,
    matrix: <Command size={16} />,
  };

  const initials = user ? user.username.slice(0, 2).toUpperCase() : "";

  return (
    <>
      <br />
      <header className={`header${scrolled ? " scrolled" : ""}${hidden ? " hidden" : ""}`}>
        <div className="header-inner">
          <Link href="/" className="logo">
            <div className="logo-icon">
              <svg width="16" height="16" viewBox="0 0 16 16">
                <path d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM11.5 9v2.5H9v2h2.5V16h2v-2.5H16v-2h-2.5V9z" />
              </svg>
            </div>
            <span className="logo-name">DevTools</span>
            <span className="logo-badge">BETA</span>
          </Link>

          {/* Desktop nav */}
          <nav className="nav-desktop" aria-label="Main navigation">
            <Link href="/privacy-policy">Privacy policy</Link>
            <Link href="/terms-of-service">Terms of service</Link>
            <Link href="/contacts">Contacts</Link>

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

            {/* Profile / Auth */}
            {user ? (
              <div className="profile-switcher" ref={profileRef}>
                <button
                  className={`btn-profile${profileOpen ? " open" : ""}`}
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  aria-label="Profile menu"
                >
                  <span className="profile-avatar">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.username} />
                    ) : (
                      <span className="profile-avatar-initials">{initials}</span>
                    )}
                  </span>
                  <span className="profile-name">{user.username}</span>
                  <span className="btn-theme-chevron">▾</span>
                </button>

                {profileOpen && (
                  <div className="profile-dropdown" role="menu">
                    <div className="profile-dropdown-header">
                      <div className="profile-dropdown-name">{user.username}</div>
                      <div className="profile-dropdown-email">{user.email}</div>
                    </div>
                    <div className="profile-dropdown-divider" />
                    <Link
                      href="/user/profile"
                      className="profile-option"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <span className="theme-option-icon"><UserIcon size={14} /></span>
                      Profile
                    </Link>
                    <Link
                      href="/user/profile"
                      className="profile-option"
                      onClick={() => setProfileOpen(false)}
                      role="menuitem"
                    >
                      <span className="theme-option-icon"><Settings size={14} /></span>
                      Settings
                    </Link>
                    <div className="profile-dropdown-divider" />
                    <button
                      className="profile-option profile-option-danger"
                      onClick={handleLogout}
                      role="menuitem"
                    >
                      <span className="theme-option-icon"><LogOut size={14} /></span>
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link href="/user/login" className="btn-auth-ghost">Login</Link>
                <Link href="/user/register" className="btn-auth-primary">Sign up</Link>
              </div>
            )}
          </nav>

          {/* Hamburger */}
          <button
            className={`burger${menuOpen ? " open" : ""}`}
            onClick={() => {
              setMenuOpen((v) => !v);
              setThemeOpen(false);
              setProfileOpen(false);
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
            {user && (
              <div className="mobile-profile-card">
                <div className="profile-avatar mobile-profile-avatar">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.username} />
                  ) : (
                    <span className="profile-avatar-initials">{initials}</span>
                  )}
                </div>
                <div className="mobile-profile-info">
                  <div className="mobile-profile-name">{user.username}</div>
                  <div className="mobile-profile-email">{user.email}</div>
                </div>
              </div>
            )}

            <Link href="/privacy-policy" onClick={() => setMenuOpen(false)}>
              Privacy policy
            </Link>
            <Link href="/terms-of-service" onClick={() => setMenuOpen(false)}>
              Terms of service
            </Link>
            <Link href="/contacts" onClick={() => setMenuOpen(false)}>
              Contacts
            </Link>

            {user ? (
              <>
                <Link href="/user/profile" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <button
                  className="mobile-logout-btn"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/user/login" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
                <Link href="/user/register" onClick={() => setMenuOpen(false)}>
                  Sign up
                </Link>
              </>
            )}

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
    </>
  );
}