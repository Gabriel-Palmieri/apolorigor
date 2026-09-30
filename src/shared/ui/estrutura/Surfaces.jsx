import { cn } from "../../lib/cn.js";
import { TickRule } from "./Tape.jsx";
export function Card({ children, className, onClick, accent }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={cn(
        "rounded-card border border-border bg-card p-5 text-text",
        onClick && "block w-full text-left font-sans hover:border-gold",
        accent && "relative overflow-hidden",
        className,
      )}
    >
      {accent && (
        <TickRule
          textClassName="text-gold"
          className="absolute inset-x-0 top-0 opacity-70"
        />
      )}
      {children}
    </Tag>
  );
}
export function Stat({ label, value, hint, textClassName = "text-text", className }) {
  return (
    <Card className={cn("p-4", className)}>
      <p className="mb-2 font-mono text-micro font-semibold uppercase tracking-widest text-text-sub">
        {label}
      </p>
      <p
        className={cn(
          "m-0 font-mono text-3xl font-medium leading-none tabular-nums",
          textClassName,
        )}
      >
        {value}
      </p>
      {hint && <p className="mb-0 mt-1.5 text-caption text-text-sub">{hint}</p>}
    </Card>
  );
}
export function TH({ children, className }) {
  return (
    <th
      className={cn(
        "border-b border-border pb-3 pr-3 text-left font-mono text-micro font-semibold uppercase tracking-widest text-text-sub",
        className,
      )}
    >
      {children}
    </th>
  );
}
export function TD({ children, className }) {
  return (
    <td
      className={cn(
        "border-b border-border-soft py-3 pr-3 font-sans",
        className,
      )}
    >
      {children}
    </td>
  );
}
