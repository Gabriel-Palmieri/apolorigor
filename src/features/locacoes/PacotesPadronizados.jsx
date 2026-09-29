import { useSearchParams } from "react-router-dom";
import PacoteVisaoGeral from "./PacoteVisaoGeral.jsx";
import PacoteDetalhe from "./PacoteDetalhe.jsx";
export default function PacotesPadronizados() {
  const [params, setParams] = useSearchParams();
  const planejamento = params.get("visao") === "planejamento";
  const navegar = mostrar => setParams(current => {
    const next = new URLSearchParams(current);
    next.set("aba", "pacotes");
    next.delete("pacote");
    if (mostrar) next.set("visao", "planejamento"); else next.delete("visao");
    return next;
  });
  return planejamento ? <PacoteDetalhe onVoltar={() => navegar(false)} /> : <PacoteVisaoGeral onPlanejar={() => navegar(true)} />;
}
