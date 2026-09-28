import { TickRule } from "../../shared/ui/Tape.jsx";
import { cn } from "../../shared/lib/cn.js";
import { colorClass, C, toneAppearance } from "../../shared/ui/palette.js";
import { ProgressFill } from "../../shared/ui/Progress.jsx";
function capacityAppearance(n, cap) {
  if (!n) return { bg: C.card, border: C.border, accent: C.textSub };
  const ratio = n / cap;
  const tone =
    ratio < 0.5
      ? "green"
      : ratio < 0.85
        ? "orange"
        : ratio <= 1
          ? "yellow"
          : "red";
  const appearance = toneAppearance(tone);
  return {
    ...appearance,
    accent: tone === "yellow" ? C.gold : appearance.color,
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
        <span className={cn("font-bold", colorClass(h.accent, "text"))}>
          {n} / {cap}
          {n > cap ? ` · +${n - cap} acima` : ""}
        </span>
      </div>
      <div className="h-1.5 rounded-control bg-input-bg overflow-hidden">
        <ProgressFill
          className={cn("h-full", colorClass(h.accent, "bg"))}
          value={`${pct}%`}
        />
      </div>
    </div>
  );
}
const LegendSwatch = ({ c, t }) => (
  <span className="flex items-center gap-1">
    <span
      className={cn(
        "w-2 h-2 rounded-control inline-block",
        colorClass(c, "bg"),
      )}
    />
    {t}
  </span>
);
function MiniStat({ label, val, sub, color }) {
  return (
    <div className="bg-card border border-border rounded-card pt-3 px-3.5 pb-3.5">
      <TickRule color={color} className="h-1.5 mb-2.5 opacity-70" />
      <p className="text-micro text-text-sub mt-0 mx-0 mb-1.5 font-semibold tracking-widest font-mono tabular-nums uppercase">
        {label}
      </p>
      <p
        className={cn(
          "text-2xl font-medium m-0 font-mono tabular-nums leading-none",
          colorClass(color, "text"),
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
