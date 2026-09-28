import { Badge } from "../../shared/ui/Feedback.jsx";
import { PEDIDO_MAP } from "../../shared/ui/status.js";
import { Button } from "../../shared/ui/Button.jsx";
import { useNavigate, useParams } from "react-router-dom";
import { TIPO_LABEL } from "../../features/pedidos/store.js";
import { fmt, fmtDate } from "../../shared/lib/format.js";
import { comparecimentoPacote } from "../../domain/rules.js";
import RastreioPedido from "../../features/pedidos/RastreioPedido.jsx";
const dataHora = (ms) =>
  new Date(ms).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
// cartão-linha clicável da lista de pedidos
// cartão-linha clicável da lista de pedidos
function RowShell({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="block text-left w-full cursor-pointer border border-border bg-card py-4 px-4 font-sans"
    >
      {children}
    </button>
  );
}

// Área do cliente (perfil "noivo" de exemplo). Abas: Pedidos (avulsos + o pacote
// padronizado) e Meus dados. O Portal do noivo não é mais aba: abre ao clicar no
// pedido do pacote de casamento.
// Aba "Pedidos": lista o pacote padronizado (se houver) + os pedidos avulsos.
// Clicar no pacote leva à página do casamento (fora do perfil); clicar num
// avulso abre o rastreio embutido aqui.
function MeusPedidos({ pedidos, pacote, go }) {
  const { protocolo } = useParams();
  const navigate = useNavigate();
  const setSel = (value) =>
    navigate(value ? "/conta/pedidos/" + value : "/conta/pedidos");
  const aberto = protocolo && pedidos.find((p) => p.protocolo === protocolo);
  if (protocolo && !aberto)
    return (
      <p role="status">
        Pedido não encontrado.{" "}
        <Button onClick={() => setSel(null)}>Voltar aos pedidos</Button>
      </p>
    );
  if (aberto) {
    return <RastreioPedido pedido={aberto} onVoltar={() => setSel(null)} />;
  }
  if (!pacote && pedidos.length === 0) {
    return (
      <div className="border border-border bg-card">
        <div className="py-7 px-6">
          <p className="m-0 font-display text-lg font-medium text-text">
            Você ainda não tem pedidos.
          </p>
          <p className="mt-2 mx-0 mb-4 text-compact text-text-sub leading-relaxed max-w-measure">
            Locações, compras e o pacote de casamento aparecem aqui. Clique num
            pedido para ver o andamento.
          </p>
          <Button onClick={() => go("colecao")}>Ver a coleção</Button>
        </div>
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      {pacote && (
        <RowShell onClick={() => navigate("/casamento/" + pacote.id)}>
          <div className="flex justify-between gap-3.5 flex-wrap">
            <div>
              <p className="m-0 font-mono text-xs font-bold text-gold-text tracking-widest uppercase">
                Pacote
              </p>
              <p className="mt-1.5 mx-0 mb-0 text-compact text-text">
                {TIPO_LABEL.locacao_padronizada} · {pacote.noivos}
              </p>
              <p className="mt-1 mx-0 mb-0 text-caption text-text-muted font-mono">
                Evento em {fmtDate(pacote.dataEvento)} · abrir a página do
                casamento →
              </p>
            </div>
            <div className="text-right">
              <span className="text-caption font-semibold text-green-fg font-mono tracking-wide">
                {(() => {
                  const { compareceram, total } = comparecimentoPacote(pacote);
                  return `${compareceram}/${total} retiraram`;
                })()}
              </span>
              {pacote.valor > 0 && (
                <p className="mt-1.5 mx-0 mb-0 font-mono text-compact text-text">
                  R$ {fmt(pacote.valor)}
                </p>
              )}
            </div>
          </div>
        </RowShell>
      )}

      {pedidos.map((p) => (
        <RowShell key={p.id} onClick={() => setSel(p.protocolo)}>
          <div className="flex justify-between gap-3.5 flex-wrap">
            <div>
              <p className="m-0 font-mono text-xs font-bold text-gold-text tracking-widest uppercase">
                {TIPO_LABEL[p.tipo]}
              </p>
              <p className="mt-1.5 mx-0 mb-0 text-compact text-text">
                {p.produtoNome
                  ? `${p.produtoNome}${p.tam ? ` · tam. ${p.tam}` : ""}`
                  : p.noivos || "Pedido"}
              </p>
              <p className="mt-1 mx-0 mb-0 text-caption text-text-muted font-mono">
                {p.protocolo} · enviado em {dataHora(p.criadoEm)}
              </p>
            </div>
            <div className="text-right">
              <Badge label={p.status} map={PEDIDO_MAP} />
              {p.valorEstimado > 0 && (
                <p className="mt-1.5 mx-0 mb-0 font-mono text-compact text-text">
                  R$ {fmt(p.valorEstimado)}
                </p>
              )}
            </div>
          </div>
        </RowShell>
      ))}
    </div>
  );
}
export { RowShell, MeusPedidos, dataHora };
