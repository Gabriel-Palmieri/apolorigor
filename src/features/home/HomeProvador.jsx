import { Section, Wrap } from '../../layouts/Content.jsx';
import { H2, Lead } from '../../shared/ui/Typography.jsx';
import { Button } from '../../shared/ui/Button.jsx';
import { onImgError } from '../../shared/lib/images.js';
import { ternosParaProva } from '../../domain/provador.js';
export default function HomeProvador({ catalogo, go }) {
  const modelos = ternosParaProva(catalogo);
  const modelo = modelos.find(produto => produto.foto?.startsWith('/')) || modelos[0];
  return <Section id="provador" className="home-fitting-section"><Wrap><div className="home-fitting-layout">
    <figure className="home-fitting-photo">{modelo ? <img src={modelo.foto} alt={modelo.nome} onError={onImgError} loading="lazy" /> : <div className="home-fitting-photo-empty">Apollo Rigor</div>}<figcaption>{modelo?.nome || 'Nossa coleção'}<span>A escolha do traje começa aqui.</span></figcaption></figure>
    <div className="home-fitting-copy"><H2>Antes da prova,<br />uma nova perspectiva.</H2><Lead className="mt-6">O terno da coleção. Uma foto sua. Conheça o nosso provador virtual e prepare sua próxima escolha.</Lead><p className="home-fitting-description">Escolha um modelo, abra a câmera ou envie uma foto. Você pode trocar de traje e conferir sua seleção com calma.</p><Button onClick={() => go('provador')}>Conhecer o provador</Button><p className="home-fitting-demo">Versão de demonstração. A prova com IA ainda não está disponível.</p></div>
  </div></Wrap></Section>;
}
