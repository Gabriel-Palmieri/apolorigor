import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2, Lead } from "../../shared/ui/estrutura/Typography.jsx";
import PacoteSolicitacao from "../../features/pedidos/PacoteSolicitacao.jsx";
import { useSessao } from "../../features/conta/sessao.js";
export default function Pacote() {
  const sessao = useSessao();
  return (
    <Section className="pt-10 desktop:pt-16">
      <Wrap>
        <H2>Trajes para o seu casamento.</H2>
        <Lead className="mt-4 mb-8 max-w-2xl">
          Organize as referências dos trajes, o evento e os participantes antes
          de conversar com o ateliê.
        </Lead>
        <PacoteSolicitacao
          contato={sessao?.tipo === "cliente" ? sessao : null}
        />
      </Wrap>
    </Section>
  );
}
