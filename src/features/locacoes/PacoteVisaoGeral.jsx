import { Card, Stat } from "../../shared/ui/Surfaces.jsx";
import { Heading } from "../../shared/ui/Typography.jsx";
import { Input } from "../../shared/ui/Form.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { cn } from "../../shared/lib/cn.js";
import { C } from "../../shared/ui/palette.js";
const MESES_ABR = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
import { fmtDate } from '../../shared/lib/format.js';
import { comparecimentoPacote, statusPacote } from '../../domain/rules.js';
function fmtDataCurta(d) {
  if (!d) return '';
  const dt = new Date(d + 'T12:00:00');
  return `${String(dt.getDate()).padStart(2, '0')} ${MESES_ABR[dt.getMonth()]}.`;
}
export function packageNavClasses(active) {
  return cn("flex items-center gap-2 w-full text-left py-2 px-3 rounded-card cursor-pointer mb-1 text-xs font-sans", active ? "bg-gold-dim" : "bg-transparent", active ? "border border-gold" : "border border-transparent", active ? "text-gold-text" : "text-text-sub", active ? "font-bold" : "font-medium");
}

// ── "Agenda da Oficina e Estoque" — Saídas por data ──────────────────
function saidasPorData(pacotes, produtos) {
  const porData = {};
  pacotes.forEach(t => {
    if (!t.dataEvento) return;
    if (!porData[t.dataEvento]) porData[t.dataEvento] = {
      casamentos: new Set(),
      itens: {}
    };
    const d = porData[t.dataEvento];
    d.casamentos.add(t.id);
    (t.integrantes || []).forEach(i => {
      const produto = produtos.find(p => p.id === i.produtoId);
      const key = `${produto?.nome || '—'}|${i.papel}`;
      if (!d.itens[key]) d.itens[key] = {
        nome: produto?.nome || '—',
        papel: i.papel,
        count: 0
      };
      d.itens[key].count += 1;
    });
  });
  const hoje = new Date().toISOString().slice(0, 10);
  return Object.entries(porData).map(([data, v]) => ({
    data,
    casamentos: v.casamentos.size,
    total: Object.values(v.itens).reduce((s, x) => s + x.count, 0),
    itens: Object.values(v.itens).sort((a, b) => b.count - a.count)
  })).filter(d => d.data >= hoje).sort((a, b) => a.data.localeCompare(b.data)).slice(0, 4);
}
function SaidasPorData({
  pacotes,
  produtos
}) {
  const saidas = saidasPorData(pacotes, produtos);
  if (saidas.length === 0) return null;
  return <Card className="border-gold-dim mb-4">
      <p className="m-0 text-micro font-bold tracking-widest text-gold-text">AGENDA DA OFICINA E ESTOQUE</p>
      <Heading size={19} className="mt-1.5 mx-0 mb-1">Saídas por data</Heading>
      <p className="mt-0 mx-0 mb-4 text-caption text-text-sub">Veja primeiro o volume do dia e, abaixo, exatamente quais roupas serão necessárias.</p>
      <div className="flex flex-col gap-2.5">
        {saidas.map(s => <div key={s.data} className="bg-bg-elevated border border-border rounded-card py-3.5 px-4 flex gap-5 items-start flex-wrap">
            <div className="min-w-20">
              <p className="m-0 text-base font-bold text-gold-text">{fmtDataCurta(s.data)}</p>
              <p className="mt-0.5 mx-0 mb-0 text-micro text-text-sub">{s.casamentos} casamento(s)</p>
            </div>
            <div className="min-w-14 text-center">
              <p className="m-0 text-2xl font-bold text-text">{s.total}</p>
              <p className="m-0 text-micro text-text-sub">roupas</p>
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              {s.itens.map((it, i2) => <div key={i2} className="bg-card border border-border rounded-card py-2 px-3 min-w-36">
                  <span className="text-compact font-bold text-text">{it.count} </span>
                  <span className="text-xs font-semibold text-text">{it.nome}</span>
                  <p className="mt-0.5 mx-0 mb-0 text-micro text-text-sub">{it.papel}</p>
                </div>)}
            </div>
          </div>)}
      </div>
    </Card>;
}

