import { Link } from 'react-router-dom';
import { Section, Wrap } from '../../layouts/Content.jsx';
import { Display } from '../../shared/ui/Typography.jsx';
import { Button } from '../../shared/ui/Button.jsx';
import { onImgError } from '../../shared/lib/images.js';
import { ATELIE } from '../catalog/siteData.js';
import { ArrowIcon } from '../../shared/ui/ArrowIcon.jsx';

export default function HomeHero({ CATALOGO, go }) {
  const garments = [CATALOGO.find(p => p.id === 2), CATALOGO.find(p => p.id === 3)].filter(Boolean);
  return <Section bleed className="home-hero pt-8 desktop:pt-12">
    <Wrap>
      <div className="home-hero-layout">
        <div className="home-hero-copy">
          <div>
            <Display className="home-hero-title">Vestir<br /> a ocasião.</Display>
            <p className="home-hero-description">Locação e venda de trajes de cerimônia.<br />Prova e ajustes de ateliê inclusos.</p>
            <div className="home-hero-actions">
              <Button onClick={() => go('colecao')}>Ver a coleção <ArrowIcon /></Button>
              <a href="#como-funciona" className="site-text-link">Como funciona</a>
            </div>
          </div>
          <p className="home-hero-audience">Para o noivo, os padrinhos<br />e os convidados.</p>
        </div>
        <div className="home-hero-gallery">
          {garments.map((p, index) => <figure key={p.id} className={index ? 'home-hero-secondary' : 'home-hero-primary'}>
            <Link to={'/colecao/' + p.id} className="home-hero-image" aria-label={'Conhecer ' + p.nome}>
              <img src={p.foto} alt={p.nome} onError={onImgError} fetchPriority={index ? 'auto' : 'high'} />
              <span className="home-hero-image-action" aria-hidden="true"><ArrowIcon /></span>
            </Link>
            <figcaption><span>{p.nome}</span><span>{p.tecido}</span></figcaption>
          </figure>)}
        </div>
      </div>
      <div className="home-hero-footnote">
        <span>Feito para o seu momento.</span><a href="#atelie" className="site-text-link">Visite o ateliê em {ATELIE.cidade} <ArrowIcon /></a>
      </div>
    </Wrap>
  </Section>;
}
