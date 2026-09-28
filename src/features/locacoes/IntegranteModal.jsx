import { Input, Select } from "../../shared/ui/Form.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Alert } from "../../shared/ui/Feedback.jsx";
import { Modal } from "../../shared/ui/Modal.jsx";
import { PAGAMENTO_OPCOES } from '../../domain/locacoes.js';
import { useState } from 'react';
// ── Modal "Atualizar [Nome]" ──────────────────────────────────────────
function EditarIntegranteModal({
  integrante,
  onClose,
  onSalvar
}) {
  const [f, setF] = useState({
    numeroContrato: integrante.numeroContrato || '',
    precoNegociado: integrante.precoNegociado ?? '',
    excecaoPreco: integrante.excecaoPreco === '' || integrante.excecaoPreco == null ? '' : integrante.excecaoPreco,
    pagamento: integrante.pagamento || 'Pendente'
  });
  const salvar = () => onSalvar({
    numeroContrato: f.numeroContrato,
    precoNegociado: Number(f.precoNegociado) || 0,
    excecaoPreco: f.excecaoPreco === '' ? '' : Number(f.excecaoPreco),
    pagamento: f.pagamento
  });
  return <Modal title={`Atualizar ${integrante.nome}`} onClose={onClose}>
      <p className="-mt-2 mx-0 mb-4 text-xs text-text-sub">Vincule o contrato quando a pessoa comparecer e fizer a locação.</p>

      <Input label="Número do contrato" value={f.numeroContrato} onChange={e => setF(x => ({
      ...x,
      numeroContrato: e.target.value
    }))} placeholder="Ex: 1409" />

      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-y-0 gap-x-3.5">
        <Input label="Preço negociado do pacote" type="number" value={f.precoNegociado} onChange={e => setF(x => ({
        ...x,
        precoNegociado: e.target.value
      }))} />
        <Input label="Exceção de preço" type="number" value={f.excecaoPreco} onChange={e => setF(x => ({
        ...x,
        excecaoPreco: e.target.value
      }))} placeholder="Somente se for diferente" />
      </div>

      <Select label="Pagamento" value={f.pagamento} onChange={e => setF(x => ({
      ...x,
      pagamento: e.target.value
    }))} options={PAGAMENTO_OPCOES} />

      {f.numeroContrato && !integrante.numeroContrato && <Alert tone="info">Ao salvar um número de contrato, o participante será considerado comparecido automaticamente.</Alert>}

      <Button onClick={salvar} size="compact">Salvar atualização</Button>
    </Modal>;
}

// ── Portal do Noivo — página pública (somente leitura) por pacote ───
export { EditarIntegranteModal };
