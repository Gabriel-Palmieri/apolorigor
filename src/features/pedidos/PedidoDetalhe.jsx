import { PEDIDO_MAP } from "../../shared/ui/status.js";
import { SectionTitle, Heading } from "../../shared/ui/Typography.jsx";
import { Chip, Badge, Alert } from "../../shared/ui/Feedback.jsx";
import { Drawer } from "../../shared/ui/Modal.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { TextArea } from "../../shared/ui/Form.jsx";
import { useState } from "react";
import { fmt, fmtDate } from "../../shared/lib/format.js";
import { atualizarStatus, aprovar as aprovarNoStore, TIPO_LABEL } from "../../features/pedidos/store.js";
const dataHora = ms => new Date(ms).toLocaleString("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit"
});
function Linha({
  k,
  children
}) {
  return <div className="flex justify-between gap-4 py-2 px-0 border-b border-b-border-soft text-xs">
      <span className="text-text-sub">{k}</span>
      <span className="text-text text-right font-medium">{children}</span>
    </div>;
}
function Detalhe({
  pedido,
  onClose
}) {
  const [motivo, setMotivo] = useState("");
  const [recusando, setRecusando] = useState(false);
  const jaAprovado = pedido.status === "Aprovado";
  const terminal = jaAprovado || pedido.status === "Recusado";
  const aprovar = () => {
    aprovarNoStore(pedido.id);
    onClose();
  };
  const emAnalise = () => atualizarStatus(pedido.id, "Em análise", "Em triagem pelo ateliê.");
  const recusar = () => {
    atualizarStatus(pedido.id, "Recusado", motivo.trim() || "Sem disponibilidade para o pedido.", {
      motivoRecusa: motivo.trim()
    });
    onClose();
  };
  return <Drawer title={pedido.protocolo} subtitle={`${TIPO_LABEL[pedido.tipo]} · recebido ${dataHora(pedido.criadoEm)}`} onClose={onClose} width={460}>
      <div className="flex gap-2 mb-4">
        <Badge label={pedido.status} map={PEDIDO_MAP} />
        {jaAprovado && pedido.transId && <Chip color="var(--status-green-fg)">
            Transação #{pedido.transId}
          </Chip>}
      </div>

      {pedido.foto && <div className="flex gap-3 mb-3.5">
          <div className="w-16 h-20 overflow-hidden border border-border rounded-control shrink-0">
            <img src={pedido.foto} alt="" onError={e => {
          e.currentTarget.hidden = true;
        }} className="w-full h-full object-cover block" />
          </div>
          <div>
            <Heading size={15}>
              {pedido.produtoNome || pedido.modeloBaseNome || "Modelo a definir"}
            </Heading>
            {pedido.cor && <p className="mt-0.5 mx-0 mb-0 text-xs text-text-sub">
                {pedido.cor}
                {pedido.tam ? ` · tam. ${pedido.tam}` : ""}
              </p>}
          </div>
        </div>}

      <SectionTitle className="mt-4 mx-0 mb-1.5">Cliente</SectionTitle>
      <Linha k="Nome">{pedido.cliente.nome}</Linha>
      <Linha k="E-mail">{pedido.cliente.email}</Linha>
      <Linha k="Telefone">{pedido.cliente.tel}</Linha>
      {pedido.cliente.documento && <Linha k="CPF">{pedido.cliente.documento}</Linha>}

      <SectionTitle className="mt-4 mx-0 mb-1.5">Pedido</SectionTitle>
      <Linha k="Modalidade">{TIPO_LABEL[pedido.tipo]}</Linha>
      {pedido.noivos && <Linha k="Noivos">{pedido.noivos}</Linha>}
      {pedido.dataEvento && <Linha k="Data do evento">{fmtDate(pedido.dataEvento)}</Linha>}
      {pedido.nIntegrantes != null && <Linha k="Integrantes">{pedido.nIntegrantes}</Linha>}
      {pedido.retirada && <Linha k="Retirada">{fmtDate(pedido.retirada)}</Linha>}
      {pedido.devolucao && <Linha k="Devolução">{fmtDate(pedido.devolucao)}</Linha>}
      <Linha k="Valor estimado">
        <span className="font-mono tabular-nums text-gold-text">
          R$ {fmt(pedido.valorEstimado || 0)}
        </span>
      </Linha>

      {pedido.observacoes && <>
          <SectionTitle className="mt-4 mx-0 mb-1.5">
            Observações do cliente
          </SectionTitle>
          <p className="text-xs text-text leading-normal bg-input-bg border border-border rounded-control py-2.5 px-3">
            {pedido.observacoes}
          </p>
        </>}

      <SectionTitle className="mt-5 mx-0 mb-2">Histórico</SectionTitle>
      {[...pedido.historico].reverse().map((h, i) => <div key={i} className="flex gap-2.5 text-xs text-text-sub py-1 px-0">
          <span className="font-mono tabular-nums text-text-muted whitespace-nowrap">
            {dataHora(h.em)}
          </span>
          <span>
            <b className="text-text">{h.status}</b>
            {h.nota ? ` — ${h.nota}` : ""}
          </span>
        </div>)}

      {!terminal && <div className="mt-5 pt-4 border-t border-t-border">
          {recusando ? <>
              <TextArea label="Motivo da recusa (enviado ao acompanhamento do cliente)" value={motivo} onChange={e => setMotivo(e.target.value)} placeholder="Ex.: modelo indisponível para a data. Propor alternativa em contato." />
              <div className="flex gap-2">
                <Button onClick={recusar} size="compact">
                  Confirmar recusa
                </Button>
                <Button onClick={() => setRecusando(false)} size="compact" variant="ghost">
                  Cancelar
                </Button>
              </div>
            </> : <>
              <Alert tone="info">
                Aprovar cria uma transação em <b>Vendas e Locações</b>{" "}
                (rascunho) já preenchida com os dados do pedido.
              </Alert>
              <div className="flex gap-2 flex-wrap">
                <Button onClick={aprovar} size="compact">
                  Aprovar e criar no sistema
                </Button>
                {pedido.status === "Novo" && <Button onClick={emAnalise} size="compact" variant="ghost">
                    Marcar em análise
                  </Button>}
                <Button color="var(--status-red-fg)" onClick={() => setRecusando(true)} size="compact" variant="ghost">
                  Recusar
                </Button>
              </div>
            </>}
        </div>}
    </Drawer>;
}
export { Linha, Detalhe, dataHora };
