import { Badge } from "../../shared/ui/feedback/Feedback.jsx";
import { PEDIDO_MAP } from "../../shared/ui/feedback/status.js";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { TIPO_LABEL } from "../../domain/pedidos.js";
import { money } from "../../shared/lib/format.js";
import RastreioPedido from "../pedidos/RastreioPedido.jsx";
export function MeusPedidos({ pedidos, go }) {
  const { protocolo } = useParams();
  const navigate = useNavigate();
  const aberto = pedidos.find((p) => p.protocolo === protocolo);
  if (protocolo && !aberto)
    return (
      <p role="status">
        Pedido não encontrado.{" "}
        <Button onClick={() => navigate("/conta/pedidos")}>
          Voltar aos pedidos
        </Button>
      </p>
    );
  if (aberto)
    return (
      <RastreioPedido
        pedido={aberto}
        onVoltar={() => navigate("/conta/pedidos")}
      />
    );
  if (!pedidos.length)
    return (
      <div className="py-6">
        <p className="text-text-sub">Você ainda não tem pedidos.</p>
        <Button onClick={() => go("colecao")}>Ver a coleção</Button>
      </div>
    );
  return (
    <div className="grid gap-3">
      {pedidos.map((p) => (
        <button
          key={p.id}
          onClick={() => navigate("/conta/pedidos/" + p.protocolo)}
          className="w-full border border-border bg-card p-5 font-sans text-left"
        >
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <p className="m-0 text-base text-text">
                {p.produtoNome} · {p.tam}
              </p>
              <p className="mt-2 mb-0 text-sm text-text-sub">
                {TIPO_LABEL[p.tipo]} · {p.protocolo}
              </p>
            </div>
            <Badge label={p.status} map={PEDIDO_MAP} />
          </div>
          <p className="mb-0 text-sm text-gold-text">
            {money(p.valorEstimado)}
          </p>
        </button>
      ))}
    </div>
  );
}
