import { cn } from '../lib/cn.js';
import { colorClass } from './palette.js';
export const toneClasses = {
  grey: 'bg-grey-bg text-grey-fg border-grey-border',
  green: 'bg-green-bg text-green-fg border-green-border',
  orange: 'bg-orange-bg text-orange-fg border-orange-border',
  yellow: 'bg-yellow-bg text-yellow-fg border-yellow-border',
  red: 'bg-red-bg text-red-fg border-red-border',
  blue: 'bg-blue-bg text-blue-fg border-blue-border'
};
export function Badge({
  label,
  map,
  tone = 'grey',
  className
}) {
  return <span className={cn('inline-flex items-center gap-1.5 whitespace-nowrap rounded-control border px-2 py-0.5 text-caption font-semibold', toneClasses[map?.[label]?.tone ?? tone] ?? toneClasses.grey, className)}><span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-current" />{label}</span>;
}
export function Chip({
  children,
  color = 'var(--gold)',
  tone,
  className
}) {
  return <span className={cn('inline-flex whitespace-nowrap rounded-control bg-bg-elevated px-2 py-1 font-mono text-micro font-semibold tracking-wide', tone ? toneClasses[tone] : colorClass(color), className)}>{children}</span>;
}
export function Alert({
  tone = 'error',
  children
}) {
  const names = {
    error: 'red',
    warn: 'orange',
    success: 'green',
    info: 'blue'
  };
  return <div role={tone === 'error' ? 'alert' : 'status'} className={cn('mb-4 rounded-control border border-l-4 px-4 py-3 font-sans text-compact font-medium leading-normal', toneClasses[names[tone] ?? 'blue'])}>{children}</div>;
}
