import { ImageResponse } from 'next/og';
import { growthTools } from '@/lib/growth-tools';

export const alt = 'Utilixio online tool preview';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = growthTools.find(item => item.slug === slug);
  const title = tool?.title ?? slug.split('-').map(word => word[0]?.toUpperCase() + word.slice(1)).join(' ');
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%', height: '100%', padding: '60px 80px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', fontFamily: 'system-ui, sans-serif' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}><div style={{ width: 48, height: 48, borderRadius: 12, background: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#0f172a', fontWeight: 700 }}>U</div><span style={{ color: '#94a3b8', fontSize: 28 }}>Utilixio</span></div>
    <div style={{ fontSize: title.length > 30 ? 48 : 56, fontWeight: 700, color: '#f8fafc', lineHeight: 1.2, maxWidth: '90%' }}>{title}</div>
    <div style={{ marginTop: 'auto', display: 'flex', gap: 24, color: '#cbd5e1', fontSize: 22 }}><span>Free · No sign-up</span><span>·</span><span>utilixio.com</span></div>
  </div>, { ...size });
}
