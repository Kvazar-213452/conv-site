"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X } from "lucide-react";
import Link from "next/link";

type Tool = { slug: string; title: string; description: string; href: string };

export default function HeaderSearch({ tools }: { tools: Tool[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setOpen(true);
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onEsc(e: KeyboardEvent) { if (e.key === "Escape") close(); }
    function onClick(e: MouseEvent) {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) close();
    }
    document.addEventListener("keydown", onEsc);
    document.addEventListener("mousedown", onClick);
    return () => { document.removeEventListener("keydown", onEsc); document.removeEventListener("mousedown", onClick); };
  }, [open, close]);

  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const results = terms.length
    ? tools.filter(t => terms.every(w => `${t.title} ${t.description} ${t.slug}`.toLowerCase().includes(w))).slice(0, 8)
    : [];

  if (!open) {
    return (
      <button className="header-search-trigger" onClick={() => setOpen(true)} aria-label="Search tools">
        <Search size={15} />
        <span>Search</span>
        <kbd>/</kbd>
      </button>
    );
  }

  return (
    <div className="header-search-overlay" role="dialog" aria-label="Search tools">
      <div className="header-search-dialog" ref={dialogRef}>
        <div className="header-search-input-row">
          <Search size={18} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search 550+ tools…"
            autoComplete="off"
          />
          <button onClick={close} aria-label="Close search"><X size={18} /></button>
        </div>
        {terms.length > 0 && (
          <div className="header-search-results">
            {results.length === 0 && <p className="header-search-empty">No tools found</p>}
            {results.map(t => (
              <Link key={t.slug} href={t.href} onClick={close} className="header-search-result">
                <strong>{t.title}</strong>
                <span>{t.description}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
