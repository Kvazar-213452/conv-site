"use client";
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import { toolCategories } from '@/lib/tool-categories';
import type { CatalogTool } from '@/lib/tool-catalog';
export default function ToolDirectory({ tools }: { tools: CatalogTool[] }) {
  const [query, setQuery] = useState(''), [category, setCategory] = useState('all'), [sort, setSort] = useState('name'), [recentOnly, setRecentOnly] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      const target = event.target;
      if (event.key === '/' && !event.ctrlKey && !event.metaKey && !(target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))) { event.preventDefault(); input.current?.focus(); }
    }
    document.addEventListener('keydown', shortcut); return () => document.removeEventListener('keydown', shortcut);
  }, []);
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const filtered = tools.filter(tool => (category === 'all' || category === tool.category) && (!recentOnly || tool.recent) && terms.every(term => `${tool.title} ${tool.description} ${tool.slug} ${toolCategories.find(c => c.id === tool.category)?.name}`.toLowerCase().includes(term))).sort((a, b) => sort === 'new' ? Number(b.recent) - Number(a.recent) || a.title.localeCompare(b.title, 'en') : a.title.localeCompare(b.title, 'en'));
  function reset() { setQuery(''); setCategory('all'); setRecentOnly(false); }
  return <section id="tools" className="tool-directory" aria-labelledby="directory-heading">
    <div className="directory-heading"><div><span className="directory-kicker">TOOL LIBRARY</span><h2 id="directory-heading">What do you need to do?</h2></div><p>{tools.length} free tools. Search by task or choose a category.</p></div>
    <div className="directory-search"><Search size={22} aria-hidden="true" /><label className="visually-hidden" htmlFor="tool-search">Search tools by name, file type, or task</label><input id="tool-search" type="search" ref={input} value={query} placeholder='Try "merge PDF" or "convert HEIC"…' autoComplete="off" onChange={e => setQuery(e.target.value)} onKeyDown={e => { if (e.key === 'Escape') setQuery(''); }} />{query ? <button type="button" aria-label="Clear search" onClick={() => { setQuery(''); input.current?.focus(); }}><X size={18} /></button> : <kbd aria-hidden="true">/</kbd>}</div>
    <p className="directory-search-help">Search by tool name, file type, or task. Press <kbd>/</kbd> to focus search; press Escape to clear it.</p>
    <div className="directory-layout">
      <nav className="directory-categories" aria-label="Tool categories"><button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}><span>All tools</span><span>{tools.length}</span></button>{toolCategories.map(c => <button type="button" key={c.id} aria-pressed={category === c.id} onClick={() => setCategory(c.id)}><span>{c.name}</span><span>{tools.filter(t => t.category === c.id).length}</span></button>)}</nav>
      <div className="directory-results" id="tool-results">
        <div className="directory-toolbar"><p role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'tool' : 'tools'}{terms.length || category !== 'all' || recentOnly ? ' found' : ' to explore'}</p><div><label className="directory-recent"><input type="checkbox" checked={recentOnly} onChange={e => setRecentOnly(e.target.checked)} /> Just added</label><label className="visually-hidden" htmlFor="tool-sort">Sort tools</label><select id="tool-sort" value={sort} onChange={e => setSort(e.target.value)}><option value="name">Name A–Z</option><option value="new">Newest first</option></select></div></div>
        {!filtered.length && <div className="directory-empty"><Search size={28} aria-hidden="true" /><h3>No tools match your search</h3><p>Try a shorter phrase or choose another category.</p><button type="button" className="btn-secondary" onClick={reset}>Clear filters</button></div>}
        <div className="directory-groups">{toolCategories.map(c => {
          const matches = filtered.filter(t => t.category === c.id); if (!matches.length) return null;
          return <details className="directory-group" key={`${c.id}-${category}-${!!terms.length}-${recentOnly}`} open={terms.length > 0 || category !== 'all' || recentOnly || undefined}>
            <summary><span className="directory-category-symbol" aria-hidden="true">{c.symbol}</span><span className="directory-group-title"><span>{c.name} <small>{matches.length}</small></span><span>{c.description}</span></span><span className="directory-chevron" aria-hidden="true">+</span></summary>
            <div className="directory-card-grid">{matches.map(tool => <Link prefetch={false} className="directory-card" key={tool.slug} href={tool.href}><div><h3>{tool.title}</h3>{tool.recent && <span className="directory-new">NEW</span>}</div><p>{tool.description}</p><span className="directory-open">Open tool <ArrowRight size={14} aria-hidden="true" /></span></Link>)}</div>
          </details>;
        })}</div>
        <noscript><p>Open any category above to browse its tools. Search and filters require JavaScript.</p></noscript>
      </div>
    </div>
  </section>;
}
