import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2 } from "../../shared/ui/estrutura/Typography.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import CartaoProdutoVitrine from "../catalogo/CartaoProdutoVitrine.jsx";
import { VITRINES } from "../../domain/vitrine.js";
import { ArrowIcon } from "../../shared/ui/icones/ArrowIcon.jsx";
import { useData } from "../../data/useData.js";
import { refreshData } from "../../data/cache.js";

export default function InicioColecao({ go, openProduto, destaques }) {
  const { error, loading, initialized } = useData();
  return (
    <Section id="colecao-preview">
      <Wrap>
        <div className="collection-intro">
          <H2 className="text-editorial">Encontre o seu traje.</H2>
          <Button variant="ghost" onClick={() => go("colecao")}>
            Ver tudo <ArrowIcon />
          </Button>
        </div>
        <nav aria-label="Coleção por ocasião" className="occasion-navigation">
          {VITRINES.map((v) => (
            <button
              key={v.id}
              onClick={() => go("colecao", v.id)}
              className="occasion-link"
            >
              <span className="occasion-title">
                {v.titulo}
                <ArrowIcon />
              </span>
              <span className="occasion-description">{v.desc}</span>
            </button>
          ))}
        </nav>
        {error && <div className="py-6 border-y border-border-soft">
          <p role="alert" className="mt-0 mb-4 text-sm text-text-sub">Não foi possível atualizar a coleção. {destaques.length ? "Os modelos exibidos podem ter sido atualizados." : "Tente novamente em instantes."}</p>
          <Button variant="ghost" disabled={loading} onClick={() => refreshData()}>{loading ? "Tentando novamente…" : "Tentar novamente"}</Button>
        </div>}
        {!initialized && loading && <p role="status" className="text-sm text-text-sub">Carregando coleção…</p>}
        {initialized && !error && !destaques.length && <p className="text-sm text-text-sub">A coleção está sendo preparada.</p>}
        <div className="collection-grid">
          {destaques.map((p) => (
            <CartaoProdutoVitrine key={p.id} produto={p} onOpen={openProduto} />
          ))}
        </div>
      </Wrap>
    </Section>
  );
}
