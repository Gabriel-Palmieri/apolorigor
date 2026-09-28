import { onImgError } from '../../shared/lib/images.js';
import { money } from './siteData.js';

export default function ProdutoCard({ produto, onOpen }) {
  return <button onClick={() => onOpen(produto)} className="product-card">
    <div className="aspect-portrait overflow-hidden bg-bg-elevated mb-4">
      <img src={produto.foto} alt={produto.nome} loading="lazy" onError={onImgError} className="w-full h-full object-cover block" />
    </div>
    <p className="m-0 font-display text-lg desktop:text-2xl font-medium text-text leading-tight">{produto.nome}</p>
    <p className="mt-2 mb-0 text-xs desktop:text-sm text-text-sub">{produto.cor} / {produto.tecido}</p>
    <div className="mt-3 grid gap-1 text-xs desktop:text-sm text-text-sub tabular-nums">
      <span>Aluguel <span className="text-text font-medium">{money(produto.aluguel)}</span></span>
      <span>Compra <span className="text-text">{money(produto.venda)}</span></span>
    </div>
  </button>;
}
