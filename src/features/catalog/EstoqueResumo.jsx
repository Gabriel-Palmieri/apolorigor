import { cn } from "../../shared/lib/cn.js";
import { ProgressFill } from "../../shared/ui/Progress.jsx";
function StockBreakdown({
  counts
}) {
  const {
    total,
    alugado,
    ajuste,
    disponivel
  } = counts;
  const pct = n => total > 0 ? n / total * 100 : 0;
  return <div>
      <div className={cn("h-1.5 rounded-control overflow-hidden flex bg-border-soft mb-1.5", total > 0 ? "gap-px" : "gap-0")}>
        <ProgressFill className="bg-green-fg" value={`${pct(disponivel)}%`} />
        <ProgressFill className="bg-orange-fg" value={`${pct(alugado)}%`} />
        <ProgressFill className="bg-yellow-fg" value={`${pct(ajuste)}%`} />
      </div>
      <div className="flex gap-2.5 text-micro text-text-sub flex-wrap">
        <span>Total <b className="text-text">{total}</b></span>
        <span className="text-green-fg">Livres <b>{disponivel}</b></span>
        <span className="text-orange-fg">Alugadas <b>{alugado}</b></span>
        <span className="text-yellow-fg">Ajuste <b>{ajuste}</b></span>
      </div>
    </div>;
}
export { StockBreakdown };
