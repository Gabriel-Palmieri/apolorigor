import { cn } from "../../lib/cn.js";
export function SectionTitle({ children, className }) {
  return (
    <p
      className={cn(
        "mb-4 font-mono text-micro font-semibold uppercase tracking-widest text-gold-text",
        className,
      )}
    >
      {children}
    </p>
  );
}
export function Heading({ children, size = 18, className }) {
  return (
    <p
      className={cn(
        "m-0 font-display font-medium leading-tight text-text",
        size <= 15 ? "text-base" : size <= 19 ? "text-lg" : "text-2xl",
        className,
      )}
    >
      {children}
    </p>
  );
}
export function Display({ children, className }) {
  return (
    <h1
      className={cn(
        "m-0 font-display text-editorial font-medium tracking-tight text-text",
        className,
      )}
    >
      {children}
    </h1>
  );
}
export function H2({ children, className }) {
  return (
    <h2
      className={cn(
        "m-0 font-display text-title font-medium tracking-tight text-text",
        className,
      )}
    >
      {children}
    </h2>
  );
}
export function Lead({ children, className }) {
  return (
    <p
      className={cn(
        "m-0 max-w-measure font-sans text-lead text-text-sub",
        className,
      )}
    >
      {children}
    </p>
  );
}
export function Money({ children, prefix, className }) {
  return (
    <span className={cn("font-mono tabular-nums", className)}>
      {prefix}
      {children}
    </span>
  );
}
