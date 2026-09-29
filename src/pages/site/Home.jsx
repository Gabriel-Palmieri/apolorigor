import HomeHero from "../../features/home/HomeHero.jsx";
import HomeColecao from "../../features/home/HomeColecao.jsx";
import HomePacotes from "../../features/home/HomePacotes.jsx";
import HomePassos from "../../features/home/HomePassos.jsx";
import HomeProvador from "../../features/home/HomeProvador.jsx";
import { useCatalogo } from "../../data/useData.js";
import { useOutletContext } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useHomeMotion } from "../../features/home/useHomeMotion.js";
export default function Home() {
  const homeRef = useRef(null);
  useHomeMotion(homeRef);
  const CATALOGO = useCatalogo();
  const {
    go,
    openProduto,
    scrollTo
  } = useOutletContext();
  // âncora vinda da navegação (ex.: "Como funciona")
  useEffect(() => {
    if (scrollTo) {
      const el = document.getElementById(scrollTo);
      if (el) el.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        block: "start"
      });else window.scrollTo({
        top: 0
      });
    }
  }, [scrollTo]);
  const destaques = [3, 2, 5, 4, 9, 8].map(id => CATALOGO.find(p => p.id === id)).filter(Boolean);
  return <div ref={homeRef} className="home-page">
      <HomeHero CATALOGO={CATALOGO} go={go} />
      <HomeColecao go={go} openProduto={openProduto} destaques={destaques} />
      <HomeProvador catalogo={CATALOGO} go={go} />
      <HomePacotes go={go} />
      <HomePassos />
    </div>;
}
