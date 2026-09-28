import { statusAppearance, colorClass } from "../../shared/ui/palette.js";
import { onImgError } from "../../shared/lib/images.js";
import { cn } from "../../shared/lib/cn.js";
import { ProgressFill } from "../../shared/ui/Progress.jsx";
import { useCatalogo } from '../../data/useData.js';
import { categoriasDoGrupo } from '../../domain/pacotes.js';
// ── Portal do noivo (somente leitura) ────────────────────────────────────────
// Mesma informação do preview "Portal do noivo" dos pacotes padronizados do
// sistema interno (src/pages/erp/Locacoes.jsx → PortalNoivoPreview), adaptada
// à linguagem editorial da vitrine e enriquecida com o detalhamento que existia
// só no protótipo (maker-hub/): barra de progresso de retirada, status de
// pagamento por integrante, filtros, legenda, atributos da padronização e a
// revelação do traje do noivo por senha. Renderiza sem Section/Wrap — é usado
// dentro do <Wrap> da página do casamento (src/pages/site/Casamento.jsx).
import { useState } from 'react';
import { comparecimentoPacote, integranteCompareceu, integrantePago, pagamentosPacote } from '../../domain/rules.js';
import { fmtDate } from '../../shared/lib/format.js';
import { PAGAMENTO_MAP } from "../../shared/ui/status.js";
const hojeISO = () => new Date().toISOString().slice(0, 10);

