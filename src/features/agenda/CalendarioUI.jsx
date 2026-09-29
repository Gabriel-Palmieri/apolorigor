import { TickRule } from "../../shared/ui/estrutura/Tape.jsx";
import { cn } from "../../shared/lib/cn.js";
import { aparenciaTom } from "../../shared/ui/feedback/aparencia.js";
import { ProgressFill } from "../../shared/ui/feedback/Progress.jsx";
function capacityAppearance(n, cap) {
  if (!n)
    return {
      bg: "bg-card",
      border: "border-border",
      textClassName: "text-text-sub",
      markerClassName: "bg-text-sub",
    };
  const ratio = n / cap;
  const tone =
    ratio < 0.5
      ? "green"
      : ratio < 0.85
        ? "orange"
        : ratio <= 1
          ? "yellow"
          : "red";
  const appearance = aparenciaTom(tone);
  return {
    ...appearance,
    textClassName: tone === "yellow" ? "text-gold" : appearance.textClassName,
    markerClassName: tone === "yellow" ? "bg-gold" : appearance.markerClassName,
  };
}
const linkBtn =
  "border-0 bg-transparent p-0 text-caption text-text-sub underline cursor-pointer hover:text-gold-text";
const navBtn =
  "size-8 rounded-control border border-border bg-transparent text-base text-text hover:border-gold";
function CapacityBar({ n, cap, label }) {
  const pct = cap > 0 ? Math.min(100, (n / cap) * 100) : 0;
  const h = capacityAppearance(n, cap);
  return (
    <div>
      <div className="flex justify-between text-micro text-text-sub mb-1">
        <span>{label}</span>
        <span className={cn("font-bold", h.textClassName)}>
          {n} / {cap}
          {n > cap ? ` · +${n - cap} acima` : ""}
        </span>
      </div>
      <div className="h-1.5 rounded-control bg-input-bg overflow-hidden">
        <ProgressFill
          className={cn("h-full", h.markerClassName)}
          value={`${pct}%`}
        />
      </div>
    </div>
  );
}
const LegendSwatch = ({ className, t }) => (
  <span className="flex items-center gap-1">
    <span className={cn("w-2 h-2 rounded-control inline-block", className)} />
    {t}
  </span>
);
function MiniStat({ label, val, sub, textClassName }) {
  return (
    <div className="bg-card border border-border rounded-card pt-3 px-3.5 pb-3.5">
      <TickRule
        textClassName={textClassName}
        className="h-1.5 mb-2.5 opacity-70"
      />
      <p className="text-micro text-text-sub mt-0 mx-0 mb-1.5 font-semibold tracking-widest font-mono tabular-nums uppercase">
        {label}
      </p>
      <p
        className={cn(
          "text-2xl font-medium m-0 font-mono tabular-nums leading-none",
          textClassName,
        )}
      >
        {val}
      </p>
      <p className="text-micro text-text-sub mt-1 mx-0 mb-0">{sub}</p>
    </div>
  );
}
export {
  capacityAppearance,
  linkBtn,
  navBtn,
  CapacityBar,
  LegendSwatch,
  MiniStat,
};
