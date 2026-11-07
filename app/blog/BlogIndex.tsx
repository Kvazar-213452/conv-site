"use client";
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight,ArrowRight,Search,BookOpen} from 'lucide-react';
import {blogTopics,blogDate,type BlogTopic} from '@/lib/blog-presentation';
import type {BlogPost} from '@/lib/blog-catalog';
export default function BlogIndex({posts:blogPosts}:{posts:BlogPost[]}){
  const featured=blogPosts.find(p=>p.slug==='read-har-network-requests')!;
  const [query,setQuery]=useState(''),[topic,setTopic]=useState<BlogTopic>('All topics');
  const posts=blogPosts.filter(p=>(topic==='All topics'||p.topic===topic)&&(!query.trim()||[p.title,p.description,p.topic].join(' ').toLowerCase().includes(query.trim().toLowerCase())));
  return <div className="journal-index">
    <header className="journal-intro"><div><p className="journal-kicker"><span/> THE DEVELOPER JOURNAL</p><h1>Less guesswork.<br/><em>More understanding.</em></h1></div><p className="journal-intro-copy">Clear explanations, useful examples, and the tools to put them to work. A field guide for your next build.</p></header>
    <Link href={'/blog/'+featured.slug} className="journal-feature" aria-label={'Read '+featured.title}><div className="journal-feature-image"><Image src={featured.image} alt={featured.alt} width={1440} height={900} sizes="(max-width: 760px) 100vw, 65vw" preload/><span className="journal-feature-label">EDITOR’S PICK</span></div><div className="journal-feature-copy"><span className="journal-tag">{featured.topic}</span><h2>{featured.title}</h2><p>{featured.description}</p><div className="journal-meta"><span>{featured.minutes} min read</span><span>Practical guide</span></div><span className="journal-read">Read the guide <ArrowUpRight size={20}/></span></div></Link>
    <section className="journal-library" aria-labelledby="journal-library-heading"><div className="journal-library-heading"><div><p className="journal-kicker">EXPLORE THE LIBRARY</p><h2 id="journal-library-heading">A little knowledge. A better workflow.</h2></div><label className="journal-search"><Search size={18}/><span className="sr-only">Search articles</span><input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a guide…" id="blog-search"/></label></div>
    <div className="journal-topics" role="group" aria-label="Filter articles by topic">{blogTopics.map(t=><button type="button" key={t} aria-pressed={topic===t} onClick={()=>setTopic(t)}>{t}</button>)}</div>
    <p className="journal-count" aria-live="polite">{posts.length} {posts.length===1?'guide':'guides'}{query.trim()?' matching “'+query.trim()+'”':''}</p>
    <div className="journal-grid">{posts.map(p=><Link className="journal-card" href={'/blog/'+p.slug} key={p.slug}><div className="journal-card-image"><Image src={p.image} alt={p.alt} width={720} height={450} sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"/><span className="journal-card-arrow" aria-hidden="true"><ArrowUpRight size={20}/></span></div><div className="journal-card-copy"><div className="journal-meta"><span className="journal-topic">{p.topic}</span><span>{p.minutes?p.minutes+' min read':'Reference'}</span></div><h3>{p.title}</h3><p>{p.description}</p>{p.date&&<time dateTime={p.date}>{blogDate(p.date)}</time>}</div></Link>)}</div>
    {!posts.length&&<div className="journal-empty"><BookOpen size={32}/><h3>No guides found</h3><p>Try a broader term or another topic.</p><button type="button" onClick={()=>{setQuery('');setTopic('All topics');}}>Show all guides</button></div>}
    </section><aside className="journal-tools"><div><p className="journal-kicker">FROM READING TO DOING</p><h2>Try it. See it. Understand it.</h2><p>Explore the free tools behind the guides.</p></div><Link href="/">Browse all tools <ArrowRight size={18}/></Link></aside>
  </div>;
}
