import { cn } from '../lib/cn.js';
export function TableViewport({ children, className }) {
  return <div className={cn('max-w-full min-w-0 overflow-x-auto', className)}>{children}</div>;
}
