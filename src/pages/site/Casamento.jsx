import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2, Lead } from "../../shared/ui/estrutura/Typography.jsx";
import { Link } from "react-router-dom";
import PortalNoivo from "../../features/casamento/PortalNoivo.jsx";
export default function Casamento() {
  return (
    <Section className="pt-10 desktop:pt-16">
      <Wrap>
        <H2>Área do casamento.</H2>
        <Lead className="mt-4 mb-6">
          Os trajes do casal e a organização de quem estará ao seu lado.
        </Lead>
        <div className="flex flex-wrap gap-6 mb-8">
          <Link
            to="/pacote"
            className="text-sm text-gold-text underline underline-offset-4"
          >
            Planejar o grupo
          </Link>
          <Link
            to="/conta/pedidos"
            className="text-sm text-gold-text underline underline-offset-4"
          >
            Ver meus pedidos
          </Link>
        </div>
        <PortalNoivo />
      </Wrap>
    </Section>
  );
}
