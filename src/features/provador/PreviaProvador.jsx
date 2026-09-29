import { Link } from "react-router-dom";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { onImgError } from "../../shared/lib/images.js";
export default function PreviaProvador({ photo, modelo, onBack }) {
  return (
    <section className="fitting-preview" aria-labelledby="preview-title">
      <div className="fitting-preview-intro">
        <h2 id="preview-title" tabIndex={-1}>
          Sua escolha, lado a lado.
        </h2>
        <p>
          Esta é uma prévia de demonstração. A prova com IA ainda não está
          disponível; sua foto não foi enviada e o terno não foi aplicado à
          imagem.
        </p>
      </div>
      <div className="fitting-preview-pair">
        <figure>
          <img src={photo.url} alt="Sua foto para a prova" />
          <figcaption>Sua foto</figcaption>
        </figure>
        <figure>
          <img src={modelo.foto} alt={modelo.nome} onError={onImgError} />
          <figcaption>
            {modelo.nome}
            <span>
              {modelo.cor} · {modelo.tecido}
            </span>
          </figcaption>
        </figure>
      </div>
      <div className="fitting-preview-actions">
        <Button variant="ghost" onClick={onBack}>
          Voltar ao provador
        </Button>
        <Link className="fitting-text-link" to={"/colecao/" + modelo.id}>
          Conhecer este traje
        </Link>
      </div>
    </section>
  );
}
