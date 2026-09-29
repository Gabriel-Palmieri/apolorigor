import { cn } from "../../lib/cn.js";
const variants = {
  solid:
    "bg-gold-strong text-button-ink border-gold-strong hover:brightness-110",
  ghost:
    "bg-transparent text-text border-border hover:border-gold hover:bg-bg-elevated",
  dark: "bg-sidebar text-sidebar-text border-sidebar hover:brightness-125",
};
export function Button({
  children,
  variant = "solid",
  size = "regular",
  href,
  type = "button",
  disabled,
  className,
  textClassName,
  ...props
}) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-control border font-sans font-semibold transition-colors active:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50",
    variants[variant],
    size === "compact" ? "px-3 py-2 text-xs" : "px-6 py-3 text-sm",
    textClassName,
    className,
  );
  return href ? (
    <a
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      {...props}
      className={classes}
    >
      {children}
    </a>
  ) : (
    <button {...props} type={type} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
