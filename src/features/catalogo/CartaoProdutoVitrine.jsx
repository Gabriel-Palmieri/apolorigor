import { onImgError } from "../../shared/lib/images.js";
import { money } from "../../shared/lib/format.js";
import { ArrowIcon } from "../../shared/ui/icones/ArrowIcon.jsx";

export default function CartaoProdutoVitrine({ produto, onOpen }) {
  return (
    <button onClick={() => onOpen(produto)} className="product-card">
      <div className="product-card-photo">
        <img
          src={produto.foto}
          alt={produto.nome}
          loading="lazy"
          onError={onImgError}
          className="w-full h-full object-cover block"
        />
        <span className="product-card-action" aria-hidden="true">
          <ArrowIcon />
        </span>
      </div>
      <p className="product-card-name">{produto.nome}</p>
      <p className="product-card-detail">
        {produto.cor} / {produto.tecido}
      </p>
      <div className="product-card-prices">
        <span>
          Aluguel <strong>{money(produto.aluguel)}</strong>
        </span>
        <span>
          Compra <span>{money(produto.venda)}</span>
        </span>
      </div>
    </button>
  );
}
