import { TableViewport } from "../../shared/ui/estrutura/Table.jsx";
import { Detalhe, dataHora } from "../../features/pedidos/PedidoDetalhe.jsx";
import { PEDIDO_MAP, TIPO_MAP } from "../../shared/ui/feedback/status.js";
import { Card, TH, TD, Stat } from "../../shared/ui/estrutura/Surfaces.jsx";
import { Chip, Badge } from "../../shared/ui/feedback/Feedback.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useState } from "react";
import { fmt } from "../../shared/lib/format.js";
import { usePedidos } from "../../features/pedidos/usePedidos.js";
import { TIPO_LABEL } from "../../domain/pedidos.js";
import { ORDER_STATUS } from "../../data/adapters.js";
import { useListaPaginada } from "../../features/listas/useListaPaginada.js";
import Paginacao from "../../shared/ui/estrutura/Paginacao.jsx";
export default function Pedidos() {
  const pedidos = usePedidos();
  const { params, filter, pagination, pending, error, changingPage, changePage } = useListaPaginada("pedidos");
  const filtro = ORDER_STATUS[params.get("status") || "NEW"] || "Todos";
  const [aberto, setAberto] = useState(null);
  const contagem = Object.fromEntries(Object.entries(ORDER_STATUS).map(([key, label]) => [label, pagination?.summary?.[key] || 0]));
  const lista = pedidos;
  const pedidoAberto = aberto ? pedidos.find((p) => p.id === aberto.id) || aberto : null;
  return (
    <div className="apollo-anim-in">
      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3 mb-5">
        <Stat
          label="Novos"
          value={contagem.Novo}
          textClassName="text-blue-fg"
          hint="aguardando triagem"
        />
        <Stat
          label="Em análise"
          value={contagem["Em análise"]}
          textClassName="text-yellow-fg"
        />
        <Stat
          label="Aprovados"
          value={contagem.Aprovado}
          textClassName="text-green-fg"
        />
        <Stat
          label="Recusados"
          value={contagem.Recusado}
          textClassName="text-red-fg"
        />
      </div>

      <Card>
        <div className="flex gap-1.5 mb-4 flex-wrap">
          {["Novo", "Em análise", "Aprovado", "Recusado", "Todos"].map((f) => (
            <button
              key={f}
              onClick={() => { setAberto(null); filter("status", Object.keys(ORDER_STATUS).find(key => ORDER_STATUS[key] === f) || "ALL"); }}
              className={cn(
                "py-1.5 px-3.5 rounded-control cursor-pointer font-sans text-caption",
                filtro === f ? "font-semibold" : "font-medium",
                filtro === f ? "bg-gold" : "bg-transparent",
                filtro === f ? "text-accent-ink" : "text-text-sub",
                filtro === f ? "border-0" : "border border-border",
              )}
            >
              {f}
              {f !== "Todos" && contagem[f] ? ` · ${contagem[f]}` : ""}
            </button>
          ))}
        </div>

        <Paginacao pagination={pagination} pending={pending} error={error} onPage={page => { setAberto(null); changePage(page); }} />
        {!changingPage && (lista.length === 0 ? (
          <p className="text-text-sub text-compact py-7 px-0 text-center">
            Nenhum pedido{" "}
            {filtro !== "Todos" ? `com status "${filtro}"` : "recebido"}.
            Pedidos enviados pelo site aparecem aqui.
          </p>
        ) : (
          <TableViewport>
            <table className="w-full border-collapse text-xs">
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
                {lista.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setAberto(p)}
                    className="cursor-pointer"
                  >
                    <TD>
                      <button type="button" onClick={() => setAberto(p)} aria-label={"Abrir pedido " + p.protocolo} className="font-mono tabular-nums font-semibold text-gold-text underline underline-offset-4">
                        {p.protocolo}
                      </button>
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
                        {p.produtoNome ||
                          p.modeloBaseNome ||
                          (p.noivos
                            ? `${p.noivos} · ${p.nIntegrantes} trajes`
                            : "—")}
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
                  </tr>
                ))}
              </tbody>
            </table>
          </TableViewport>
        ))}
      </Card>

      {pedidoAberto && (
        <Detalhe pedido={pedidoAberto} onUpdated={setAberto} onClose={() => setAberto(null)} />
      )}
    </div>
  );
}
