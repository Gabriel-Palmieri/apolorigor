import { Section, Wrap } from "../../layouts/Content.jsx";
import { H2, Lead } from "../../shared/ui/Typography.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { useEffect, useState } from 'react';
import { TIPO_LABEL } from './store.js';
import RastreioPedido from './RastreioPedido.jsx';
// Tela de confirmação compartilhada pelos dois fluxos de pedido. O rastreio é
// mostrado aqui mesmo (embutido) — não há mais tela "Acompanhar pedido".
export default function Confirmacao({
  pedido,
  go,
  resumo
}) {
  const [rastreio, setRastreio] = useState(false);
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [rastreio]);
  return <Section>
      <Wrap narrow>
        <H2 className="mt-3.5">Recebemos seu pedido.</H2>
        <Lead className="mt-4">
          O ateliê vai confirmar disponibilidade e valores e entrar em contato por
          e-mail e telefone. Guarde o protocolo para acompanhar o andamento — ele
          também fica na sua área de cliente, em <b>Pedidos avulsos</b>.
        </Lead>

        <div className="my-7 mx-0 border border-border bg-card py-5 px-5">
          <p className="m-0 text-micro tracking-widest uppercase text-text-sub font-mono">Protocolo</p>
          <p className="mt-2 mx-0 mb-0 font-mono text-3xl font-semibold text-gold-text tracking-wide">{pedido.protocolo}</p>
          <p className="mt-2.5 mx-0 mb-0 text-compact text-text-sub">
            {TIPO_LABEL[pedido.tipo]} · {resumo}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <Button onClick={() => setRastreio(v => !v)}>
            {rastreio ? 'Ocultar acompanhamento' : 'Acompanhar pedido'}
          </Button>
          <Button variant="ghost" onClick={() => go('home')}>Voltar ao início</Button>
        </div>

        {rastreio && <div className="mt-8">
            <RastreioPedido pedido={pedido} />
          </div>}
      </Wrap>
    </Section>;
}
