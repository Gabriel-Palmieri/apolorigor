import { TableViewport } from "../../shared/ui/Table.jsx";
import { Detalhe, dataHora } from "../../features/pedidos/PedidoDetalhe.jsx";
import { PEDIDO_MAP, TIPO_MAP } from "../../shared/ui/status.js";
import { Card, TH, TD, Stat } from "../../shared/ui/Surfaces.jsx";
import { Chip, Badge } from "../../shared/ui/Feedback.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useMemo, useState } from "react";
import { fmt } from "../../shared/lib/format.js";
import { usePedidos, TIPO_LABEL } from "../../features/pedidos/store.js";
export default function Pedidos() {
  const pedidos = usePedidos();
  const [filtro, setFiltro] = useState("Novo");
  const [aberto, setAberto] = useState(null);
  const contagem = useMemo(() => {
    const c = {
      Novo: 0,
      "Em análise": 0,
      Aprovado: 0,
      Recusado: 0
    };
    pedidos.forEach(p => {
      c[p.status] = (c[p.status] || 0) + 1;
    });
    return c;
  }, [pedidos]);
  const lista = filtro === "Todos" ? pedidos : pedidos.filter(p => p.status === filtro);
  const pedidoAberto = aberto ? pedidos.find(p => p.id === aberto) : null;
  return <div className="apollo-anim-in">
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3 mb-5">
        <Stat label="Novos" value={contagem.Novo} color="var(--status-blue-fg)" hint="aguardando triagem" />
        <Stat label="Em análise" value={contagem["Em análise"]} color="var(--status-yellow-fg)" />
        <Stat label="Aprovados" value={contagem.Aprovado} color="var(--status-green-fg)" />
        <Stat label="Recusados" value={contagem.Recusado} color="var(--status-red-fg)" />
      </div>

      <Card>
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {["Novo", "Em análise", "Aprovado", "Recusado", "Todos"].map(f => <button key={f} onClick={() => setFiltro(f)} className={cn("py-1.5 px-3.5 rounded-control cursor-pointer font-sans text-caption", filtro === f ? "font-semibold" : "font-medium", filtro === f ? "bg-gold" : "bg-transparent", filtro === f ? "text-accent-ink" : "text-text-sub", filtro === f ? "border-0" : "border border-border")}>
              {f}
              {f !== "Todos" && contagem[f] ? ` · ${contagem[f]}` : ""}
            </button>)}
        </div>

        {lista.length === 0 ? <p className="text-text-sub text-compact py-7 px-0 text-center">
            Nenhum pedido{" "}
            {filtro !== "Todos" ? `com status "${filtro}"` : "recebido"}.
            Pedidos enviados pelo site aparecem aqui.
          </p> : <TableViewport><table className="w-full border-collapse text-xs">
            <thead>
              <tr>
                <TH>Protocolo</TH>
                <TH>Tipo</TH>
                <TH>Cliente</TH>
                <TH>Item / evento</TH>
                <TH className="text-right">Estimado</TH>
                <TH className="text-right">Recebido</TH>
                <TH className="text-right">Status</TH>
              </tr>
            </thead>
            <tbody>
              {lista.map(p => <tr key={p.id} onClick={() => setAberto(p.id)} className="cursor-pointer">
                  <TD>
                    <span className="font-mono tabular-nums font-semibold text-gold-text">
                      {p.protocolo}
                    </span>
                  </TD>
                  <TD>
                    <Chip tone={TIPO_MAP[p.tipo]?.tone}>
                      {TIPO_LABEL[p.tipo]}
                    </Chip>
                  </TD>
                  <TD>
                    <span className="text-text font-medium">
                      {p.cliente.nome}
                    </span>
                  </TD>
                  <TD>
                    <span className="text-text-sub">
                      {p.produtoNome || p.modeloBaseNome || (p.noivos ? `${p.noivos} · ${p.nIntegrantes} trajes` : "—")}
                    </span>
                  </TD>
                  <TD className="text-right whitespace-nowrap">
                    <span className="font-mono tabular-nums text-gold-text">
                      R$ {fmt(p.valorEstimado || 0)}
                    </span>
                  </TD>
                  <TD className="text-right whitespace-nowrap">
                    <span className="font-mono tabular-nums text-caption text-text-sub">
                      {dataHora(p.criadoEm)}
                    </span>
                  </TD>
                  <TD className="text-right">
                    <Badge label={p.status} map={PEDIDO_MAP} />
                  </TD>
                </tr>)}
            </tbody>
          </table></TableViewport>}
      </Card>

      {pedidoAberto && <Detalhe pedido={pedidoAberto} onClose={() => setAberto(null)} />}
    </div>;
}
