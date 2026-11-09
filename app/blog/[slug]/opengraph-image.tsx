import { ImageResponse } from 'next/og';
import { expansionArticles } from '@/lib/expansion-articles';

export const alt = 'Utilixio practical guide preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = expansionArticles.find(item => item.slug === slug);
  const title = article?.title ?? slug.split('-').map(word => word[0]?.toUpperCase() + word.slice(1)).join(' ');
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', padding: '60px 80px', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', fontFamily: 'system-ui, sans-serif' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 34 }}><div style={{ width: 56, height: 56, borderRadius: 16, background: '#e8b87a', color: '#1a1a2e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, letterSpacing: 2 }}>GUIDE</div><span style={{ color: '#c5c5d2', fontSize: 28 }}>Utilixio Journal</span></div>
    <div style={{ fontSize: title.length > 42 ? 46 : 56, fontWeight: 700, color: '#f7f4ef', lineHeight: 1.18, maxWidth: '92%' }}>{title}</div>
    <div style={{ marginTop: 'auto', display: 'flex', gap: 24, color: '#aeb1c4', fontSize: 22 }}><span>Practical, clear guides</span><span>·</span><span>utilixio.com/blog</span></div>
  </div>, { ...size });
}
