import { Section, Wrap } from '../../layouts/Content.jsx';
import { H2 } from '../../shared/ui/Typography.jsx';
import { Button } from '../../shared/ui/Button.jsx';
import ProdutoCard from '../catalog/ProdutoCard.jsx';
import { VITRINES } from '../catalog/siteData.js';

export default function HomeColecao({ go, openProduto, destaques }) {
  return <Section id="colecao-preview">
    <Wrap>
      <div className="flex justify-between items-end gap-5 mb-8 flex-wrap">
        <H2>Encontre o seu traje.</H2>
        <Button variant="ghost" onClick={() => go('colecao')}>Ver tudo</Button>
      </div>
      <nav aria-label="Coleção por ocasião" className="grid grid-cols-2 desktop:grid-cols-4 gap-6 mb-12">
        {VITRINES.map(v => <button key={v.id} onClick={() => go('colecao', v.id)} className="occasion-link">
          <span className="block font-display text-xl text-text">{v.titulo}</span>
          <span className="block mt-2 text-sm text-text-sub leading-relaxed">{v.desc}</span>
        </button>)}
      </nav>
      <div className="grid grid-cols-2 desktop:grid-cols-3 gap-x-5 gap-y-10 desktop:gap-x-8">
        {destaques.map(p => <ProdutoCard key={p.id} produto={p} onOpen={openProduto} />)}
      </div>
    </Wrap>
  </Section>;
}
