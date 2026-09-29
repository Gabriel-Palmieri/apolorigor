import { Link } from "react-router-dom";
import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { Display } from "../../shared/ui/estrutura/Typography.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { onImgError } from "../../shared/lib/images.js";
import { ATELIE } from "./conteudoInicio.js";
import { ArrowIcon } from "../../shared/ui/icones/ArrowIcon.jsx";

function FotoEditorial({ src, alt, title, detail, primary }) {
  return (
    <figure className={primary ? "home-hero-primary" : "home-hero-secondary"}>
      <Link
        to="/colecao"
        className="home-hero-image"
        aria-label={"Ver a coleção — " + title}
      >
        <img
          src={src}
          alt={alt}
          onError={onImgError}
          fetchPriority={primary ? "high" : "auto"}
        />
      </Link>
      <figcaption>
        <span>{title}</span>
        <span>{detail}</span>
      </figcaption>
    </figure>
  );
}

export default function InicioApresentacao({ go }) {
  return (
    <Section bleed className="home-hero">
      <Wrap>
        <div className="home-hero-layout">
          <div className="home-hero-copy">
            <div>
              <Display className="home-hero-title">
                Vestir
                <br /> a ocasião.
              </Display>
              <p className="home-hero-description">
                Locação e venda de trajes de cerimônia.
                <br />
                Prova e ajustes de ateliê inclusos.
              </p>
              <div className="home-hero-actions">
                <Button onClick={() => go("colecao")}>
                  Ver a coleção <ArrowIcon />
                </Button>
                <a href="#como-funciona" className="site-text-link">
                  Como funciona
                </a>
              </div>
            </div>
            <p className="home-hero-audience">
              Para o noivo, os padrinhos
              <br />e os convidados.
            </p>
          </div>
          <div className="home-hero-gallery">
            <FotoEditorial
              primary
              src="/produtos/gravata-seda-bordo.jpg"
              alt="Traje marfim de cerimônia com colete e gravata borboleta"
              title="Trajes de cerimônia"
              detail="O seu momento, em cada detalhe."
            />
            <FotoEditorial
              src="/produtos/smoking-black-tie.jpg"
              alt="Detalhe de um smoking preto com lapela de cetim"
              title="Black tie"
              detail="A presença dos detalhes."
            />
          </div>
        </div>
        <div className="home-hero-footnote">
          <span>Feito para o seu momento.</span>
          <a href="#atelie" className="site-text-link">
            Visite o ateliê em {ATELIE.cidade} <ArrowIcon />
          </a>
        </div>
      </Wrap>
    </Section>
  );
}
