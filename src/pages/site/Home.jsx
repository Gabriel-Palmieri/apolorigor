import InicioApresentacao from "../../features/inicio/InicioApresentacao.jsx";
import InicioColecao from "../../features/inicio/InicioColecao.jsx";
import InicioPacotes from "../../features/inicio/InicioPacotes.jsx";
import InicioPassos from "../../features/inicio/InicioPassos.jsx";
import InicioProvador from "../../features/inicio/InicioProvador.jsx";
import { useCatalogo } from "../../data/useData.js";
import { useOutletContext } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAnimacaoInicio } from "../../features/inicio/useAnimacaoInicio.js";
export default function Home() {
  const homeRef = useRef(null);
  useAnimacaoInicio(homeRef);
  const CATALOGO = useCatalogo();
  const { go, openProduto, scrollTo } = useOutletContext();
  // âncora vinda da navegação (ex.: "Como funciona")
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el)
        el.scrollIntoView({
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
          block: "start",
        });
      else
        window.scrollTo({
          top: 0,
        });
    }
  }, [scrollTo]);
  const destaques = CATALOGO.slice(0, 6);
  return (
    <div ref={homeRef} className="home-page">
      <InicioApresentacao go={go} />
      <InicioColecao go={go} openProduto={openProduto} destaques={destaques} />
      <InicioProvador catalogo={CATALOGO} go={go} />
      <InicioPacotes go={go} />
      <InicioPassos />
    </div>
  );
}
