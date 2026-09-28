import { Heading } from "../../shared/ui/Typography.jsx";
import { Chip } from "../../shared/ui/Feedback.jsx";
import { cn } from "../../shared/lib/cn.js";
import { colorClass, C } from "../../shared/ui/palette.js";
import { useState, useMemo } from "react";
import {
  MES_ABBR,
  iso,
  addDays,
  startOfWeek,
  parse,
  fmtShort,
} from "./calendar.js";
import { capacityAppearance, linkBtn } from "./CalendarioUI.jsx";
function EventoCard({ e, cap, onSelectDay }) {
  const [open, setOpen] = useState(false);
  const h = capacityAppearance(e.nPecas, cap);
  return (
    <div
      className={cn(
        "bg-card border border-border rounded-card py-3 px-3.5",
        cn(
          "border-l-4",
          e.tipo === "padronizada" ? "border-blue-fg" : "border-orange-fg",
        ),
      )}
    >
      <div className="flex justify-between gap-2">
        <div className="min-w-0">
          <p className="m-0 text-compact font-semibold text-text whitespace-nowrap overflow-hidden text-ellipsis">
            {e.titulo}
          </p>
          <p className="mt-0.5 mx-0 mb-0 text-caption text-text-sub">
            {e.subtitulo}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className={cn(
              "m-0 text-lg font-extrabold",
              colorClass(h.accent, "text"),
            )}
          >
            {e.nPecas}
          </p>
          <p className="m-0 text-micro text-text-sub">peças</p>
        </div>
      </div>
      <div className="flex gap-2.5 my-2 mx-0 text-caption text-text-sub flex-wrap items-center">
        <button onClick={() => onSelectDay(e.retirada)} className={linkBtn}>
          ↑ retira {fmtShort(e.retirada)}
        </button>
        <button onClick={() => onSelectDay(e.devolucao)} className={linkBtn}>
          ↓ devolve {fmtShort(e.devolucao)}
        </button>
        {e.dataEvento && <span>· evento {fmtShort(e.dataEvento)}</span>}
      </div>
      <div className="flex gap-1 flex-wrap">
        {e.breakdown.map(([cat, n]) => (
          <span
            key={cat}
            className="text-micro text-text-sub bg-bg-elevated border border-border rounded-control py-0.5 px-1.5"
          >
            {n}× {cat}
          </span>
        ))}
      </div>
      {e.itens.length > 1 && (
        <button
          onClick={() => setOpen(!open)}
          className={cn("text-gold mt-2", linkBtn)}
        >
          {open ? "Ocultar peças" : `Ver ${e.itens.length} peças`}
        </button>
      )}
      {open && (
        <div className="mt-1.5">
          {e.itens.map((i, idx) => (
            <div
              key={idx}
              className="flex justify-between gap-2 text-caption py-1 px-0 border-b border-b-border"
            >
              <span className="text-text">
                {i.nome} <span className="text-text-sub">({i.tam})</span>
              </span>
              <span className="text-text-sub text-right">{i.quem}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
function AgendaView({ eventos, cap, onSelectDay }) {
  const [q, setQ] = useState("");
  const [tipo, setTipo] = useState("todos");
  const grupos = useMemo(() => {
    const s = q.trim().toLowerCase();
    const filtrados = eventos.filter((e) => {
      if (tipo !== "todos" && e.tipo !== tipo) return false;
      if (!s) return true;
      return (
        e.titulo.toLowerCase().includes(s) ||
        e.subtitulo.toLowerCase().includes(s) ||
        e.itens.some(
          (i) =>
            i.nome.toLowerCase().includes(s) ||
            i.quem.toLowerCase().includes(s),
        )
      );
    });
    const map = new Map();
    filtrados.forEach((e) => {
      const anchor = parse(e.dataEvento || e.retirada);
      const key = iso(addDays(startOfWeek(anchor), 6)); // sábado da semana
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(e);
    });
    return [...map.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([key, evs]) => [
        key,
        evs.sort((a, b) =>
          (a.dataEvento || a.retirada).localeCompare(
            b.dataEvento || b.retirada,
          ),
        ),
      ]);
  }, [eventos, q, tipo]);
  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        <input
          value={q}
          onChange={(ev) => setQ(ev.target.value)}
          placeholder="Buscar evento, noivos, peça ou pessoa..."
          className="flex-1 min-w-56 py-2 px-2.5 bg-input-bg border border-border rounded-card text-text text-compact outline-none font-sans"
        />
        {[
          ["todos", "Todos"],
          ["padronizada", "Padronizada"],
          ["avulsa", "Avulsa"],
        ].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTipo(k)}
            className={cn(
              "py-1.5 px-3.5 rounded-card cursor-pointer text-xs font-bold font-sans",
              tipo === k ? "bg-gold" : "bg-transparent",
              tipo === k ? "text-accent-ink" : "text-text-sub",
              tipo === k ? "border-0" : "border border-border",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      {grupos.length === 0 && (
        <p className="text-text-sub text-compact">Nenhum evento encontrado.</p>
      )}

      {grupos.map(([key, evs]) => {
        const sat = parse(key),
          sun = addDays(sat, 1);
        const totalPecas = evs.reduce((acc, e) => acc + e.nPecas, 0);
        const porDia = {};
        evs.forEach((e) => {
          porDia[e.retirada] = (porDia[e.retirada] || 0) + e.nPecas;
        });
        const pico = Math.max(0, ...Object.values(porDia));
        const over = pico > cap;
        const label =
          sat.getMonth() === sun.getMonth()
            ? `${sat.getDate()}–${sun.getDate()} ${MES_ABBR[sat.getMonth()]}`
            : `${sat.getDate()} ${MES_ABBR[sat.getMonth()]} – ${sun.getDate()} ${MES_ABBR[sun.getMonth()]}`;
        return (
          <div key={key} className="mb-4">
            <div className="flex items-center justify-between gap-2.5 mb-2 pb-1.5 border-b border-b-border flex-wrap">
              <Heading size={14}>
                Fim de semana · {label}{" "}
                <span className="font-normal text-text-sub font-sans">
                  {sat.getFullYear()}
                </span>
              </Heading>
              <div className="flex gap-2 items-center">
                <Chip color="var(--status-blue-fg)">
                  {evs.length} evento(s)
                </Chip>
                <Chip color={C.gold}>{totalPecas} peças</Chip>
                <Chip
                  color={
                    over ? "var(--status-red-fg)" : "var(--status-green-fg)"
                  }
                >
                  pico {pico}/{cap}
                </Chip>
              </div>
            </div>
            <div className="grid grid-cols-panels gap-2.5">
              {evs.map((e) => (
                <EventoCard
                  key={e.transId}
                  e={e}
                  cap={cap}
                  onSelectDay={onSelectDay}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
export default AgendaView;
