import { useCallback, useState } from "react";
import { Outlet, useLocation, useMatch, useNavigate } from "react-router-dom";
import SiteNav from "./SiteNav.jsx";
import DetalheProdutoVitrine from "../features/catalogo/DetalheProdutoVitrine.jsx";
import { useSessao } from "../features/conta/sessao.js";
import { useRequest } from "../data/useRequest.js";
import { productFromApi } from "../data/adapters.js";
import { useSiteNavigation } from "../app/useSiteNavigation.js";
import { SITE_PATHS } from "../app/navigation.js";
import InicioAtelie from "../features/inicio/InicioAtelie.jsx";
const DRAFT_KEY = "apollo-pedido-rascunho";
export default function SiteLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const go = useSiteNavigation();
  const produtoRoute = useMatch("/colecao/:produtoId");
  const detail = useRequest(produtoRoute ? "/products/" + encodeURIComponent(produtoRoute.params.produtoId) : null, false);
  const produtoAberto = detail.data ? productFromApi(detail.data) : null;
  const sessao = useSessao();
  const cliente = sessao?.tipo === "cliente" ? sessao : null;
  const [rascunho, setRascunho] = useState(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
      if (!saved?.produtoId || !saved.tam) return null;
      saved.requestKey ||= crypto.randomUUID();
      sessionStorage.setItem(DRAFT_KEY, JSON.stringify(saved));
      return saved;
    } catch {
      return null;
    }
  });
  const openProduto = useCallback(
    (produto) => navigate("/colecao/" + produto.id + location.search),
    [navigate, location.search],
  );
  const descartarRascunho = useCallback(() => {
    setRascunho(null);
    try {
      sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* A memória é limpa mesmo quando o armazenamento está indisponível. */
    }
  }, []);
  const continuarPedido = useCallback(
    (payload) => {
      payload = { ...payload, requestKey: crypto.randomUUID() };
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
              descartarRascunho,
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
      {produtoRoute && detail.error && (
        <p className="product-missing" role="status">
          {detail.error.status === 404 ? "Modelo não encontrado." : detail.error.message}{" "}
          {detail.error.status !== 404 && <button onClick={detail.retry}>Tentar novamente</button>}
          <button onClick={() => go("colecao")}>Voltar à coleção</button>
        </p>
      )}
    </div>
  );
}
