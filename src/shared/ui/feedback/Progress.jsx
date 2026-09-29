import { cn } from "../../lib/cn.js";
// Continuous percentages cannot be represented by a finite utility scale.
export function ProgressFill({ value, axis = "horizontal", className }) {
  const percentage = Math.max(0, Math.min(100, Number.parseFloat(value) || 0));
  return (
    <div
      aria-hidden="true"
      className={cn(
        axis === "vertical" ? "progress-height" : "progress-fill",
        className,
      )}
      style={{
        "--progress": percentage + "%",
      }}
    />
  );
}
