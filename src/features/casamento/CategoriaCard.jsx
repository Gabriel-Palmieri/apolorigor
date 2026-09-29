import { onImgError } from "../../shared/lib/images.js";
export default function CategoriaCard({ produto }) {
  return (
    <div className="casamento-modelo">
      {produto?.foto && (
        <img
          src={produto.foto}
          alt={produto.nome}
          onError={onImgError}
          className="casamento-modelo-foto"
        />
      )}
      <div>
        <h3 className="m-0 text-lg font-medium text-text">
          {produto?.nome || "Modelo a definir"}
        </h3>
        <p className="mt-2 mb-0 text-sm text-text-sub">
          {produto
            ? [produto.cor, produto.tecido].filter(Boolean).join(" · ")
            : "Escolha uma referência na coleção ao planejar o grupo."}
        </p>
        <p className="mt-3 mb-0 text-xs text-text-sub">
          Referência visual. Nenhuma peça foi reservada.
        </p>
      </div>
    </div>
  );
}
