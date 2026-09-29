import { useState } from "react";
import { Link } from "react-router-dom";
import { PEDIDO_MAP } from "../../shared/ui/feedback/status.js";
import { Badge, Alert } from "../../shared/ui/feedback/Feedback.jsx";
import { Drawer } from "../../shared/ui/dialogos/Modal.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { TextArea, Field } from "../../shared/ui/formularios/Form.jsx";
import { money, fmtDate } from "../../shared/lib/format.js";
import { atualizarStatus } from "../../data/pedidos.js";
import { TIPO_LABEL } from "../../domain/pedidos.js";
export const dataHora = (ms) =>
  new Date(ms).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
export function Linha({ k, children }) {
  return (
    <div className="flex justify-between gap-4 py-2 border-b border-border-soft text-sm">
      <span className="text-text-sub">{k}</span>
      <span className="text-text text-right break-words min-w-0">
        {children}
      </span>
    </div>
  );
}
export function Detalhe({ pedido, onClose }) {
  const [motivo, setMotivo] = useState("");
  const [recusando, setRecusando] = useState(false);
  const [erro, setErro] = useState("");
  const [busy, setBusy] = useState(false);
  const terminal = ["Aprovado", "Recusado"].includes(pedido.status);
  async function action(status, note) {
    if (busy) return;
    setBusy(true);
    setErro("");
    try {
      await atualizarStatus(pedido.id, status, note);
      if (status !== "Em análise") onClose();
    } catch (error) {
      setErro(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Drawer
      title={pedido.protocolo}
      subtitle={TIPO_LABEL[pedido.tipo] + " · " + dataHora(pedido.criadoEm)}
      onClose={onClose}
    >
      <fieldset
        disabled={busy}
        className="border-0 p-0 m-0 min-w-0"
        aria-busy={busy}
      >
        {erro && <Alert>{erro}</Alert>}
        <Badge label={pedido.status} map={PEDIDO_MAP} />
        <h3 className="mt-6 font-medium text-base">
          {pedido.produtoNome} · {pedido.tam}
        </h3>
        <Linha k="Cliente">{pedido.cliente.nome}</Linha>
        <Linha k="E-mail">{pedido.cliente.email}</Linha>
        <Linha k="Telefone">{pedido.cliente.tel || "Não informado"}</Linha>
        {pedido.retirada && (
          <Linha k="Retirada">{fmtDate(pedido.retirada)}</Linha>
        )}
        {pedido.devolucao && (
          <Linha k="Devolução">{fmtDate(pedido.devolucao)}</Linha>
        )}
        <Linha k="Valor estimado">{money(pedido.valorEstimado)}</Linha>
        {pedido.observacoes && (
          <p className="mt-4 text-sm text-text-sub break-words">
            {pedido.observacoes}
          </p>
        )}
        {pedido.motivoRecusa && (
          <p className="text-sm text-text-sub">
            Motivo da recusa: {pedido.motivoRecusa}
          </p>
        )}
        {pedido.transId && (
          <Link
            to="/sistema/locacoes"
            className="inline-block mt-4 text-gold-text underline"
          >
            Abrir vendas e locações
          </Link>
        )}
        <h3 className="mt-6 text-base font-medium">Histórico</h3>
        <ol className="list-none p-0 text-sm text-text-sub">
          {pedido.historico.map((h, i) => (
            <li className="py-2 border-b border-border-soft" key={i}>
              <time>{dataHora(h.em)}</time> · {h.status}
              {h.nota ? " · " + h.nota : ""}
            </li>
          ))}
        </ol>
        {!terminal && (
          <div className="mt-6">
            {recusando ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  action("Recusado", motivo.trim());
                }}
              >
                <Field label="Motivo da recusa">
                  <TextArea
                    required
                    minLength={2}
                    maxLength={2000}
                    value={motivo}
                    onChange={(e) => setMotivo(e.target.value)}
                  />
                </Field>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    size="compact"
                    disabled={motivo.trim().length < 2}
                  >
                    Confirmar recusa
                  </Button>
                  <Button
                    size="compact"
                    variant="ghost"
                    onClick={() => setRecusando(false)}
                  >
                    Voltar
                  </Button>
                </div>
              </form>
            ) : (
              <>
                <p className="text-sm text-text-sub">
                  A aprovação cria um rascunho. A reserva ou baixa acontece ao
                  confirmar a operação em Vendas e Locações.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Button size="compact" onClick={() => action("Aprovado")}>
                    {busy ? "Aguarde…" : "Aprovar pedido"}
                  </Button>
                  {pedido.status === "Novo" && (
                    <Button
                      size="compact"
                      variant="ghost"
                      onClick={() => action("Em análise")}
                    >
                      Marcar em análise
                    </Button>
                  )}
                  <Button
                    size="compact"
                    variant="ghost"
                    onClick={() => setRecusando(true)}
                  >
                    Recusar
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </fieldset>
    </Drawer>
  );
}
