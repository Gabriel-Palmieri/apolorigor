import PacoteSolicitacao from "../../features/pedidos/PacoteSolicitacao.jsx";
import { usePacoteForm } from "../../features/pedidos/usePacoteForm.js";
import { useOutletContext } from "react-router-dom";
import Confirmacao from "../../features/pedidos/Confirmacao.jsx";
// modelos que fazem sentido como base de um pacote (ternos)

export default function Pacote() {
  const { go, cliente } = useOutletContext();
  const { form, erros, feito, set, enviar, modelo, estimativa, MODELOS_BASE } =
    usePacoteForm(cliente);
  if (feito) {
    return (
      <Confirmacao
        pedido={feito}
        go={go}
        resumo={`${feito.noivos} · ${feito.nIntegrantes} integrantes`}
      />
    );
  }
  return (
    <PacoteSolicitacao
      form={form}
      erros={erros}
      set={set}
      enviar={enviar}
      modelo={modelo}
      estimativa={estimativa}
      MODELOS_BASE={MODELOS_BASE}
      go={go}
    />
  );
}
