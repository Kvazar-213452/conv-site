"use client";
import type { GrowthField } from '@/lib/growth-tools';
import type { ToolValues } from '@/lib/growth-transforms';
import { ChevronDown, ChevronUp } from 'lucide-react';
import '@/style/growth-controls.css';
export function defaultValues(fields: GrowthField[]): ToolValues { return Object.fromEntries(fields.map(f => [f.key, f.default])); }
export default function GrowthControls({ fields, values, onChange, disabled = false }: { fields: GrowthField[]; values: ToolValues; onChange: (key: string, value: string) => void; disabled?: boolean }) {
  return <div className="growth-controls">{fields.map(field => <div className={'growth-control-field' + (field.type === 'checkbox' ? ' is-checkbox' : '')} key={field.key}>
    <label className="growth-control-caption" htmlFor={'option-' + field.key}><span>{field.label}</span></label>
    {field.type === 'select' ? <select className="growth-control-input" id={'option-' + field.key} disabled={disabled} value={values[field.key]} onChange={e => onChange(field.key, e.target.value)}>{field.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : field.type === 'checkbox' ? <input className="growth-control-input" id={'option-' + field.key} disabled={disabled} type="checkbox" checked={values[field.key] === 'true'} onChange={e => onChange(field.key, String(e.target.checked))} /> : field.type === 'number' ? <div className="growth-number-control">
      <input className="growth-control-input" id={'option-' + field.key} disabled={disabled} type="number" value={values[field.key]} min={field.min} max={field.max} step={field.step ?? '1'} onChange={e => onChange(field.key, e.target.value)} />
      <span className="growth-number-stepper">
        <button type="button" aria-label={`Increase ${field.label}`} title={`Increase ${field.label}`} disabled={disabled || atLimit(field, values[field.key], 1)} onClick={() => onChange(field.key, stepValue(field, values[field.key], 1))}><ChevronUp size={14} strokeWidth={2.4} /></button>
        <button type="button" aria-label={`Decrease ${field.label}`} title={`Decrease ${field.label}`} disabled={disabled || atLimit(field, values[field.key], -1)} onClick={() => onChange(field.key, stepValue(field, values[field.key], -1))}><ChevronDown size={14} strokeWidth={2.4} /></button>
      </span>
    </div> : <input className="growth-control-input" id={'option-' + field.key} disabled={disabled} type={field.type} autoComplete={field.type==='password'?'new-password':undefined} value={values[field.key]} min={field.min} max={field.max} step={field.step} onChange={e => onChange(field.key, e.target.value)} />}
  </div>)}</div>;
}

function numberStep(field: GrowthField) {
  const step = Number(field.step);
  return Number.isFinite(step) && step > 0 ? step : 1;
}

function atLimit(field: GrowthField, current: string, direction: 1 | -1) {
  const value = current.trim() ? Number(current) : Number(field.min ?? 0);
  if (!Number.isFinite(value)) return false;
  return direction > 0 ? field.max !== undefined && value >= field.max : field.min !== undefined && value <= field.min;
}

function stepValue(field: GrowthField, current: string, direction: 1 | -1) {
  const parsed = Number(current);
  const base = current.trim() && Number.isFinite(parsed) ? parsed : Number(field.min ?? 0);
  const step = numberStep(field);
  const precision = Math.min(10, Math.max(decimalPlaces(step), decimalPlaces(base)));
  const next = Number((base + step * direction).toFixed(precision));
  const bounded = Math.max(field.min ?? -Infinity, Math.min(field.max ?? Infinity, next));
  return String(Number(bounded.toFixed(precision)));
}

function decimalPlaces(value: number) {
  const text = String(value);
  return text.includes('.') ? text.length - text.indexOf('.') - 1 : 0;
}
