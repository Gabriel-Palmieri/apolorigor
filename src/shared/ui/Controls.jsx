import { Button } from './Button.jsx';
import { cn } from '../lib/cn.js';
export function IconBtn({
  children,
  onClick,
  title,
  active
}) {
  return <Button variant="ghost" size="compact" title={title} aria-label={title} aria-pressed={active} onClick={onClick} className={cn('size-9 p-0 text-base', active && 'border-transparent bg-gold-dim text-gold-text')}>{children}</Button>;
}
export function TypeToggle({
  value,
  onChange,
  options
}) {
  return <div className="mb-4 flex flex-wrap gap-1.5">{options.map(({
      key,
      label
    }) => <Button key={key} size="compact" variant={key === value ? 'solid' : 'ghost'} aria-pressed={key === value} onClick={() => onChange(key)}>{label}</Button>)}</div>;
}
