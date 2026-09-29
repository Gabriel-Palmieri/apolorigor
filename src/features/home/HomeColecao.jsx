import { Section, Wrap } from '../../layouts/Content.jsx';
import { H2 } from '../../shared/ui/Typography.jsx';
import { Button } from '../../shared/ui/Button.jsx';
import ProdutoCard from '../catalog/ProdutoCard.jsx';
import { VITRINES } from '../catalog/siteData.js';
import { ArrowIcon } from '../../shared/ui/ArrowIcon.jsx';

export default function HomeColecao({ go, openProduto, destaques }) {
  return <Section id="colecao-preview">
    <Wrap>
      <div className="collection-intro">
        <H2 className="text-editorial">Encontre o seu traje.</H2>
        <Button variant="ghost" onClick={() => go('colecao')}>Ver tudo <ArrowIcon /></Button>
      </div>
      <nav aria-label="Coleção por ocasião" className="occasion-navigation">
        {VITRINES.map(v => <button key={v.id} onClick={() => go('colecao', v.id)} className="occasion-link">
          <span className="occasion-title">{v.titulo}<ArrowIcon /></span>
          <span className="occasion-description">{v.desc}</span>
        </button>)}
      </nav>
      <div className="collection-grid">
        {destaques.map(p => <ProdutoCard key={p.id} produto={p} onOpen={openProduto} />)}
      </div>
    </Wrap>
  </Section>;
}
