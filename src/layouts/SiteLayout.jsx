import { useCallback, useState } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import SiteNav from "./SiteNav.jsx";
import DetalheProdutoVitrine from "../features/catalogo/DetalheProdutoVitrine.jsx";
import { useSessao } from "../features/conta/sessao.js";
import { useCatalogo, useData } from "../data/useData.js";
import { useSiteNavigation } from "../app/useSiteNavigation.js";
import { SITE_PATHS } from "../app/navigation.js";
import InicioAtelie from "../features/inicio/InicioAtelie.jsx";
const DRAFT_KEY = "apollo-pedido-rascunho";
export default function SiteLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const go = useSiteNavigation();
  const catalogo = useCatalogo();
  const { initialized } = useData();
  const produtoRoute = useMatch("/colecao/:produtoId");
  const produtoAberto = catalogo.find(
    (p) => String(p.id) === produtoRoute?.params.produtoId,
  );
  const sessao = useSessao();
  const cliente = sessao?.tipo === "cliente" ? sessao : null;
  const [rascunho, setRascunho] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
      return saved && saved.produtoId && saved.tam ? saved : null;
    } catch {
      return null;
    }
  });
  const openProduto = useCallback(
    (produto) => navigate("/colecao/" + produto.id + location.search),
    [navigate, location.search],
  );
  const continuarPedido = useCallback(
    (payload) => {
      setRascunho(payload);
      try {
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
      } catch {
        /* draft remains in this tab */
      }
      navigate("/pedido");
    },
    [navigate],
  );
  const pathname = location.pathname;
  const view = pathname.startsWith("/conta")
    ? "conta"
    : pathname.startsWith("/colecao")
      ? "colecao"
      : Object.keys(SITE_PATHS).find((key) => SITE_PATHS[key] === pathname) ||
        "home";
  const scrollTo = pathname === "/" ? location.hash.slice(1) : null;
  return (
    <div className="site-shell">
      <div className="site-content">
        <SiteNav view={scrollTo || view} go={go} />
        <main id="main-content" tabIndex={-1}>
          <Outlet
            context={{
              go,
              openProduto,
              rascunho,
              cliente,
              scrollTo,
            }}
          />
        </main>
        <InicioAtelie go={go} />
      </div>
      {produtoAberto && (
        <DetalheProdutoVitrine
          key={produtoAberto.id}
          produto={produtoAberto}
          onClose={() => navigate("/colecao" + location.search)}
          onContinuar={continuarPedido}
        />
      )}
      {initialized && produtoRoute && !produtoAberto && (
        <p className="product-missing" role="status">
          Modelo não encontrado.{" "}
          <button onClick={() => go("colecao")}>Voltar à coleção</button>
        </p>
      )}
    </div>
  );
}