// agrupa os integrantes por papel, pegando o traje de cada papel (1º integrante)
const FILTROS = [{
  key: 'todos',
  label: 'Todos'
}, {
  key: 'retirados',
  label: 'Retirados'
}, {
  key: 'aguardando',
  label: 'Aguardando'
}, {
  key: 'pagar',
  label: 'A pagar'
}];
function casaFiltro(i, filtro) {
  if (filtro === 'retirados') return integranteCompareceu(i);
  if (filtro === 'aguardando') return !integranteCompareceu(i);
  if (filtro === 'pagar') return !integrantePago(i);
  return true;
}
export default function PortalNoivo({
  pacote
}) {
  const CATALOGO = useCatalogo();
  const integrantes = pacote.integrantes || [];
  const {
    total,
    compareceram,
    faltam
  } = comparecimentoPacote(pacote);
  const {
    pagos,
    aPagar
  } = pagamentosPacote(pacote);
  const atrasado = faltam > 0 && pacote.limiteComparecimento && hojeISO() > pacote.limiteComparecimento;
  const categorias = categoriasDoGrupo(integrantes, CATALOGO);
  const confidencial = !!pacote.trajeConfidencial;

  // Sempre começa oculto: o traje do noivo precisa ser revelado com a senha a
  // cada visita ao portal (não fica lembrado no dispositivo).
  const [revelado, setRevelado] = useState(false);
  const [filtro, setFiltro] = useState('todos');
  const revelarTraje = () => setRevelado(true);
  const noivoOculto = confidencial && !revelado;
  const pctRetirada = total ? Math.round(compareceram / total * 100) : 0;
  const visiveis = integrantes.filter(i => casaFiltro(i, filtro));
  return <div>
      {/* Cabeçalho do pacote */}
      <div className="border border-border bg-card">
        <div className="py-5 px-6">
          <p className="m-0 text-micro tracking-widest uppercase text-gold-text font-mono font-semibold">
            Seu pacote
          </p>
          <p className="mt-2.5 mx-0 mb-0.5 font-display text-title font-medium text-text tracking-tight">
            {pacote.noivos}
          </p>
          <p className="m-0 text-compact text-text-sub">Evento em {fmtDate(pacote.dataEvento)}</p>

          <div className="flex flex-wrap gap-y-1.5 gap-x-4 mt-3">
            <RefItem k="Janela de retirada" v={`${fmtDate(pacote.retirada)} – ${fmtDate(pacote.devolucao)}`} />
            <RefItem k="Pacote fechado em" v={fmtDate(pacote.dataFechamento)} />
            <RefItem k="Contrato" v={pacote.contrato} />
          </div>

          <div className="grid grid-cols-1 tablet:grid-cols-3 gap-2.5 mt-4">
            <Metric v={total} l="participantes" />
            <Metric v={compareceram} l="já retiraram" />
            <Metric v={faltam} l="ainda faltam" />
          </div>
        </div>
      </div>

      {atrasado && <div className="my-4 mx-0 py-3.5 px-4 border border-orange-border bg-orange-bg">
          <p className="m-0 text-compact text-orange-fg leading-normal">
            <b>A data-limite chegou.</b> Ainda falta{faltam > 1 ? 'm' : ''} {faltam} integrante{faltam > 1 ? 's' : ''} comparecer{faltam > 1 ? 'em' : ''} ao ateliê para retirar o traje.
          </p>
        </div>}

      {/* Padronização escolhida */}
      <div className="border border-border bg-card mt-4 py-5 px-6">
        <p className="m-0 text-micro tracking-widest uppercase text-gold-text font-mono font-semibold">
          Roupas do casamento
        </p>
        <p className="mt-2 mx-0 mb-4 font-display text-lg font-medium text-text">
          Padronização escolhida
        </p>
        <div className="grid grid-cols-tiles gap-3.5">
          {categorias.map(c => <CategoriaCard key={c.papel} categoria={c} detalhes={pacote.padronizacao?.[c.papel]} oculto={noivoOculto && String(c.papel).toLowerCase().startsWith('noivo')} />)}
        </div>

        {confidencial && <RevelarTraje revelado={revelado} senha={pacote.senhaRevelacao} onRevelar={revelarTraje} />}
      </div>

      {/* Acompanhamento do grupo */}
      <div className="border border-border bg-card mt-4 py-5 px-6">
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <p className="m-0 text-micro tracking-widest uppercase text-gold-text font-mono font-semibold">
              Acompanhamento
            </p>
            <p className="mt-2 mx-0 mb-0 font-display text-lg font-medium text-text">
              Seu grupo
            </p>
          </div>
          <p className="m-0 text-xs text-text-sub font-mono">
            Limite p/ retirada: {fmtDate(pacote.limiteComparecimento)}
          </p>
        </div>

        {/* barra de progresso da retirada */}
        <div className="mt-4">
          <div className="flex justify-between text-caption tracking-wide uppercase text-text-sub mb-2 font-mono tabular-nums">
            <span>Progresso da retirada</span>
            <b className="text-gold-text font-semibold">{pctRetirada}%</b>
          </div>
          <div className="h-1.5 rounded-full bg-border-soft overflow-hidden">
            <ProgressFill className="h-full bg-gold rounded-full transition-all duration-200 motion-reduce:transition-none" value={`${pctRetirada}%`} />
          </div>
          <p className="mt-2 mx-0 mb-0 text-caption text-text-muted font-mono tabular-nums">
            {pagos} de {total} com pagamento quitado{aPagar > 0 ? ` · ${aPagar} a acertar` : ''}
          </p>
        </div>

        {/* filtros */}
        <div className="flex gap-2 flex-wrap mt-4 mx-0 mb-1">
          {FILTROS.map(f => {
          const on = filtro === f.key;
          return <button key={f.key} onClick={() => setFiltro(f.key)} className={cn("py-1.5 px-3 rounded-full cursor-pointer font-sans text-xs", on ? "font-semibold" : "font-medium", on ? "bg-gold-dim" : "bg-transparent", on ? "text-gold-strong" : "text-text-sub", cn("border", on ? "border-gold" : "border-border"))}>
                {f.label}
              </button>;
        })}
        </div>

        <div className="mt-2">
          {visiveis.length === 0 && <p className="text-xs text-text-muted py-3.5 px-0">Nenhum integrante neste filtro.</p>}
          {visiveis.map((i, idx) => {
          const compareceu = integranteCompareceu(i);
          const selo = compareceu ? `Contrato ${i.numeroContrato}` : i.nome.split(' ')[0].toUpperCase();
          const pag = statusAppearance(PAGAMENTO_MAP, i.pagamento) || statusAppearance(PAGAMENTO_MAP, 'Pendente');
          return <div key={idx} className={cn("flex justify-between items-center gap-3 py-3 px-0", idx < visiveis.length - 1 ? "border-b border-b-border-soft" : "border-b-0")}>
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className={cn("shrink-0 min-w-24 text-center py-1.5 px-2.5 rounded-control text-micro font-bold font-mono tabular-nums", compareceu ? "bg-gold" : "bg-transparent", compareceu ? "text-accent-ink" : "text-text-muted", compareceu ? "border border-gold" : "border border-dashed border-border")}>
                    {compareceu ? selo : 'Aguardando'}
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 text-compact font-semibold text-text">{i.nome}</p>
                    <p className="mt-0.5 mx-0 mb-0 text-caption text-text-sub">{i.papel}</p>
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end gap-1.5">
                  <span className={cn("py-1 px-2.5 rounded-control text-micro font-semibold font-mono tabular-nums", compareceu ? "bg-green-bg" : "bg-orange-bg", compareceu ? "text-green-fg" : "text-orange-fg", cn("border", compareceu ? "border-green-border" : "border-orange-border"))}>
                    {compareceu ? 'Retirou' : 'Ainda precisa ir'}
                  </span>
                  <span className={cn("text-caption font-semibold font-mono tabular-nums", colorClass(pag.color, "text"))}>
                    {i.pagamento === 'Pago' ? '● Pago' : i.pagamento === 'Incluso no pacote' ? '● Incluso no pacote' : i.pagamento === 'Parcial' ? '● Pagamento parcial' : '● Pagamento em aberto'}
                  </span>
                </div>
              </div>;
        })}
        </div>

        {/* legenda */}
        <div className="flex gap-5 flex-wrap mt-4 pt-4 border-t border-t-border-soft text-caption text-text-muted">
          <Legenda cor="var(--status-green-fg)" texto="Traje já retirado" />
          <Legenda cor="var(--status-orange-fg)" texto="Pago, aguardando retirada" />
          <Legenda cor="var(--status-red-fg)" texto="Pagamento em aberto" />
        </div>
      </div>

      <p className="text-center text-caption text-text-muted mt-5 mx-0 mb-0">
        Este portal mostra somente o pacote de {pacote.noivos}. Alterações devem ser solicitadas ao ateliê.
      </p>
    </div>;
}
function RefItem({
  k,
  v
}) {
  return <span className="text-caption text-text-sub">
      <span className="text-text-muted uppercase tracking-wide text-micro font-mono tabular-nums">{k}: </span>
      <b className="text-text font-medium">{v}</b>
    </span>;
}
function Legenda({
  cor,
  texto
}) {
  return <span className="inline-flex items-center gap-1.5">
      <span className={cn("w-2 h-2 rounded-full", colorClass(cor, "bg"))} />
      {texto}
    </span>;
}
function Metric({
  v,
  l
}) {
  return <div className="bg-bg-elevated border border-border py-3.5 px-4">
      <p className="m-0 text-2xl font-semibold text-gold-text font-mono tabular-nums">{v}</p>
      <p className="mt-0.5 mx-0 mb-0 text-caption text-text-sub">{l}</p>
    </div>;
}
function CategoriaCard({
  categoria: c,
  detalhes,
  oculto
}) {
  return <div className={cn("overflow-hidden", cn("border", oculto ? "border-gold-dim" : "border-border"))}>
      <div className="aspect-landscape overflow-hidden bg-bg-elevated flex items-center justify-center">
        {oculto || !c.produto?.foto ? <span className="text-2xl text-gold-text">✦</span> : <img src={c.produto.foto} alt={c.produto.nome} loading="lazy" onError={onImgError} className="w-full h-full object-cover block" />}
      </div>
      <div className="py-2.5 px-3">
        <p className="m-0 text-micro font-bold tracking-wide text-gold-text font-mono">
          {String(c.papel).toUpperCase()}
        </p>
        <p className="mt-1 mx-0 mb-0.5 font-display text-sm font-medium text-text">
          {oculto ? 'Surpresa do noivo' : c.produto?.nome || 'Modelo a definir'}
        </p>
        <p className="m-0 text-micro text-text-sub">
          {oculto ? 'Mantido confidencial' : [c.produto?.tecido, c.produto?.cor].filter(Boolean).join(' · ') || [c.produto?.linha, c.produto?.colecao].filter(Boolean).join(' · ')}
        </p>

        {!oculto && detalhes && <div className="mt-2.5 mx-0 mb-0 pt-2 border-t border-t-border-soft text-micro text-text-muted leading-relaxed">
            {[detalhes.corte, detalhes.colete, detalhes.gravata, detalhes.lenco].filter(Boolean).join(' · ')}
            {detalhes.nota && <p className="mt-1.5 mx-0 mb-0 text-text-sub italic">{detalhes.nota}</p>}
          </div>}
        {oculto && <p className="mt-2.5 mx-0 mb-0 text-micro text-text-muted font-mono">🔒 revele com a senha abaixo</p>}
      </div>
    </div>;
}
function RevelarTraje({
  revelado,
  senha,
  onRevelar
}) {
  const [aberto, setAberto] = useState(false);
  const [valor, setValor] = useState('');
  const [erro, setErro] = useState(false);
  if (revelado) {
    return <p className="mt-4 mx-0 mb-0 text-xs text-green-fg font-mono">
        ✓ Traje do noivo revelado nesta visita — some ao sair do portal.
      </p>;
  }
  const enviar = e => {
    e.preventDefault();
    const ok = String(valor).trim().toLowerCase() === String(senha || '').trim().toLowerCase();
    if (ok) {
      onRevelar();
      return;
    }
    setErro(true);
  };
  return <div className="mt-4 mx-0 mb-0 py-3.5 px-4 border border-dashed border-gold-dim bg-bg-elevated">
      {!aberto ? <button onClick={() => setAberto(true)} className="bg-transparent border-0 cursor-pointer p-0 font-mono text-xs font-semibold tracking-wide text-gold-text">
          🔒 Revelar o traje do noivo
        </button> : <form onSubmit={enviar} className="flex gap-2 flex-wrap items-center">
          <span className="text-caption text-text-sub w-full">
            Só o casal tem a senha — combinada com o ateliê no fechamento do pacote.
          </span>
          <input type="password" value={valor} onChange={e => {
        setValor(e.target.value);
        setErro(false);
      }} placeholder="Senha do casal" autoComplete="off" className={cn("flex-1 basis-44 py-2.5 px-3 bg-input-bg rounded-control text-text text-compact font-sans outline-none", cn("border", erro ? "border-red-border" : "border-border"))} />
          <button type="submit" className="py-2.5 px-4 rounded-control cursor-pointer border border-gold bg-gold text-accent-ink font-sans text-xs font-semibold tracking-wide uppercase">
            Revelar
          </button>
          {erro && <span className="w-full text-caption text-red-fg">Senha incorreta. Confira com o ateliê.</span>}
        </form>}
    </div>;
}
