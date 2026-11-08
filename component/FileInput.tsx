"use client";

import { useId, useState, type ChangeEvent, type DragEvent, type Ref } from 'react';
import { FileText, Image as ImageIcon, Upload, X } from 'lucide-react';
import '@/style/file-input.css';

type FileInputProps = {
  id: string;
  label: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  files?: readonly File[];
  onFilesChange: (files: File[]) => void;
  inputRef?: Ref<HTMLInputElement>;
  hiddenInput?: boolean;
  showSelection?: boolean;
  error?: string;
};

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MiB`;
}

function acceptedTypes(accept = '') {
  const names = accept.split(',').map(value => value.trim()).filter(Boolean).map(value => {
    if (value.startsWith('.')) return value.slice(1).toUpperCase();
    if (value.endsWith('/*')) return value.split('/')[0].replace('image', 'image').toUpperCase();
    const subtype = value.split('/')[1];
    return subtype ? subtype.split(/[.+-]/)[0].toUpperCase() : value.toUpperCase();
  });
  const unique = [...new Set(names)];
  return unique.length ? unique.slice(0, 4).join(', ') + (unique.length > 4 ? ` +${unique.length - 4}` : '') : 'Any file type';
}

export default function FileInput({
  id, label, hint, accept, multiple = false, disabled = false, files = [], onFilesChange,
  inputRef, hiddenInput = false, showSelection = true, error,
}: FileInputProps) {
  const [dragging, setDragging] = useState(false);
  const labelId = useId();
  const hintId = useId();
  const visualHint = hint ?? acceptedTypes(accept);
  const ImageKindIcon = accept?.toLowerCase().includes('image') ? ImageIcon : FileText;

  function choose(selected: FileList | File[]) {
    const picked = Array.from(selected);
    onFilesChange(multiple ? [...files, ...picked] : picked.slice(0, 1));
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.currentTarget.files?.length) choose(event.currentTarget.files);
    // Let users select the same file again after clearing or changing settings.
    event.currentTarget.value = '';
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setDragging(false);
    if (!disabled && event.dataTransfer.files.length) choose(event.dataTransfer.files);
  }

  if (hiddenInput) {
    return <input
      ref={inputRef}
      id={id}
      className="file-input-native file-input-native--hidden"
      type="file"
      accept={accept}
      multiple={multiple}
      disabled={disabled}
      aria-hidden="true"
      tabIndex={-1}
      onChange={handleChange}
    />;
  }

  return <div className={`file-input${dragging ? ' is-dragging' : ''}${disabled ? ' is-disabled' : ''}${error ? ' has-error' : ''}`}>
    <label className="file-input-label" id={labelId} htmlFor={id}>{label}</label>
    <div
      className="file-input-dropzone"
      onDragEnter={event => { event.preventDefault(); if (!disabled) setDragging(true); }}
      onDragOver={event => { event.preventDefault(); if (!disabled) event.dataTransfer.dropEffect = 'copy'; }}
      onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDragging(false); }}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        id={id}
        className="file-input-native file-input-native--hidden"
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        aria-labelledby={labelId}
        aria-describedby={hintId}
        onChange={handleChange}
      />
      <span className="file-input-icon" aria-hidden="true"><Upload size={21} strokeWidth={1.8} /></span>
      <div className="file-input-copy">
        <strong>{dragging ? 'Drop your file here' : 'Drag and drop your file here'}</strong>
        <span>or browse from your device</span>
      </div>
      <button className="file-input-browse" type="button" disabled={disabled} onClick={() => document.getElementById(id)?.click()}>
        Browse files
      </button>
      <span className="file-input-types" id={hintId}>{visualHint}</span>
    </div>
    {error && <p className="file-input-error" role="alert">{error}</p>}
    {showSelection && files.length > 0 && <div className="file-input-selection" aria-live="polite">
      <div className="file-input-selection-heading"><span>{multiple ? `${files.length} files selected` : 'Selected file'}</span><span>{formatBytes(files.reduce((sum, file) => sum + file.size, 0))}</span></div>
      <ul>{files.map((file, index) => <li key={`${file.name}-${index}`}>
        <ImageKindIcon size={17} aria-hidden="true" />
        <span className="file-input-file-name" title={file.name}>{file.name}</span>
        <small>{formatBytes(file.size)}</small>
        <button type="button" aria-label={`Remove ${file.name}`} disabled={disabled} onClick={() => onFilesChange(files.filter((_, fileIndex) => fileIndex !== index))}><X size={15} /></button>
      </li>)}</ul>
    </div>}
  </div>;
}
