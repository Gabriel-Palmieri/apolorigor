import { useState } from "react";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Input, Field, TextArea } from "../../shared/ui/formularios/Form.jsx";
import { Alert, Badge } from "../../shared/ui/feedback/Feedback.jsx";
import { fmtDate, money } from "../../shared/lib/format.js";
import { PAYMENT_STATUS, TRANSACTION_STATUS } from "../../data/adapters.js";
import { executarTransacao } from "../../data/transacoes.js";
const STATUS_MAP = {
  Rascunho: { tone: "grey" },
  Confirmado: { tone: "yellow" },
  Concluído: { tone: "green" },
  Cancelado: { tone: "grey" },
};
function TransacaoCard({ row, admin, onEdit }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [returning, setReturning] = useState(false);
  const [damageNotes, setDamageNotes] = useState("");
  const [paymentConfirm, setPaymentConfirm] = useState(false);
  async function action(name, body) {
    if (busy) return;
    if (name === "cancel" && !window.confirm("Cancelar esta operação?")) return;
    setBusy(true);
    setError("");
    try {
      await executarTransacao(row.id, name, body);
      setReturning(false);
      setPaymentConfirm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  const rental = row.type === "RENTAL";
  return (
    <article className="border-b border-border py-6 min-w-0" aria-busy={busy}>
      <div className="flex justify-between gap-4 flex-wrap">
        <div>
          <h3 className="m-0 text-base font-medium text-text">
            {row.variant.product.name} · {row.variant.size}
          </h3>
          <p className="mt-2 mb-0 text-sm text-text-sub">
            {rental ? "Locação" : "Venda"}
            {admin ? ` · ${row.cliente}` : ""} · {money(row.valor)}
          </p>
          {rental && (
            <p className="mt-2 text-sm text-text-sub">
              Retirada: {fmtDate(row.startDate)} · Devolução:{" "}
              {fmtDate(row.endDate)}
              {row.pickedUpAt ? " · Traje retirado" : ""}
            </p>
          )}
        </div>
        <Badge label={TRANSACTION_STATUS[row.status]} map={STATUS_MAP} />
      </div>
      {row.payment && (
        <p className="text-sm text-text-sub">
          Pagamento: {PAYMENT_STATUS[row.payment.status]} · simulado, sem
          cobrança real
        </p>
      )}
      {row.damageNotes && (
        <p className="text-sm break-words text-text-sub">
          Observações da devolução: {row.damageNotes}
        </p>
      )}
      {error && <Alert>{error}</Alert>}
      <div className="flex flex-wrap gap-2 mt-4">
        {admin && row.status === "DRAFT" && (
          <>
            <Button
              size="compact"
              disabled={busy}
              onClick={() => action("confirm")}
            >
              Confirmar operação
            </Button>
            <Button
              size="compact"
              variant="ghost"
              disabled={busy}
              onClick={() => onEdit(row)}
            >
              Editar rascunho
            </Button>
          </>
        )}
        {admin &&
          row.status === "CONFIRMED" &&
          (!rental ? (
            <Button
              size="compact"
              disabled={busy}
              onClick={() => action("deliver")}
            >
              Registrar entrega
            </Button>
          ) : row.pickedUpAt ? (
            <Button
              size="compact"
              disabled={busy}
              onClick={() => setReturning(true)}
            >
              Registrar devolução
            </Button>
          ) : (
            <Button
              size="compact"
              disabled={busy}
              onClick={() => action("pickup")}
            >
              Registrar retirada
            </Button>
          ))}
        {admin &&
          ["DRAFT", "CONFIRMED"].includes(row.status) &&
          !row.pickedUpAt && (
            <Button
              size="compact"
              variant="ghost"
              disabled={busy}
              onClick={() => action("cancel")}
            >
              Cancelar operação
            </Button>
          )}
        {!admin &&
          ["CONFIRMED", "COMPLETED"].includes(row.status) &&
          row.payment?.status === "PENDING" && (
            <Button
              size="compact"
              disabled={busy}
              onClick={() => setPaymentConfirm(true)}
            >
              Simular pagamento
            </Button>
          )}
      </div>
      {returning && (
        <form
          className="mt-5 max-w-lg"
          onSubmit={(e) => {
            e.preventDefault();
            action("return", { damageNotes });
          }}
        >
          <Field label="Observações da devolução">
            <TextArea
              maxLength={2000}
              value={damageNotes}
              onChange={(e) => setDamageNotes(e.target.value)}
            />
          </Field>
          <div className="flex gap-2">
            <Button type="submit" size="compact" disabled={busy}>
              Confirmar devolução
            </Button>
            <Button
              variant="ghost"
              size="compact"
              disabled={busy}
              onClick={() => setReturning(false)}
            >
              Voltar
            </Button>
          </div>
        </form>
      )}
      {paymentConfirm && (
        <div className="mt-5">
          <p className="text-sm text-text-sub">
            Esta ação registra um pagamento fictício. Nenhum valor será cobrado.
          </p>
          <Button
            size="compact"
            disabled={busy}
            onClick={() => action("checkout")}
          >
            Confirmar simulação
          </Button>
          <Button
            size="compact"
            variant="ghost"
            disabled={busy}
            onClick={() => setPaymentConfirm(false)}
          >
            Voltar
          </Button>
        </div>
      )}
    </article>
  );
}
export default function TransacaoLista({ rows, admin = false, onEdit }) {
  const [search, setSearch] = useState("");
  const visible = rows.filter((row) =>
    `${row.variant.product.name} ${row.cliente}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div>
      <Field label="Buscar operação">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Modelo ou cliente"
        />
      </Field>
      {!visible.length && (
        <p className="text-text-sub py-6" role="status">
          Nenhuma operação encontrada.
        </p>
      )}
      {visible.map((row) => (
        <TransacaoCard key={row.id} row={row} admin={admin} onEdit={onEdit} />
      ))}
    </div>
  );
}
