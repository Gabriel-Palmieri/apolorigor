import { Card } from "../../shared/ui/estrutura/Surfaces.jsx";
import {
  SectionTitle,
  Heading,
} from "../../shared/ui/estrutura/Typography.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useRequest } from "../../data/useRequest.js";
import { productFromApi, transactionFromApi } from "../../data/adapters.js";
import Paginacao from "../../shared/ui/estrutura/Paginacao.jsx";
import { useState, useMemo } from "react";
import { fmtDate } from "../../shared/lib/format.js";
import {
  MESES,
  iso,
  startOfWeek,
  parse, addDays,
} from "../../features/agenda/calendario.js";
import { buildEventos } from "../../domain/agenda.js";
import { navBtn } from "../../features/agenda/CalendarioUI.jsx";
import VisaoMes from "../../features/agenda/VisaoMes.jsx";
import VisaoSemana from "../../features/agenda/VisaoSemana.jsx";
import VisaoAgenda from "../../features/agenda/VisaoAgenda.jsx";
import VisaoDia from "../../features/agenda/VisaoDia.jsx";
export default function Anuario() {
  const [modo, setModo] = useState("agenda");
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState(iso(new Date()));
  const [cap, setCap] = useState(50);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const start = modo === "mes" ? startOfWeek(new Date(cursor.getFullYear(), cursor.getMonth(), 1)) : modo === "semana" ? startOfWeek(cursor) : parse(selected);
  const end = addDays(start, modo === "mes" ? 41 : modo === "semana" ? 6 : 0);
  const summary = useRequest(modo === "agenda" ? null : "/transactions/calendar?" + new URLSearchParams({ start: iso(start), end: iso(end) }));
  const counts = useMemo(() => Object.fromEntries((summary.data || []).map(row => [row.day, row])), [summary.data]);
  const detail = useRequest("/transactions/page?" + new URLSearchParams({ page, limit: 20, type: "RENTAL", status: "CONFIRMED", sort: "date", ...(modo === "agenda" ? { q: search } : { day: selected }) }));
  const eventos = useMemo(() => {
    const rows = detail.data?.items || [];
    return buildEventos(rows.map(row => productFromApi({ ...row.variant.product, variants: [] })), rows.map(row => transactionFromApi(row, [], [])));
  }, [detail.data]);
  const selectDay = day => { setSelected(day); setPage(1); };
  const changeMode = mode => { setModo(mode); setPage(1); if (mode === "mes" || mode === "semana") setSelected(iso(cursor)); };
  const gridEvents = modo === "dia" ? eventos : [];
  const nav = (dir) => {
    const c = new Date(cursor);
    if (modo === "mes") c.setMonth(c.getMonth() + dir);
    else if (modo === "semana") c.setDate(c.getDate() + dir * 7);
    else c.setDate(c.getDate() + dir);
    setCursor(c);
    selectDay(iso(c));
  };
  const irParaHoje = () => {
    const t = new Date();
    setCursor(t);
    selectDay(iso(t));
  };
  const irParaDia = (dstr) => {
    selectDay(dstr);
    setCursor(parse(dstr));
    changeMode("dia");
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
      const { nSaidas = 0 } = counts[iso(dt)] || {};
      totalSaidas += nSaidas;
      pico = Math.max(pico, nSaidas);
      if (nSaidas > cap) diasCheios++;
    }
    return {
      totalSaidas,
      pico,
      diasCheios,
    };
  }, [modo, cursor, counts, cap]);
  return (
    <div>
      <Card className="mb-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {modo !== "agenda" && (
              <>
                <button aria-label="Período anterior" onClick={() => nav(-1)} className={navBtn}>
                  ‹
                </button>
                <button aria-label="Próximo período" onClick={() => nav(1)} className={navBtn}>
                  ›
                </button>
                <button
                  onClick={irParaHoje}
                  className={cn("w-auto min-w-16 px-4 text-sm", navBtn)}
                >
                  Hoje
                </button>
              </>
            )}
            <div className="order-first w-full min-w-0 sm:order-none sm:ml-2 sm:w-auto"><Heading size={15}>{titulo}</Heading></div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <label className="text-xs text-text-sub font-semibold flex items-center justify-between gap-3 sm:justify-start">
              CAPACIDADE/DIA
              <input
                type="number"
                min={1}
                value={cap}
                onChange={(e) =>
                  setCap(Math.max(1, Number(e.target.value) || 1))
                }
                className="w-20 min-h-11 py-2 px-3 bg-input-bg border border-border rounded-card text-text text-xs outline-none font-sans"
              />
            </label>
            <div role="group" aria-label="Visualização do calendário" className="grid grid-cols-4 gap-1.5 sm:flex">
            {[
              ["agenda", "Agenda"],
              ["dia", "Dia"],
              ["semana", "Semana"],
              ["mes", "Mês"],
            ].map(([k, l]) => (
              <button
                key={k}
                aria-pressed={modo === k}
                onClick={() => {
                  changeMode(k);
                  if (k === "dia") setCursor(parse(selected));
                }}
                className={cn(
                  "min-h-11 min-w-0 px-2 sm:px-4 rounded-card cursor-pointer text-xs sm:text-sm font-semibold font-sans",
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
        </div>
        {resumoMes && summary.data && (
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

      {(detail.loading || summary.loading) && <p role="status">Atualizando agenda…</p>}
      {summary.error && <p role="alert">{summary.error.message} <button onClick={summary.retry}>Tentar novamente</button></p>}
      {detail.error && <p role="alert">{detail.error.message} <button onClick={detail.retry}>Tentar novamente</button></p>}
      <Card className="mb-4">
        {modo === "agenda" && (
          <VisaoAgenda eventos={eventos} cap={cap} onSelectDay={irParaDia} search={search} onSearch={value => { setSearch(value); setPage(1); }} />
        )}
        {modo === "mes" && summary.data && (
          <VisaoMes
            cursor={cursor}
            eventos={gridEvents}
            counts={counts}
            cap={cap}
            selected={selected}
            onSelect={selectDay}
          />
        )}
        {modo === "semana" && summary.data && (
          <VisaoSemana
            cursor={cursor}
            eventos={gridEvents}
            counts={counts}
            cap={cap}
            selected={selected}
            onSelect={selectDay}
          />
        )}
        {modo === "dia" && summary.data && (
          <VisaoDia
            dstr={selected}
            counts={counts}
            eventos={eventos}
            cap={cap}
          />
        )}
      </Card>

      {(modo === "mes" || modo === "semana") && summary.data && (
        <Card>
          <SectionTitle>
            DETALHES DE {fmtDate(selected).toUpperCase()}
          </SectionTitle>
          <VisaoDia
            dstr={selected}
            counts={counts}
            eventos={eventos}
            cap={cap}
          />
        </Card>
      )}
      <Paginacao pagination={detail.data} pending={detail.loading} error={detail.error?.message} onPage={setPage} />
    </div>
  );
}
