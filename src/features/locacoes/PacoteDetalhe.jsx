import { Button } from "../../shared/ui/botoes/Button.jsx";
import PacoteSolicitacao from "../pedidos/PacoteSolicitacao.jsx";
export default function PacoteDetalhe({ onVoltar }) {
  return <section>
    <Button variant="ghost" size="compact" onClick={onVoltar}>Voltar aos pacotes</Button>
    <h2 className="mt-6 mb-5 text-xl font-medium text-text">Planejamento do grupo</h2>
    <PacoteSolicitacao gestao />
  </section>;
}
