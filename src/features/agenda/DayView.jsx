import { Chip } from "../../shared/ui/Feedback.jsx";
import { cn } from "../../shared/lib/cn.js";
import { colorClass, C } from "../../shared/ui/palette.js";
import { useState, useMemo } from "react";
import { fmtDate } from "../../shared/lib/format.js";
import { aggDia } from "../../domain/agenda.js";
import {
  capacityAppearance,
  linkBtn,
  CapacityBar,
  MiniStat,
} from "./CalendarioUI.jsx";
function LinhaEvento({ e, tag, cor }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-2 px-0 border-b border-b-border">
      <div className="flex justify-between items-center gap-2">
        <div className="min-w-0">
          <p className="m-0 text-compact text-text font-medium">
            <span className={cn("font-extrabold", colorClass(cor, "text"))}>
              {tag} {e.nPecas}
            </span>{" "}
            · {e.titulo}
          </p>
          <p className="mt-0.5 mx-0 mb-0 text-caption text-text-sub">
            {e.subtitulo} · {fmtDate(e.retirada)} → {fmtDate(e.devolucao)}
          </p>
        </div>
        {e.itens.length > 1 && (
          <button
            onClick={() => setOpen(!open)}
            className={cn("text-gold shrink-0", linkBtn)}
          >
            {open ? "ocultar" : "peças"}
          </button>
        )}
      </div>
      {open && (
        <div className="mt-1.5 pl-2.5">
          {e.itens.map((i, idx) => (
            <div
              key={idx}
              className="flex justify-between gap-2 text-caption py-0.5 px-0"
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
function Bloco({ titulo, vazio, itens }) {
  return (
    <div className="mb-3.5">
      <p className="text-micro text-gold-text font-bold tracking-wide mt-0 mx-0 mb-2">
        {titulo}
      </p>
      {itens.length === 0 ? (
        <p className="text-text-sub text-xs m-0">{vazio}</p>
      ) : (
        itens
      )}
    </div>
  );
}
function DayView({ dstr, produtos, eventos, cap }) {
  const [showCat, setShowCat] = useState(false);
  const { saidas, retornos, ativos, nSaidas, nRetornos, nAtivos } = aggDia(
    eventos,
    dstr,
  );
  const ocupado = {};
  ativos.forEach((e) =>
    e.itens.forEach((i) => {
      if (i.produtoId != null) {
        const key = `${i.produtoId}|${i.tam}`;
        ocupado[key] = (ocupado[key] || 0) + 1;
      }
    }),
  );
  const variantes = useMemo(() => {
    const list = [];
    produtos.forEach((p) =>
      (p.variantes || []).forEach((v) =>
        list.push({
          produto: p,
          tam: v.tam,
          qtd: v.qtd,
        }),
      ),
    );
    return list;
  }, [produtos]);
  const comLivre = variantes.filter(
    (x) => x.qtd - (ocupado[`${x.produto.id}|${x.tam}`] || 0) > 0,
  ).length;
  const esgotados = variantes.length - comLivre;
  return (
    <div>
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-2.5 mb-4">
        <MiniStat
          label="Saídas (retiradas)"
          val={nSaidas}
          sub={`${saidas.length} evento(s)`}
          color={capacityAppearance(nSaidas, cap).accent}
        />
        <MiniStat
          label="Retornos (devoluções)"
          val={nRetornos}
          sub={`${retornos.length} evento(s)`}
          color="var(--status-blue-fg)"
        />
        <MiniStat
          label="Peças em campo"
          val={nAtivos}
          sub={`${ativos.length} locação(ões) ativa(s)`}
          color={C.text}
        />
      </div>
      <div className="mb-4">
        <CapacityBar
          n={nSaidas}
          cap={cap}
          label={`Carga de saídas em ${fmtDate(dstr)}`}
        />
      </div>

      <Bloco
        titulo="SAÍDAS DO DIA"
        vazio="Nenhuma retirada agendada."
        itens={saidas.map((e) => (
          <LinhaEvento
            key={e.transId}
            e={e}
            tag="↑"
            cor={capacityAppearance(e.nPecas, cap).accent}
          />
        ))}
      />
      <Bloco
        titulo="RETORNOS DO DIA"
        vazio="Nenhuma devolução agendada."
        itens={retornos.map((e) => (
          <LinhaEvento
            key={e.transId}
            e={e}
            tag="↓"
            cor="var(--status-blue-fg)"
          />
        ))}
      />
      <Bloco
        titulo="LOCAÇÕES EM CAMPO"
        vazio="Nenhuma peça reservada nesta data."
        itens={ativos.map((e) => (
          <LinhaEvento key={e.transId} e={e} tag="•" cor={C.textSub} />
        ))}
      />

      <div className="mt-4">
        <div className="flex justify-between items-center gap-2.5 mb-2.5 flex-wrap">
          <p className="text-micro text-gold-text font-bold tracking-wide m-0">
            DISPONIBILIDADE DO CATÁLOGO
          </p>
          <div className="flex gap-2 items-center">
            <Chip color="var(--status-green-fg)">
              {comLivre} com unidade livre
            </Chip>
            <Chip
              color={
                esgotados ? "var(--status-orange-fg)" : "var(--status-green-fg)"
              }
            >
              {esgotados} sem folga
            </Chip>
            <button
              onClick={() => setShowCat(!showCat)}
              className={cn("text-gold", linkBtn)}
            >
              {showCat ? "ocultar" : "detalhar"}
            </button>
          </div>
        </div>
        {showCat && (
          <div className="grid grid-cols-catalog gap-2">
            {variantes.map((x) => {
              const livre = x.qtd - (ocupado[`${x.produto.id}|${x.tam}`] || 0);
              return (
                <div
                  key={`${x.produto.id}-${x.tam}`}
                  className="flex justify-between items-center py-2 px-3 bg-card border border-border rounded-card"
                >
                  <span className="text-xs text-text">
                    {x.produto.nome}{" "}
                    <span className="text-text-sub">({x.tam})</span>
                  </span>
                  <Chip
                    color={
                      livre > 0
                        ? "var(--status-green-fg)"
                        : "var(--status-orange-fg)"
                    }
                  >
                    {livre > 0 ? `${livre} livre` : "Reservado"}
                  </Chip>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
export default DayView;
