"use client";
import type { CSSProperties } from 'react';
import type { GrowthResult } from '@/lib/growth-transforms';
export default function DesignPreviews({ result }: { result: GrowthResult }) {
  const c = result.curve, flex = result.flex;
  const low = c ? Math.min(0, c.y1, c.y2) : 0, high = c ? Math.max(1, c.y1, c.y2) : 1;
  const x = (value: number) => 20 + value * 200, y = (value: number) => 158 - (value - low) / (high - low) * 136;
  return <>
    {c && <div className="bezier-preview"><svg viewBox="0 0 240 180" role="img" aria-label="Cubic Bezier control-point curve"><path d={`M ${x(0)} ${y(0)} L ${x(1)} ${y(1)}`} fill="none" stroke="var(--color-border-bright)" strokeDasharray="4 4" /><path d={`M ${x(0)} ${y(0)} L ${x(c.x1)} ${y(c.y1)} M ${x(1)} ${y(1)} L ${x(c.x2)} ${y(c.y2)}`} fill="none" stroke="var(--color-text-muted)" strokeWidth="1" /><path d={`M ${x(0)} ${y(0)} C ${x(c.x1)} ${y(c.y1)}, ${x(c.x2)} ${y(c.y2)}, ${x(1)} ${y(1)}`} fill="none" stroke="var(--color-accent)" strokeWidth="3" />{[[0,0],[c.x1,c.y1],[c.x2,c.y2],[1,1]].map(([a,b],i)=><circle key={i} cx={x(a)} cy={y(b)} r="4" fill="var(--color-accent)" />)}</svg><div><p>Animated timing preview</p><div className="bezier-track"><span className="bezier-ball" style={{ animationTimingFunction: c.timing }} /></div><p>Motion pauses when reduced motion is enabled.</p></div></div>}
    {flex && <div className="flex-demo" aria-label="Generated Flexbox layout preview" style={{ display: 'flex', flexDirection: flex.direction as CSSProperties['flexDirection'], flexWrap: flex.wrap as CSSProperties['flexWrap'], justifyContent: flex.justify, alignItems: flex.align, gap: flex.gap }}>{Array.from({ length: flex.items }, (_, i) => <div key={i}>{i + 1}</div>)}</div>}
  </>;
}
