import { cn } from "../lib/cn.js";
import { useTheme } from "./ThemeProvider.jsx";
export function ThemeToggle({
  variant
}) {
  const {
    theme,
    toggle
  } = useTheme();
  const isDark = theme === 'dark';
  if (variant === 'minimal') {
    return <button onClick={toggle} title={isDark ? 'Modo claro' : 'Modo escuro'} aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'} className={cn("flex items-center justify-center w-11 h-11 p-0 rounded-full border-0 bg-transparent cursor-pointer text-text-sub transition-colors duration-200 motion-reduce:transition-none", "hover:text-gold-text hover:bg-bg-elevated")}>
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          {isDark ? <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /> : <>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
            </>}
        </svg>
      </button>;
  }
  return <button onClick={toggle} title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'} className="flex items-center gap-2 py-1.5 px-3 rounded-control border border-border bg-bg-elevated cursor-pointer font-sans">
      <span className={cn("relative w-7 h-4 rounded-full transition-all duration-200 motion-reduce:transition-none shrink-0", isDark ? "bg-gold" : "bg-border-soft")}>
        <span className={cn("absolute top-0.5 w-3 h-3 rounded-full transition-all duration-200 motion-reduce:transition-none", isDark ? "left-3.5" : "left-0.5", isDark ? "bg-accent-ink" : "bg-white")} />
      </span>
      <span className="text-micro font-semibold text-text-sub tracking-wide font-mono tabular-nums">{isDark ? 'ESCURO' : 'CLARO'}</span>
    </button>;
}
