import { cn } from "../../shared/lib/cn.js";
import { colorClass, C } from "../../shared/ui/palette.js";
import { DIAS, iso, addDays, startOfWeek, isWeekend } from "./calendar.js";
import { aggDia } from "../../domain/agenda.js";
import { capacityAppearance, LegendSwatch } from "./CalendarioUI.jsx";
function MonthView({ cursor, eventos, cap, selected, onSelect }) {
  const year = cursor.getFullYear(),
    month = cursor.getMonth();
  const gridStart = startOfWeek(new Date(year, month, 1));
  const cells = Array.from(
    {
      length: 42,
    },
    (_, i) => addDays(gridStart, i),
  );
  const hoje = iso(new Date());
  return (
    <div>
      <div className="grid grid-cols-7 gap-1.5 mb-1.5">
        {DIAS.map((d, i) => (
          <p
            key={d}
            className={cn(
              "m-0 text-micro font-bold text-center",
              i === 0 || i === 6 ? "text-gold-text" : "text-text-sub",
            )}
          >
            {d}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          const dstr = iso(d);
          const inMonth = d.getMonth() === month;
          const { saidas, nSaidas, nRetornos } = aggDia(eventos, dstr);
          const h = capacityAppearance(nSaidas, cap);
          const isToday = dstr === hoje;
          const sel = selected === dstr;
          return (
            <div
              key={i}
              onClick={() => onSelect(dstr)}
              className={cn(
                "min-h-24 p-1.5 cursor-pointer rounded-card",
                inMonth ? "opacity-100" : "opacity-30",
                sel
                  ? "bg-gold-dim"
                  : nSaidas
                    ? colorClass(h.bg, "bg")
                    : isWeekend(d)
                      ? "bg-bg-elevated"
                      : "bg-card",
                cn(
                  "border",
                  sel
                    ? "border-gold"
                    : nSaidas
                      ? colorClass(h.border, "border")
                      : "border-border",
                ),
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={cn(
                    "text-xs",
                    isToday ? "font-extrabold" : "font-semibold",
                    isToday ? "text-gold" : "text-text",
                  )}
                >
                  {d.getDate()}
                </span>
                {(nSaidas > 0 || nRetornos > 0) && (
                  <span className="text-micro font-bold flex gap-1">
                    {nSaidas > 0 && (
                      <span className={cn("", colorClass(h.accent, "text"))}>
                        ↑{nSaidas}
                      </span>
                    )}
                    {nRetornos > 0 && (
                      <span className="text-blue-fg">↓{nRetornos}</span>
                    )}
                  </span>
                )}
              </div>
              {saidas.slice(0, 2).map((e) => (
                <div
                  key={e.transId}
                  className="text-micro text-text bg-bg-elevated rounded-control py-0.5 px-1 mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis"
                >
                  <span
                    className={cn("font-bold", colorClass(h.accent, "text"))}
                  >
                    {e.nPecas}
                  </span>{" "}
                  {e.titulo}
                </div>
              ))}
              {saidas.length > 2 && (
                <p className="m-0 text-micro text-text-sub">
                  +{saidas.length - 2} evento(s)
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-3.5 mt-2.5 text-micro text-text-sub flex-wrap items-center">
        <span>↑ saídas · ↓ retornos · fundo = carga do dia:</span>
        <LegendSwatch
          c="var(--status-green-fg)"
          t={`até ${Math.round(cap * 0.5)}`}
        />
        <LegendSwatch
          c="var(--status-orange-fg)"
          t={`até ${Math.round(cap * 0.85)}`}
        />
        <LegendSwatch c={C.gold} t={`até ${cap}`} />
        <LegendSwatch c="var(--status-red-fg)" t={`acima de ${cap}`} />
      </div>
    </div>
  );
}
export default MonthView;
