import { useId, isValidElement, cloneElement } from 'react';
import { cn } from '../lib/cn.js';
const control = 'w-full rounded-control border border-border bg-input-bg px-3 py-2.5 font-sans text-sm text-text placeholder:text-text-sub focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold disabled:cursor-not-allowed disabled:opacity-50';
export function Label({
  children,
  id
}) {
  return <span id={id} className="mb-2 block font-sans text-sm font-medium text-text">{children}</span>;
}
export function Field({
  label,
  hint,
  error,
  children,
  className
}) {
  const feedbackId = useId();
  const isGroup = isValidElement(children) && children.type === ChipGroup;
  const control = isValidElement(children) && (error || hint || isGroup) ? cloneElement(children, {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || hint ? feedbackId : undefined,
    ...(isGroup ? { 'aria-labelledby': feedbackId + '-label' } : {})
  }) : children;
  const Container = isGroup ? 'div' : 'label';
  return <div className={cn('mb-4 block', className)}><Container className="block">{label && <Label id={feedbackId + '-label'}>{label}</Label>}{control}</Container>{hint && !error && <span id={feedbackId} className="mt-1.5 block text-xs text-text-sub">{hint}</span>}{error && <span id={feedbackId} role="alert" className="mt-1.5 block text-xs text-red-fg">{error}</span>}</div>;
}
export function Input({
  label,
  className,
  ...props
}) {
  const input = <input {...props} className={cn(control, className)} />;
  return label ? <Field label={label}>{input}</Field> : input;
}
export function TextArea({
  label,
  className,
  ...props
}) {
  const input = <textarea {...props} className={cn(control, 'min-h-24 resize-y', className)} />;
  return label ? <Field label={label}>{input}</Field> : input;
}
export function Select({
  label,
  options,
  placeholder = 'Selecione…',
  className,
  ...props
}) {
  const input = <select {...props} className={cn(control, 'cursor-pointer', className)}><option value="">{placeholder}</option>{options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}</select>;
  return label ? <Field label={label}>{input}</Field> : input;
}
export function ChipGroup({
  value,
  onChange,
  options,
  columns,
  ...props
}) {
  const id = useId();
  return <div {...props} role="group" className={cn('grid gap-2', columns === 2 ? 'grid-cols-2' : columns === 3 ? 'grid-cols-3' : 'grid-cols-2 tablet:grid-cols-4')}>{options.map(o => {
      const v = o.value ?? o;
      const active = value === v;
      return <button key={`${id}-${v}`} type="button" aria-pressed={active} onClick={() => onChange(v)} className={cn('rounded-control border px-3 py-2.5 text-left font-sans text-sm transition-colors', active ? 'border-gold bg-gold-dim font-semibold text-gold-strong' : 'border-border text-text hover:border-gold')}>{o.label ?? o}{o.sub && <span className="mt-1 block text-caption text-text-sub">{o.sub}</span>}</button>;
    })}</div>;
}
