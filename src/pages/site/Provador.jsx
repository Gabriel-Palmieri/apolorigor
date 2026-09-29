import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useCatalogo } from "../../data/useData.js";
import { ternosParaProva } from "../../domain/provador.js";
import { Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { Display } from "../../shared/ui/estrutura/Typography.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import CapturaFoto from "../../features/provador/CapturaFoto.jsx";
import SeletorTraje from "../../features/provador/SeletorTraje.jsx";
import PreviaProvador from "../../features/provador/PreviaProvador.jsx";
import { useFotoProvador } from "../../features/provador/useFotoProvador.js";
export default function Provador() {
  const modelos = ternosParaProva(useCatalogo());
  const [params, setParams] = useSearchParams();
  const requested = params.get("modelo");
  const selected = requested
    ? modelos.find((modelo) => String(modelo.id) === requested)
    : modelos[0];
  const capture = useFotoProvador();
  const [preview, setPreview] = useState(null);
  const previewRef = useRef(null);
  const { closeCamera } = capture;
  useEffect(() => {
    if (modelos.length === 0) closeCamera();
  }, [modelos.length, closeCamera]);
  useEffect(() => {
    if (preview) previewRef.current?.querySelector("h2")?.focus();
  }, [preview]);
  const select = (modelo) =>
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set("modelo", String(modelo.id));
      return next;
    });
  const showPreview = () => {
    if (!capture.photo || !selected) return;
    capture.closeCamera();
    setPreview({ photo: capture.photo, modelo: selected });
  };
  return (
    <Wrap>
      <div className="fitting-page">
        <header className="fitting-header">
          <div>
            <Display>
              O seu próximo traje.
              <br />
              Na sua perspectiva.
            </Display>
            <p>
              Escolha um terno da coleção e prepare sua foto para a prova
              virtual.
            </p>
          </div>
          <Link to="/colecao" className="fitting-text-link">
            Ver a coleção
          </Link>
        </header>
        <p className="fitting-demo-note">
          Provador em demonstração: a aplicação do terno com IA ainda não está
          disponível.
        </p>
        {modelos.length === 0 ? (
          <div className="fitting-empty">
            <h2>A coleção está sendo preparada.</h2>
            <p>
              Não há ternos disponíveis para a prova agora. Volte à coleção para
              conhecer os outros modelos.
            </p>
            <Link to="/colecao" className="fitting-text-link">
              Ir para a coleção
            </Link>
          </div>
        ) : preview ? (
          <div ref={previewRef}>
            <PreviaProvador
              {...preview}
              onBack={() => {
                setPreview(null);
                requestAnimationFrame(() =>
                  document
                    .getElementById("photo-title")
                    ?.scrollIntoView({ block: "start" }),
                );
              }}
            />
          </div>
        ) : (
          <>
            <div className="fitting-workspace">
              <CapturaFoto capture={capture} />
              <div className="fitting-selection">
                {!selected && (
                  <p role="status" className="fitting-error">
                    Este modelo não está mais na coleção. Escolha outro terno
                    abaixo.
                  </p>
                )}
                <SeletorTraje
                  modelos={modelos}
                  selected={selected}
                  onSelect={select}
                />
                <div className="fitting-review">
                  <p>
                    {selected ? (
                      <>
                        <span>Modelo escolhido</span>
                        <strong>{selected.nome}</strong>
                      </>
                    ) : (
                      "Escolha um modelo para continuar."
                    )}
                  </p>
                  <Button
                    onClick={showPreview}
                    disabled={
                      !capture.photo ||
                      !selected ||
                      capture.busy ||
                      capture.cameraStatus !== "idle"
                    }
                  >
                    Ver prévia de demonstração
                  </Button>
                  <span>
                    {!capture.photo
                      ? "Adicione sua foto para continuar."
                      : "Confira sua foto e o traje antes da prova."}
                  </span>
                </div>
              </div>
            </div>
            <details className="fitting-tips">
              <summary>Como escolher uma boa foto</summary>
              <p>
                Fique de frente para a câmera, com os braços levemente afastados
                do corpo. Enquadre do rosto até abaixo dos joelhos, use uma
                roupa próxima ao corpo e procure luz natural. Evite espelhos,
                filtros e objetos na frente do traje.
              </p>
            </details>
          </>
        )}
      </div>
    </Wrap>
  );
}
