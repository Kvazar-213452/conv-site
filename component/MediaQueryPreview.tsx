"use client";
import { useSyncExternalStore } from 'react';
export default function MediaQueryPreview({query}:{query:string}){
  const matches=useSyncExternalStore<boolean|null>(notify=>{const media=window.matchMedia(query);media.addEventListener('change',notify);return ()=>media.removeEventListener('change',notify);},()=>window.matchMedia(query).matches,()=>null);
  return <div className="media-query-preview"><p>Current browser: <output data-media-match={String(matches)} aria-live="polite">{matches===null?'Checking query…':matches?'Matches this query':'Does not match this query'}</output></p><code>{query}</code></div>;
}
