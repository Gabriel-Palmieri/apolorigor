import PedidoCheckout from "../../features/pedidos/PedidoCheckout.jsx";
import { usePedidoForm } from "../../features/pedidos/usePedidoForm.js";
import { Section, Wrap } from "../../layouts/Content.jsx";
import { H2, Lead } from "../../shared/ui/Typography.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { useOutletContext } from "react-router-dom";
import Confirmacao from "../../features/pedidos/Confirmacao.jsx";
export default function Pedido() {
  const { rascunho, go, cliente } = useOutletContext();
  const { form, erros, feito, set, enviar, r } = usePedidoForm(
    cliente,
    rascunho,
  );
  if (!rascunho && !feito) {
    return (
      <Section>
        <Wrap narrow>
          <H2 className="mt-3.5">Escolha um traje para começar.</H2>
          <Lead className="mt-4">
            Seu pedido monta a partir de um modelo da coleção — tamanho,
            modalidade e datas.
          </Lead>
          <div className="mt-6 flex gap-3 flex-wrap">
            <Button onClick={() => go("colecao")}>Ver a coleção</Button>
            <Button variant="ghost" onClick={() => go("pacote")}>
              Montar pacote de casamento
            </Button>
          </div>
        </Wrap>
      </Section>
    );
  }
  if (feito) {
    return (
      <Confirmacao
        pedido={feito}
        go={go}
        resumo={`${feito.produtoNome} · tam. ${feito.tam} · ${feito.cliente.nome}`}
      />
    );
  }
  return (
    <PedidoCheckout
      form={form}
      erros={erros}
      set={set}
      enviar={enviar}
      r={r}
      go={go}
    />
  );
}
