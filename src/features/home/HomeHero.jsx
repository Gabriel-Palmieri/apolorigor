import { Link } from 'react-router-dom';
import { Section, Wrap } from '../../layouts/Content.jsx';
import { Display } from '../../shared/ui/Typography.jsx';
import { Button } from '../../shared/ui/Button.jsx';
import { onImgError } from '../../shared/lib/images.js';
import { ATELIE } from '../catalog/siteData.js';

export default function HomeHero({ CATALOGO, go }) {
  const garments = [CATALOGO.find(p => p.id === 2), CATALOGO.find(p => p.id === 3)].filter(Boolean);
  return <Section bleed className="pt-10 desktop:pt-16 pb-8">
    <Wrap>
      <div className="grid desktop:grid-cols-intro items-end gap-6 mb-10 desktop:mb-12">
        <div>
          <Display className="text-fashion">Vestir a ocasião.</Display>
          <p className="mt-5 mb-0 text-text-sub text-base max-w-measure">Locação e venda de trajes de cerimônia.<br />Prova e ajustes de ateliê inclusos.</p>
        </div>
        <div className="desktop:justify-self-end">
          <Button onClick={() => go('colecao')}>Ver a coleção</Button>
          <p className="mt-3 mb-0 text-sm text-text-sub">Para o noivo, os padrinhos e os convidados.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 phone:grid-cols-fashion gap-3 desktop:gap-5">
        {garments.map((p, index) => <figure key={p.id} className={index ? 'm-0 hidden phone:block' : 'm-0'}>
          <Link to={'/colecao/' + p.id} className="block overflow-hidden bg-bg-elevated focus-visible:outline-offset-4" aria-label={'Conhecer ' + p.nome}>
            <img src={p.foto} alt={p.nome} onError={onImgError} fetchPriority={index ? 'auto' : 'high'} className="w-full h-hero-photo object-cover object-center block" />
          </Link>
          <figcaption className="flex justify-between gap-3 pt-3 text-sm text-text-sub">
            <span>{p.nome}</span><span>{p.tecido}</span>
          </figcaption>
        </figure>)}
      </div>
      <div className="flex justify-between gap-4 pt-6 text-sm text-text-sub">
        <span>Feito para o seu momento.</span><a href="#atelie" className="text-text-sub underline underline-offset-4 hover:text-text">Visite o ateliê em {ATELIE.cidade}</a>
      </div>
    </Wrap>
  </Section>;
}
