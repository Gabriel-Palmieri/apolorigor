import { Section, Wrap } from '../../layouts/Content.jsx';
import { H2, Lead } from '../../shared/ui/Typography.jsx';
import { Button } from '../../shared/ui/Button.jsx';
import { onImgError } from '../../shared/lib/images.js';

export default function HomePacotes({ go }) {
  return <Section className="home-wedding-section">
    <Wrap>
      <div className="grid desktop:grid-cols-pair gap-rhythm items-center">
        <div className="desktop:pr-8">
          <H2 className="text-editorial">Um pedido para vestir<br />o grupo inteiro.</H2>
          <Lead className="mt-6">Você escolhe o modelo e a data; cada padrinho, pai e pajem faz a prova e retira o traje no próprio nome.</Lead>
          <dl className="mt-8 mb-8 grid gap-4 text-sm">
            <div className="flex justify-between gap-5 border-b border-border pb-4"><dt className="text-text-sub">Modelo</dt><dd className="m-0 text-right">Padronizado para o grupo</dd></div>
            <div className="flex justify-between gap-5 border-b border-border pb-4"><dt className="text-text-sub">Atendimento</dt><dd className="m-0 text-right">Prova e retirada individuais</dd></div>
            <div className="flex justify-between gap-5"><dt className="text-text-sub">Ajustes</dt><dd className="m-0 text-right">Inclusos em cada traje</dd></div>
          </dl>
          <Button onClick={() => go('pacote')}>Montar pacote de casamento</Button>
        </div>
        <figure className="m-0">
          <img src="/produtos/terno-casamento-marfim.jpg" alt="Detalhe de um traje marfim de cerimônia" loading="lazy" onError={onImgError} className="block w-full aspect-portrait object-cover" />
          <figcaption className="mt-3 text-sm text-text-sub">O noivo, os padrinhos, cada detalhe.</figcaption>
        </figure>
      </div>
    </Wrap>
  </Section>;
}
