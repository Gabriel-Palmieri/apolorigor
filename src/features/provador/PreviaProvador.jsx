import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { onImgError } from "../../shared/lib/images.js";
import { gerarProvaVirtual } from "../../data/provador.js";
export default function PreviaProvador({ photo, modelo, onBack }) {
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  async function generate() {
    setBusy(true);
    setError("");
    try {
      const response = await gerarProvaVirtual(photo.blob, modelo);
      setResult(response.imageUrl);
    } catch (cause) {
      setError(cause.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="fitting-preview" aria-labelledby="preview-title">
      <div className="fitting-preview-intro">
        <h2 id="preview-title" tabIndex={-1}>
          Sua escolha, lado a lado.
        </h2>
        <p>{result ? "Imagem ilustrativa gerada por IA. O resultado pode não representar caimento, tamanho ou aparência exatos." : "Confira as imagens e, se quiser, gere uma composição ilustrativa do traje em você."}</p>
      </div>
      <div className="fitting-preview-pair">
        <figure>
          <img src={photo.url} alt="Sua foto para a prova" />
          <figcaption>Sua foto</figcaption>
        </figure>
        <figure>
          <img src={result || modelo.foto} alt={result ? `Visualização gerada com ${modelo.nome}` : modelo.nome} onError={onImgError} />
          <figcaption>
            {result ? "Prévia gerada por IA" : modelo.nome}
            <span>
              {modelo.cor} · {modelo.tecido}
            </span>
          </figcaption>
        </figure>
      </div>
      {!result && <div className="mt-6 max-w-measure">
        <label className="flex items-start gap-3 text-sm leading-relaxed text-text-sub">
          <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>Concordo em enviar minha foto e a imagem do traje à Fal.ai para gerar esta prévia. Os arquivos passam pelo armazenamento temporário do provedor e não são salvos pelo app. A geração pode gerar cobrança.</span>
        </label>
        {error && <p role="alert" className="fitting-error">{error}</p>}
        <Button className="mt-4" onClick={generate} disabled={!consent || busy}>
          {busy ? "Gerando prévia…" : "Gerar prévia com IA"}
        </Button>
      </div>}
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
