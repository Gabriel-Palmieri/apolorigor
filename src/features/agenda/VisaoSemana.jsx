import { cn } from "../../shared/lib/cn.js";
import { DIAS, iso, addDays, startOfWeek, isWeekend } from "./calendario.js";
import { aggDia } from "../../domain/agenda.js";
import { capacityAppearance, CapacityBar } from "./CalendarioUI.jsx";
function VisaoSemana({ cursor, eventos, cap, selected, onSelect }) {
  const start = startOfWeek(cursor);
  const days = Array.from(
    {
      length: 7,
    },
    (_, i) => addDays(start, i),
  );
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
      {days.map((d, i) => {
        const dstr = iso(d);
        const { saidas, retornos, nSaidas, nRetornos, nAtivos } = aggDia(
          eventos,
          dstr,
        );
        const sel = selected === dstr;
        const wknd = isWeekend(d);
        return (
          <div
            key={i}
            role="button"
            tabIndex={0}
            aria-pressed={sel}
            aria-label={`${DIAS[d.getDay()]} ${d.getDate()}: ${nSaidas} saídas, ${nRetornos} retornos`}
            onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onSelect(dstr); } }}
            onClick={() => onSelect(dstr)}
            className={cn(
              "min-w-0 p-3 cursor-pointer rounded-card xl:min-h-56 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
              sel ? "bg-gold-dim" : wknd ? "bg-bg-elevated" : "bg-card",
              cn("border", sel ? "border-gold" : "border-border"),
            )}
          >
            <div className="flex justify-between gap-3 mb-3 xl:flex-col">
              <div>
                <p
                  className={cn(
                    "m-0 text-xs font-bold",
                    wknd ? "text-gold-text" : "text-text-sub",
                  )}
                >
                  {DIAS[d.getDay()]}
                </p>
                <p className="m-0 text-xl font-bold text-text">
                  {d.getDate()}
                </p>
              </div>
              <div className="text-right text-xs text-text-sub leading-relaxed xl:text-left">
                <div
                  className={cn(
                    "font-bold",
                    capacityAppearance(nSaidas, cap).textClassName,
                  )}
                >
                  ↑ {nSaidas}
                </div>
                <div className="text-blue-fg">↓ {nRetornos}</div>
                <div>{nAtivos} em campo</div>
              </div>
            </div>
            <div className="mb-2">
              <CapacityBar n={nSaidas} cap={cap} label="Saídas" />
            </div>
            {saidas.map((e) => (
              <div
                key={e.transId}
                className="text-micro bg-bg-elevated rounded-control py-1 px-1.5 mb-1"
              >
                <div className="text-text font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                  <span className="text-gold">{e.nPecas}</span> {e.titulo}
                </div>
                <div className="text-text-sub">{e.subtitulo}</div>
              </div>
            ))}
            {retornos.map((e) => (
              <div
                key={"r" + e.transId}
                className="text-micro text-blue-fg py-0.5 px-1.5 whitespace-nowrap overflow-hidden text-ellipsis"
              >
                ↓ {e.nPecas} {e.titulo}
              </div>
            ))}
            {saidas.length === 0 && retornos.length === 0 && (
              <p className="m-0 text-xs text-green-fg">Livre</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
export default VisaoSemana;
