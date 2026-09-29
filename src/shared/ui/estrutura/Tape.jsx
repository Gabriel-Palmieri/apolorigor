import { cn } from "../../lib/cn.js";
export function TickRule({ textClassName = "text-text-muted", className }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "tape-rule h-2 w-full opacity-55",
        textClassName,
        className,
      )}
    />
  );
}
