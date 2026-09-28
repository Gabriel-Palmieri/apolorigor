import { cn } from "../../shared/lib/cn.js";
import { TIPO_LABEL } from './store.js';
import { fmt } from '../../shared/lib/format.js';
const PASSOS_STATUS = [{
  key: 'Novo',
  label: 'Recebido',
  d: 'Pedido na fila de triagem do ateliê.'
}, {
  key: 'Em análise',
  label: 'Em análise',
  d: 'Conferindo disponibilidade, tamanhos e datas.'
}, {
  key: 'Aprovado',
  label: 'Confirmado',
  d: 'Reservado. A equipe entra em contato para a prova.'
}];
const dataHora = ms => new Date(ms).toLocaleString('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit'
});

// Painel de rastreio de um pedido avulso — o mesmo stepper que ficava na antiga
// tela "Acompanhar pedido", agora usado direto na área do cliente (ao clicar num
// pedido) e na confirmação de envio. Sem busca por protocolo: recebe o pedido.
export default function RastreioPedido({
  pedido,
  onVoltar
}) {
  if (!pedido) return null;
  const recusado = pedido.status === 'Recusado';
  const etapaAtual = PASSOS_STATUS.findIndex(s => s.key === pedido.status);
  return <div>
      {onVoltar && <button onClick={onVoltar} className="bg-transparent border-0 cursor-pointer py-1 px-0 mb-4 font-mono text-caption font-semibold tracking-widest uppercase text-text-sub">
          ← Voltar aos pedidos
        </button>}

      <div className="border border-border bg-card py-5 px-5 mb-6">
        <div className="flex justify-between gap-4 flex-wrap">
          <div>
            <p className="m-0 font-mono text-lg font-semibold text-gold-text tracking-wide">{pedido.protocolo}</p>
            <p className="mt-1.5 mx-0 mb-0 text-compact text-text">
              {TIPO_LABEL[pedido.tipo]}
              {pedido.produtoNome ? ` · ${pedido.produtoNome}${pedido.tam ? ` · tam. ${pedido.tam}` : ''}` : ''}
              {pedido.noivos ? ` · ${pedido.noivos}${pedido.nIntegrantes ? ` · ${pedido.nIntegrantes} integrantes` : ''}` : ''}
            </p>
            <p className="mt-1 mx-0 mb-0 text-xs text-text-sub">Enviado em {dataHora(pedido.criadoEm)} · {pedido.cliente.nome}</p>
          </div>
          {pedido.valorEstimado > 0 && <div className="text-right">
              <p className="m-0 text-micro tracking-widest uppercase text-text-sub font-mono">Estimado</p>
              <p className="mt-1 mx-0 mb-0 font-mono text-base font-semibold text-text">R$ {fmt(pedido.valorEstimado)}</p>
            </div>}
        </div>
      </div>

      {recusado ? <div className="border border-red-border bg-red-bg py-4 px-4">
          <p className="m-0 font-semibold text-compact text-red-fg">Pedido não confirmado</p>
          <p className="mt-1.5 mx-0 mb-0 text-compact text-red-fg">
            {pedido.motivoRecusa || 'O ateliê entrará em contato para propor uma alternativa.'}
          </p>
        </div> : <ol className="list-none m-0 p-0">
          {PASSOS_STATUS.map((s, i) => {
        const done = i <= etapaAtual;
        const atual = i === etapaAtual;
        return <li key={s.key} className={cn("flex gap-3.5", i < PASSOS_STATUS.length - 1 ? "pb-4" : "pb-0")}>
                <div className="flex flex-col items-center">
                  <span className={cn("w-3.5 h-3.5 rounded-full shrink-0 mt-0.5", done ? "bg-gold" : "bg-transparent", cn("border-2", done ? "border-gold" : "border-border"))} />
                  {i < PASSOS_STATUS.length - 1 && <span className={cn("w-0.5 flex-1 min-h-5 mt-1", i < etapaAtual ? "bg-gold" : "bg-border")} />}
                </div>
                <div className="pb-1">
                  <p className={cn("m-0 text-sm", atual ? "font-bold" : "font-semibold", done ? "text-text" : "text-text-muted")}>{s.label}</p>
                  <p className={cn("mt-0.5 mx-0 mb-0 text-xs", done ? "text-text-sub" : "text-text-muted")}>{s.d}</p>
                </div>
              </li>;
      })}
        </ol>}

      <details className="mt-6">
        <summary className="cursor-pointer text-xs tracking-widest uppercase text-text-sub font-mono">
          Histórico
        </summary>
        <ul className="mt-3 mx-0 mb-0 p-0 list-none">
          {[...pedido.historico].reverse().map((h, i) => <li key={i} className="flex gap-3 text-xs text-text-sub py-1.5 px-0 border-b border-b-border-soft">
              <span className="font-mono text-text-muted whitespace-nowrap">{dataHora(h.em)}</span>
              <span><b className="text-text">{h.status}</b>{h.nota ? ` — ${h.nota}` : ''}</span>
            </li>)}
        </ul>
      </details>
    </div>;
}
