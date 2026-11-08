"use client";
import type { CSSProperties } from 'react';
import TimerPreview from './TimerPreview';
import PomodoroPreview from './PomodoroPreview';
import QrPayloadPreview from './QrPayloadPreview';
import MediaQueryPreview from './MediaQueryPreview';
import type { GrowthResult } from '@/lib/growth-transforms';
export default function DesignPreviews({ result }: { result: GrowthResult }) {
  const c = result.curve, flex = result.flex, animation = result.animation, triangle = result.triangle;
  const triangleStyle: CSSProperties | undefined = triangle ? {
    width: 0, height: 0,
    ...(triangle.direction === 'up' || triangle.direction === 'down' ? { borderLeft: `${triangle.width / 2}px solid transparent`, borderRight: `${triangle.width / 2}px solid transparent`, [triangle.direction === 'up' ? 'borderBottom' : 'borderTop']: `${triangle.height}px solid ${triangle.color}` } : { borderTop: `${triangle.height / 2}px solid transparent`, borderBottom: `${triangle.height / 2}px solid transparent`, [triangle.direction === 'left' ? 'borderRight' : 'borderLeft']: `${triangle.width}px solid ${triangle.color}` }),
  } : undefined;
  const low = c ? Math.min(0, c.y1, c.y2) : 0, high = c ? Math.max(1, c.y1, c.y2) : 1;
  const x = (value: number) => 20 + value * 200, y = (value: number) => 158 - (value - low) / (high - low) * 136;
  return <>
    {result.timer&&<TimerPreview mode={result.timer.mode} duration={result.timer.duration}/>}
    {result.pomodoro&&<PomodoroPreview focus={result.pomodoro.focus} breakTime={result.pomodoro.breakTime}/>}
    {result.qrPayload&&<QrPayloadPreview value={result.qrPayload}/>}
    {result.summary && <dl className="public-result-summary">{result.summary.map(metric=><div key={metric.label}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl>}
    {result.dataTable && <div className="public-table-scroll"><table className="public-result-table"><caption>{result.dataTable.rows.length>24?'Showing the first 24 rows of '+result.dataTable.rows.length+'. The full report is available below.':'Calculation details'}</caption><thead><tr>{result.dataTable.headers.map(header=><th scope="col" key={header}>{header}</th>)}</tr></thead><tbody>{result.dataTable.rows.slice(0,24).map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}

    {result.mediaQuery && <MediaQueryPreview query={result.mediaQuery}/>}
    {result.palette && <div className="growth-palette" aria-label="Generated color palette">{result.palette.map((hex,index)=><div key={index}><div className="palette-swatch" style={{background:hex}}/><code>{index+1} · {hex}</code></div>)}</div>}
    {animation && <div className="animation-preview-stage" aria-label="Generated animation preview"><div className="animation-demo" style={{ animationName: 'utilixio-' + animation.effect, animationDuration: animation.duration + 's', animationTimingFunction: animation.timing, '--animation-distance': animation.distance + 'px' } as CSSProperties}>Preview</div><p>Motion pauses when reduced motion is enabled.</p></div>}
    {triangle && <div className="triangle-preview-stage" aria-label="Generated triangle preview"><div className="triangle-demo" style={triangleStyle} /></div>}
    {c && <div className="bezier-preview"><svg viewBox="0 0 240 180" role="img" aria-label="Cubic Bezier control-point curve"><path d={`M ${x(0)} ${y(0)} L ${x(1)} ${y(1)}`} fill="none" stroke="var(--color-border-bright)" strokeDasharray="4 4" /><path d={`M ${x(0)} ${y(0)} L ${x(c.x1)} ${y(c.y1)} M ${x(1)} ${y(1)} L ${x(c.x2)} ${y(c.y2)}`} fill="none" stroke="var(--color-text-muted)" strokeWidth="1" /><path d={`M ${x(0)} ${y(0)} C ${x(c.x1)} ${y(c.y1)}, ${x(c.x2)} ${y(c.y2)}, ${x(1)} ${y(1)}`} fill="none" stroke="var(--color-accent)" strokeWidth="3" />{[[0,0],[c.x1,c.y1],[c.x2,c.y2],[1,1]].map(([a,b],i)=><circle key={i} cx={x(a)} cy={y(b)} r="4" fill="var(--color-accent)" />)}</svg><div><p>Animated timing preview</p><div className="bezier-track"><span className="bezier-ball" style={{ animationTimingFunction: c.timing }} /></div><p>Motion pauses when reduced motion is enabled.</p></div></div>}
    {flex && <div className="flex-demo" aria-label="Generated Flexbox layout preview" style={{ display: 'flex', flexDirection: flex.direction as CSSProperties['flexDirection'], flexWrap: flex.wrap as CSSProperties['flexWrap'], justifyContent: flex.justify, alignItems: flex.align, gap: flex.gap }}>{Array.from({ length: flex.items }, (_, i) => <div key={i}>{i + 1}</div>)}</div>}
  </>;
}
