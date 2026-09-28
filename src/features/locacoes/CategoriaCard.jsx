import { Heading } from "../../shared/ui/Typography.jsx";
import { fmt } from '../../shared/lib/format.js';
function CategoriaCard({
  papel,
  produto,
  preco,
  confidencial
}) {
  const isNoivo = papel.toLowerCase().startsWith('noivo');
  if (confidencial && isNoivo) {
    return <div className="bg-card border border-gold-dim rounded-card overflow-hidden">
        <div className="h-32 flex items-center justify-center text-3xl text-gold-text bg-bg-elevated">✦</div>
        <div className="py-3 px-3.5">
          <p className="text-micro text-gold-text font-bold tracking-wide mt-0 mx-0 mb-1">{papel.toUpperCase()}</p>
          <Heading size={14}>Surpresa Do Noivo</Heading>
          <p className="text-micro text-text-sub mt-1 mx-0 mb-0">Os detalhes foram mantidos confidenciais.</p>
        </div>
      </div>;
  }
  return <div className="bg-card border border-border rounded-card overflow-hidden">
      <div className="h-32 overflow-hidden">
        <img src={produto?.foto} alt={produto?.nome} className="w-full h-full object-cover block" />
      </div>
      <div className="py-3 px-3.5">
        <p className="text-micro text-gold-text font-bold tracking-wide mt-0 mx-0 mb-1">{papel.toUpperCase()}</p>
        <Heading size={14} className="mb-0.5">{produto?.nome || '—'}</Heading>
        <p className="text-micro text-text-sub mt-0 mx-0 mb-1.5">{produto?.linha}{produto?.colecao ? ` · ${produto.colecao}` : ''}</p>
        <p className="text-micro text-text-sub mt-0 mx-0 mb-2">{produto?.tecido} · Cor {produto?.cor}</p>
        <p className="text-compact font-bold text-gold-text m-0">R$ {fmt(preco)}</p>
      </div>
    </div>;
}

// ── Linha de participante (Contratos individuais) ────────────────────
export { CategoriaCard };
