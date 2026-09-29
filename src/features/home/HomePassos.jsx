import { Section, Wrap } from '../../layouts/Content.jsx';
import { H2 } from '../../shared/ui/Typography.jsx';
import { ATELIE, PASSOS } from '../catalog/siteData.js';

export default function HomePassos() {
  return <Section id="como-funciona" className="service-section">
    <Wrap>
      <div className="service-heading">
        <H2>Como funciona o atendimento</H2>
        <a href={'tel:' + ATELIE.tel.replace(/\D/g, '')} className="site-text-link">Falar com o ateliê</a>
      </div>
      <div className="service-questions">
        {PASSOS.map((passo, index) => <details key={passo.n} className="service-question" open={index === 0}>
          <summary>{passo.t}<span className="service-question-toggle" aria-hidden="true" /></summary>
          <p>{passo.d}</p>
        </details>)}
      </div>
    </Wrap>
  </Section>;
}
