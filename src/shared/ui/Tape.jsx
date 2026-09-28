import { cn } from '../lib/cn.js';
import { colorClass } from './palette.js';
export function TickRule({ color, className }) {
  return <div aria-hidden="true" className={cn('tape-rule h-2 w-full opacity-55', color ? colorClass(color) : 'text-text-muted', className)} />;
}
