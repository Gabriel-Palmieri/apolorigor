import { Section, Wrap } from '../../layouts/Content.jsx';
import { H2 } from '../../shared/ui/Typography.jsx';
import { PASSOS } from '../catalog/siteData.js';

export default function HomePassos() {
  return <Section id="como-funciona" className="scroll-mt-24">
    <Wrap>
      <div className="grid desktop:grid-cols-hero gap-rhythm">
        <div>
          <H2 className="text-editorial">Da escolha<br />ao último ajuste.</H2>
          <p className="mt-5 text-text-sub leading-relaxed max-w-measure">Você cuida da ocasião. O ateliê acompanha o traje, do pedido à devolução.</p>
        </div>
        <ol className="m-0 p-0 list-none">
          {PASSOS.map(p => <li key={p.n} className="grid grid-cols-step gap-5 py-6 first:pt-0 border-b border-border last:border-0">
            <span className="text-gold-text text-sm tabular-nums pt-1">{p.n}</span>
            <div><h3 className="m-0 font-display text-2xl font-normal">{p.t}</h3><p className="mt-3 mb-0 text-sm text-text-sub leading-relaxed">{p.d}</p></div>
          </li>)}
        </ol>
      </div>
    </Wrap>
  </Section>;
}
