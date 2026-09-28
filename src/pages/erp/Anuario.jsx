import { Card } from "../../shared/ui/Surfaces.jsx";
import { SectionTitle, Heading } from "../../shared/ui/Typography.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useData } from "../../data/useData.js";
import { useState, useMemo } from "react";
import { fmtDate } from "../../shared/lib/format.js";
import {
  MESES,
  iso,
  startOfWeek,
  parse,
} from "../../features/agenda/calendar.js";
import { buildEventos, aggDia } from "../../domain/agenda.js";
import { navBtn } from "../../features/agenda/CalendarioUI.jsx";
import MonthView from "../../features/agenda/MonthView.jsx";
import WeekView from "../../features/agenda/WeekView.jsx";
import AgendaView from "../../features/agenda/AgendaView.jsx";
import DayView from "../../features/agenda/DayView.jsx";
export default function Anuario() {
  const { produtos, trans } = useData();
  const [modo, setModo] = useState("agenda");
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(iso(new Date()));
  const [cap, setCap] = useState(50);
  const eventos = useMemo(
    () => buildEventos(produtos, trans),
    [produtos, trans],
  );
  const nav = (dir) => {
    const c = new Date(cursor);
    if (modo === "mes") c.setMonth(c.getMonth() + dir);
    else if (modo === "semana") c.setDate(c.getDate() + dir * 7);
    else c.setDate(c.getDate() + dir);
    setCursor(c);
    if (modo === "dia") setSelected(iso(c));
  };
  const irParaHoje = () => {
    const t = new Date();
    setCursor(t);
    setSelected(iso(t));
  };
  const irParaDia = (dstr) => {
    setSelected(dstr);
    setCursor(parse(dstr));
    setModo("dia");
  };
  const titulo =
    modo === "mes"
      ? `${MESES[cursor.getMonth()]} ${cursor.getFullYear()}`
      : modo === "semana"
        ? `Semana de ${fmtDate(iso(startOfWeek(cursor)))}`
        : modo === "dia"
          ? fmtDate(selected)
          : "Todos os fins de semana";
  const resumoMes = useMemo(() => {
    if (modo !== "mes") return null;
    const y = cursor.getFullYear(),
      m = cursor.getMonth();
    let totalSaidas = 0,
      pico = 0,
      diasCheios = 0;
    for (let d = 1; d <= 31; d++) {
      const dt = new Date(y, m, d);
      if (dt.getMonth() !== m) break;
      const { nSaidas } = aggDia(eventos, iso(dt));
      totalSaidas += nSaidas;
      pico = Math.max(pico, nSaidas);
      if (nSaidas > cap) diasCheios++;
    }
    return {
      totalSaidas,
      pico,
      diasCheios,
    };
  }, [modo, cursor, eventos, cap]);
  return (
    <div>
      <Card className="mb-4">
        <div className="flex justify-between items-center flex-wrap gap-2.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            {modo !== "agenda" && (
              <>
                <button onClick={() => nav(-1)} className={navBtn}>
                  ‹
                </button>
                <button onClick={() => nav(1)} className={navBtn}>
                  ›
                </button>
                <button
                  onClick={irParaHoje}
                  className={cn("w-auto py-1.5 px-3 text-caption", navBtn)}
                >
                  Hoje
                </button>
              </>
            )}
            <Heading size={15}>{titulo}</Heading>
          </div>
          <div className="flex gap-1.5 items-center flex-wrap">
            <label className="text-micro text-text-sub font-bold tracking-wide flex items-center gap-1.5">
              CAPACIDADE/DIA
              <input
                type="number"
                min={1}
                value={cap}
                onChange={(e) =>
                  setCap(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-14 py-1 px-1.5 bg-input-bg border border-border rounded-card text-text text-xs outline-none font-sans"
              />
            </label>
            <div className="w-px h-5 bg-border my-0 mx-1" />
            {[
              ["agenda", "Agenda"],
              ["dia", "Dia"],
              ["semana", "Semana"],
              ["mes", "Mês"],
            ].map(([k, l]) => (
              <button
                key={k}
                onClick={() => {
                  setModo(k);
                  if (k === "dia") setCursor(parse(selected));
                }}
                className={cn(
                  "py-1.5 px-3.5 rounded-card cursor-pointer text-xs font-bold font-sans",
                  modo === k ? "bg-gold" : "bg-transparent",
                  modo === k ? "text-accent-ink" : "text-text-sub",
                  modo === k ? "border-0" : "border border-border",
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        {resumoMes && (
          <div className="flex gap-4 mt-3 pt-3 border-t border-t-border text-caption text-text-sub flex-wrap">
            <span>
              <strong className="text-text">{resumoMes.totalSaidas}</strong>{" "}
              peças saem no mês
            </span>
            <span>
              pico de{" "}
              <strong
                className={cn(
                  "",
                  resumoMes.pico > cap ? "text-red-fg" : "text-gold",
                )}
              >
                {resumoMes.pico}
              </strong>{" "}
              num único dia
            </span>
            <span>
              <strong
                className={cn(
                  "",
                  resumoMes.diasCheios ? "text-red-fg" : "text-green-fg",
                )}
              >
                {resumoMes.diasCheios}
              </strong>{" "}
              dia(s) acima da capacidade
            </span>
          </div>
        )}
      </Card>

      <Card className="mb-4">
        {modo === "agenda" && (
          <AgendaView eventos={eventos} cap={cap} onSelectDay={irParaDia} />
        )}
        {modo === "mes" && (
          <MonthView
            cursor={cursor}
            eventos={eventos}
            cap={cap}
            selected={selected}
            onSelect={setSelected}
          />
        )}
        {modo === "semana" && (
          <WeekView
            cursor={cursor}
            eventos={eventos}
            cap={cap}
            selected={selected}
            onSelect={setSelected}
          />
        )}
        {modo === "dia" && (
          <DayView
            dstr={selected}
            produtos={produtos}
            eventos={eventos}
            cap={cap}
          />
        )}
      </Card>

      {(modo === "mes" || modo === "semana") && (
        <Card>
          <SectionTitle>
            DETALHES DE {fmtDate(selected).toUpperCase()}
          </SectionTitle>
          <DayView
            dstr={selected}
            produtos={produtos}
            eventos={eventos}
            cap={cap}
          />
        </Card>
      )}
    </div>
  );
}
