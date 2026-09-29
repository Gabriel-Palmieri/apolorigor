import { money } from "../../shared/lib/format.js";
import { PLACEHOLDER, onImgError } from "../../shared/lib/images.js";
export default function EstoqueItens({ produtos, onEditar }) {
  if (!produtos.length)
    return (
      <p className="text-text-sub py-6" role="status">
        Nenhum modelo encontrado.
      </p>
    );
  return (
    <div>
      {produtos.map((produto) => (
        <button
          key={produto.id}
          onClick={() => onEditar(produto)}
          className="w-full flex gap-4 text-left py-5 border-b border-border bg-transparent font-sans hover:bg-bg-elevated"
        >
          <img
            src={produto.foto || PLACEHOLDER}
            onError={onImgError}
            alt=""
            className="w-16 h-20 object-cover bg-card shrink-0"
          />
          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-4 flex-wrap">
              <h3 className="m-0 text-base font-medium text-text">
                {produto.nome}
              </h3>
              <span className="text-sm text-gold-text">
                {produto.ativo ? "Ativo" : "Inativo"}
              </span>
            </div>
            <p className="my-2 text-sm text-text-sub">
              {produto.categoria} · {produto.cor} ·{" "}
              {produto.variantes.reduce(
                (sum, variante) => sum + variante.qtd,
                0,
              )}{" "}
              peças cadastradas
            </p>
            <p className="m-0 text-sm text-text-sub">
              Aluguel {money(produto.aluguel)} · Venda {money(produto.venda)}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
