import { fmtDate } from "../../shared/lib/format.js";
import { aggDia } from "../../domain/agenda.js";
import { capacityAppearance, CapacityBar, MiniStat } from "./CalendarioUI.jsx";
import ConsultaDisponibilidade from "../catalogo/ConsultaDisponibilidade.jsx";
function Bloco({ title, rows, date }) {
  return (
    <section className="mb-6">
      <h3 className="text-base font-medium">{title}</h3>
      {!rows.length && (
        <p className="text-sm text-text-sub">Nenhuma movimentação.</p>
      )}
      {rows.map((e) => (
        <div key={e.transId} className="py-3 border-b border-border-soft">
          <p className="m-0 text-sm text-text">
            {e.titulo} · {e.itens[0]?.nome} · {e.itens[0]?.tam}
          </p>
          <p className="mt-1 mb-0 text-sm text-text-sub">
            {fmtDate(e.retirada)} a {fmtDate(e.devolucao)}
            {date ? " · " + date : ""}
          </p>
        </div>
      ))}
    </section>
  );
}
export default function VisaoDia({ dstr, eventos, counts, cap }) {
  const { saidas, retornos, ativos, nSaidas, nRetornos, nAtivos } = {
    ...aggDia(eventos, dstr),
    ...counts?.[dstr],
  };
  return (
    <div>
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-3 mb-5">
        <MiniStat
          label="Retiradas"
          val={nSaidas}
          sub={nSaidas + " operação(ões)"}
          textClassName={capacityAppearance(nSaidas, cap).textClassName}
        />
        <MiniStat
          label="Devoluções"
          val={nRetornos}
          sub={nRetornos + " operação(ões)"}
          textClassName="text-gold"
        />
        <MiniStat
          label="Locações no período"
          val={nAtivos}
          sub={nAtivos + " operação(ões)"}
          textClassName="text-text"
        />
      </div>
      <CapacityBar n={nSaidas} cap={cap} label="Carga prevista de retiradas" />
      <p className="text-xs text-text-sub">Os totais consideram todas as reservas. As listas abaixo mostram as operações desta página.</p>
      <Bloco title="Locações nesta página" rows={ativos} />
      <Bloco title="Retiradas do dia" rows={saidas} />
      <Bloco title="Devoluções do dia" rows={retornos} />
      <ConsultaDisponibilidade key={dstr} date={dstr} />
    </div>
  );
}
