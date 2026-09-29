import { Section, Wrap } from "../../layouts/Content.jsx";
import { Display, Lead } from "../../shared/ui/Typography.jsx";
import { cn } from "../../shared/lib/cn.js";
import ProdutoCard from "../../features/catalog/ProdutoCard.jsx";
import { useOutletContext, useSearchParams } from "react-router-dom";
import { useCatalogo } from "../../data/useData.js";
import { useEffect, useMemo } from "react";
import { VITRINES } from "../../features/catalog/siteData.js";
import { CATEGORIAS } from "../../domain/catalog.js";
export default function Colecao() {
  const CATALOGO = useCatalogo();
  const { openProduto } = useOutletContext();
  const [params, setParams] = useSearchParams();
  const vitrine = params.get("vitrine") || "todos";
  const categoria = params.get("categoria") || "";
  const setFiltro = (key, value) =>
    setParams((current) => {
      const next = new URLSearchParams(current);
      if (value) next.set(key, value);
      else next.delete(key);
      return next;
    });
  const setVitrine = (value) =>
    setFiltro("vitrine", value === "todos" ? "" : value);
  const setCategoria = (value) => setFiltro("categoria", value);
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  const lista = useMemo(() => {
    let arr = CATALOGO;
    const v = VITRINES.find((x) => x.id === vitrine);
    if (v) arr = arr.filter(v.filtro);
    if (categoria) arr = arr.filter((p) => p.categoria === categoria);
    return arr;
  }, [CATALOGO, vitrine, categoria]);
  const abas = [
    {
      id: "todos",
      titulo: "Tudo",
    },
    ...VITRINES,
  ];
  return (
    <Section className="collection-page pt-10 desktop:pt-16">
      <Wrap>
        <div className="collection-page-heading">
        <Display>A coleção.</Display>
        <Lead className="max-w-measure">
          Todos os modelos saem com prova e ajuste de ateliê. Escolha um traje
          para ver tamanhos, valores e abrir o pedido.
        </Lead>
        </div>

        <div className="collection-tabs" role="group" aria-label="Ocasião">
          {abas.map((a) => (
            <button
              key={a.id}
              aria-pressed={vitrine === a.id}
              onClick={() => setVitrine(a.id)}
              className={cn(
                "collection-tab",
                vitrine === a.id && "collection-tab-active",
              )}
            >
              {a.titulo}
            </button>
          ))}
        </div>

        <div className="collection-categories" role="group" aria-label="Categoria">
          <span className="text-sm text-text-sub">
            Categoria
          </span>
          <button
            aria-pressed={categoria === ""}
            onClick={() => setCategoria("")}
            className={pill(categoria === "")}
          >
            Todas
          </button>
          {CATEGORIAS.map((c) => (
            <button
              key={c}
              aria-pressed={categoria === c}
              onClick={() => setCategoria(c === categoria ? "" : c)}
              className={pill(categoria === c)}
            >
              {c}
            </button>
          ))}
        </div>

        <p className="mt-8 mb-6 text-sm text-text-sub" role="status">{lista.length} {lista.length === 1 ? "modelo" : "modelos"}</p>

        {lista.length === 0 ? (
          <p className="text-text-sub text-sm py-10 px-0">
            Nenhum modelo nesse recorte.{" "}
            <button
              onClick={() => {
                setParams({});
              }}
              className="bg-transparent border-0 text-gold-text cursor-pointer text-sm underline"
            >
              Limpar filtros
            </button>
          </p>
        ) : (
          <div className="collection-grid">
            {lista.map((p) => (
              <ProdutoCard key={p.id} produto={p} onOpen={openProduto} />
            ))}
          </div>
        )}
      </Wrap>
    </Section>
  );
}
const pill = (on) =>
  cn(
    "rounded-control border min-h-11 px-3 py-1.5 font-sans text-sm cursor-pointer",
    on
      ? "border-gold bg-gold-dim font-semibold text-gold-strong"
      : "border-border bg-transparent font-medium text-text-sub hover:border-gold",
  );
