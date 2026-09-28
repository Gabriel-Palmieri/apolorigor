import { TableViewport } from "../../shared/ui/Table.jsx";
import { Card, TH, TD } from "../../shared/ui/Surfaces.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Badge, Chip } from "../../shared/ui/Feedback.jsx";
import { fmt, fmtDate } from '../../shared/lib/format.js';
import { CONTRATO_MAP } from "../../shared/ui/status.js";
function TipoBadge({
  tipo
}) {
  const map = {
    venda: {
      label: 'Venda',
      color: 'var(--status-green-fg)'
    },
    locacao_avulsa: {
      label: 'Locação Avulsa',
      color: 'var(--status-orange-fg)'
    },
    locacao_padronizada: {
      label: 'Locação Padronizada',
      color: 'var(--status-blue-fg)'
    }
  };
  const m = map[tipo];
  return <Chip color={m.color}>{m.label}</Chip>;
}

// ── Aba: Histórico ───────────────────────────────────────────
export default function Historico({
  produtos,
  trans,
  onAvancarContrato
}) {
  const fat = trans.reduce((s, t) => s + t.valor, 0);
  return <div>
      <Card accent className="mb-4 flex justify-between items-center gap-4 flex-wrap">
        <p className="m-0 text-text-sub text-micro font-semibold tracking-widest font-mono tabular-nums uppercase">Faturamento total · vendas + locações</p>
        <p className="m-0 text-gold-text text-3xl font-medium font-mono tabular-nums leading-none">R$ {fmt(fat)}</p>
      </Card>
      <Card className="py-3.5 px-5 overflow-auto">
        {trans.length === 0 ? <p className="text-text-sub text-compact m-0">Nenhuma transação registrada.</p> : <TableViewport><table className="w-full border-collapse text-compact">
            <thead>
              <tr>
                <TH>Cliente / Evento</TH><TH>Tipo</TH><TH>Item(ns)</TH><TH>Retirada</TH><TH>Devolução</TH><TH>Valor</TH><TH>Contrato</TH><TH></TH>
              </tr>
            </thead>
            <tbody>
              {[...trans].reverse().map(t => {
              const itens = t.tipo === 'locacao_padronizada' ? (t.integrantes || []).map(i => produtos.find(p => p.id === i.produtoId)?.nome).filter(Boolean).join(', ') : produtos.find(p => p.id === t.produtoId)?.nome || '—';
              const precisaContrato = t.tipo !== 'venda';
              return <tr key={t.id}>
                    <TD>
                      <span className="text-text font-medium">{t.cliente}</span>
                      {t.tipo === 'locacao_padronizada' && <p className="mt-0.5 mx-0 mb-0 text-caption text-text-sub">{t.noivos} · evento {fmtDate(t.dataEvento)}</p>}
                    </TD>
                    <TD><TipoBadge tipo={t.tipo} /></TD>
                    <TD><span className="text-text-sub text-xs">{itens}</span></TD>
                    <TD className="whitespace-nowrap"><span className="text-text-sub text-caption font-mono tabular-nums">{fmtDate(t.retirada)}</span></TD>
                    <TD className="whitespace-nowrap"><span className="text-text-sub text-caption font-mono tabular-nums">{fmtDate(t.devolucao)}</span></TD>
                    <TD className="whitespace-nowrap"><span className="text-gold-text font-medium font-mono tabular-nums">R$ {fmt(t.valor)}</span></TD>
                    <TD>{precisaContrato ? <Badge label={t.contrato} map={CONTRATO_MAP} /> : <span className="text-text-sub text-caption">—</span>}</TD>
                    <TD>
                      {precisaContrato && t.contrato !== 'Confirmado' && <Button color="var(--status-blue-fg)" onClick={() => onAvancarContrato(t.id)} size="compact" variant="ghost">
                          {t.contrato === 'Rascunho' ? 'Loja assina' : 'Simular assinatura do cliente'}
                        </Button>}
                    </TD>
                  </tr>;
            })}
            </tbody>
          </table></TableViewport>}
      </Card>
    </div>;
}