// ── Linha de pacote na lista "Todos os pacotes" ──────────────────────
function PacoteRow({
  t,
  onAbrir
}) {
  const status = statusPacote(t);
  const {
    total,
    compareceram
  } = comparecimentoPacote(t);
  const pillClasses = status.nivel === 'atraso' ? 'border border-red-border bg-red-bg text-red-fg' : status.nivel === 'completo' ? 'border border-green-border bg-green-bg text-green-fg' : 'border border-orange-border bg-orange-bg text-orange-fg';
  const metas = [{
    label: 'FECHAMENTO',
    val: fmtDate(t.dataFechamento)
  }, {
    label: 'LIMITE DOS PADRINHOS',
    val: fmtDate(t.limiteComparecimento)
  }, {
    label: 'COMPARECIMENTO',
    val: `${compareceram}/${total}`
  }];
  return <div onClick={() => onAbrir(t.id)} className="grid grid-cols-1 wide:grid-cols-participant-row items-center gap-4 py-4 px-1.5 border-b border-b-border cursor-pointer">
      <div className="w-9 h-9 rounded-card bg-gold-dim border border-gold flex items-center justify-center text-caption font-bold text-gold-text">AR</div>
      <div className="min-w-0">
        <p className="m-0 font-semibold text-sm text-text whitespace-nowrap overflow-hidden text-ellipsis">{t.noivos}</p>
        <p className="mt-0.5 mx-0 mb-0 text-caption text-text-sub whitespace-nowrap overflow-hidden text-ellipsis">Apollo Rigor · Evento {fmtDate(t.dataEvento)}</p>
      </div>
      {metas.map(m => <div key={m.label} className="min-w-0">
          <p className="m-0 text-micro leading-relaxed text-text-sub tracking-wide whitespace-nowrap">{m.label}</p>
          <p className="mt-0.5 mx-0 mb-0 text-xs leading-relaxed text-text font-semibold">{m.val}</p>
        </div>)}
      <span className={cn("justify-self-start py-1 px-2.5 rounded-control text-micro font-semibold leading-tight font-mono tabular-nums", pillClasses)}>{status.texto}</span>
      <span className="text-text-sub text-base justify-self-end">→</span>
    </div>;
}

// ── "⌂ Visão geral" ────────────────────────────────────────────────
export default function VisaoGeral({
  pacotes,
  produtos,
  busca,
  setBusca,
  onAbrirPacote,
  onNovoPacote
}) {
  const totalParticipantes = pacotes.reduce((s, t) => s + (t.integrantes || []).length, 0);
  const buscaLower = busca.trim().toLowerCase();
  const filtrados = pacotes.filter(t => {
    if (!buscaLower) return true;
    const alvo = [t.noivos, t.cliente, ...(t.integrantes || []).map(i => i.nome)].join(' ').toLowerCase();
    return alvo.includes(buscaLower);
  });
  return <div>
      <p className="m-0 text-micro text-text-sub tracking-widest font-bold">OPERAÇÃO REAL</p>
      <div className="flex justify-between items-start mt-1.5 mx-0 mb-4 flex-wrap gap-3">
        <div>
          <Heading size={26}>Pacotes da Apollo Rigor</Heading>
          <p className="mt-1.5 mx-0 mb-0 text-xs text-text-sub">Cadastre e acompanhe os pacotes, prazos, contratos e comparecimentos.</p>
        </div>
        <div className="flex gap-2">
          <Button size="compact" variant="ghost">Padronizações</Button>
          <Button onClick={onNovoPacote} size="compact">+ Cadastrar pacote</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3.5 mb-4">
        <Stat label="Pacotes cadastrados" value={pacotes.length} color={C.gold} />
        <Stat label="Participantes" value={totalParticipantes} color={C.text} />
      </div>

      <Input label="⌕  Buscar casal, participante, contrato ou traje" value={busca} onChange={e => setBusca(e.target.value)} placeholder="" />

      <SaidasPorData pacotes={pacotes} produtos={produtos} />

      {filtrados.length === 0 ? <Card><p className="text-text-sub text-compact m-0">Nenhum pacote padronizado encontrado.</p></Card> : <Card>
          {[...filtrados].reverse().map(t => <PacoteRow key={t.id} t={t} onAbrir={onAbrirPacote} />)}
        </Card>}
    </div>;
}

// ── Card de categoria/papel (Padronização do grupo) ──────────────────
