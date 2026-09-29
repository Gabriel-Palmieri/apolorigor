import { cn } from "../../shared/lib/cn.js";
export function ResumoLinha({ k, v, strong }) {
  return (
    <div className="flex justify-between border-b border-border-soft py-1.5">
      <dt className="text-text-sub">{k}</dt>
      <dd
        className={cn(
          "m-0 font-mono",
          strong ? "font-semibold text-gold-text" : "font-medium text-text",
        )}
      >
        {v}
      </dd>
    </div>
  );
}
