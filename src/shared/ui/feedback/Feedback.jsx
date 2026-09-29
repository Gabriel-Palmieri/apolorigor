import { cn } from "../../lib/cn.js";
import { aparenciaTom } from "./aparencia.js";
export function Badge({ label, map, tone = "grey", className }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-control border px-2 py-0.5 text-caption font-semibold",
        aparenciaTom(map?.[label]?.tone ?? tone).classes,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-current"
      />
      {label}
    </span>
  );
}
export function Chip({
  children,
  textClassName = "text-gold",
  tone,
  className,
}) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded-control bg-bg-elevated px-2 py-1 font-mono text-micro font-semibold tracking-wide",
        tone ? aparenciaTom(tone).classes : textClassName,
        className,
      )}
    >
      {children}
    </span>
  );
}
export function Alert({ tone = "error", children }) {
  const names = {
    error: "red",
    warn: "orange",
    success: "green",
    info: "blue",
  };
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "mb-4 rounded-control border border-l-4 px-4 py-3 font-sans text-compact font-medium leading-normal",
        aparenciaTom(names[tone] ?? "blue").classes,
      )}
    >
      {children}
    </div>
  );
}
