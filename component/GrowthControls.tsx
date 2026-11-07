"use client";
import type { GrowthField } from '@/lib/growth-tools';
import type { ToolValues } from '@/lib/growth-transforms';
export function defaultValues(fields: GrowthField[]): ToolValues { return Object.fromEntries(fields.map(f => [f.key, f.default])); }
export default function GrowthControls({ fields, values, onChange, disabled = false }: { fields: GrowthField[]; values: ToolValues; onChange: (key: string, value: string) => void; disabled?: boolean }) {
  return <div className="growth-controls">{fields.map(field => <label key={field.key} htmlFor={'option-' + field.key}>
    <span>{field.label}</span>
    {field.type === 'select' ? <select id={'option-' + field.key} disabled={disabled} value={values[field.key]} onChange={e => onChange(field.key, e.target.value)}>{field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : field.type === 'checkbox' ? <input id={'option-' + field.key} disabled={disabled} type="checkbox" checked={values[field.key] === 'true'} onChange={e => onChange(field.key, String(e.target.checked))} /> : <input id={'option-' + field.key} disabled={disabled} type={field.type} autoComplete={field.type==='password'?'new-password':undefined} value={values[field.key]} min={field.min} max={field.max} step={field.step ?? (field.type === 'number' ? '1' : undefined)} onChange={e => onChange(field.key, e.target.value)} />}
  </label>)}</div>;
}
