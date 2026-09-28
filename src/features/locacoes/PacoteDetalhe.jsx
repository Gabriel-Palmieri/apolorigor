import { usePacoteDetalhe } from "./usePacoteDetalhe.js";
import { PortalNoivoPreview } from "./PortalPreview.jsx";
import { CategoriaCard } from "./CategoriaCard.jsx";
import { ParticipanteRow } from "./ParticipanteRow.jsx";
import { EditarIntegranteModal } from "./IntegranteModal.jsx";
import { Card } from "../../shared/ui/Surfaces.jsx";
import { Heading } from "../../shared/ui/Typography.jsx";
import { Input, Select } from "../../shared/ui/Form.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Alert } from "../../shared/ui/Feedback.jsx";
import { Modal } from "../../shared/ui/Modal.jsx";
import { TickRule } from "../../shared/ui/Tape.jsx";
import { cn } from "../../shared/lib/cn.js";
import { C } from "../../shared/ui/palette.js";
import { PAPEIS_PADRONIZADO as PAPEIS } from '../../domain/locacoes.js';
import { fmtDate } from '../../shared/lib/format.js';
// ── "□ Pacote selecionado" — detalhe completo de um pacote ──────────
export default function PacoteDetalhe({
  t,
  produtos,
  trans,
  setTrans,
  ajustes,
  setAjustes,
  onVoltar
}) {
  const {
    integrantes,
    alerta,
    total,
    compareceram,
    categorias,
    addAberto,
    setAddAberto,
    addForm,
    setAddForm,
    addErro,
    editandoIdx,
    setEditandoIdx,
    portalAberto,
    setPortalAberto,
    tamOptionsAdd,
    confirmarAdicao,
    salvarEdicao,
    toggleTrajeConfidencial
  } = usePacoteDetalhe({
    t,
    produtos,
    trans,
    setTrans,
    ajustes,
    setAjustes
  });
  return <div>
      <Button onClick={onVoltar} size="compact" variant="ghost">← Voltar aos pacotes</Button>

      <div className="flex justify-between items-start mt-4 mx-0 mb-1.5 flex-wrap gap-3">
        <div>
          <p className="m-0 text-micro font-bold tracking-widest text-gold-text">APOLLO RIGOR</p>
          <p className="mt-1 mx-0 mb-1 font-display text-3xl font-bold text-text uppercase">{t.noivos}</p>
          <p className="m-0 text-xs text-text-sub">Evento em {fmtDate(t.dataEvento)}</p>
        </div>
        <Button onClick={() => setAddAberto(true)} size="compact">+ Adicionar participante</Button>
      </div>

      {alerta && <Alert tone="warn">{alerta.texto}</Alert>}

      <div className="grid grid-cols-2 desktop:grid-cols-4 gap-3 mt-3.5 mx-0 mb-4">
        {[{
        label: 'Fechamento do pacote',
        val: fmtDate(t.dataFechamento)
      }, {
        label: 'Data do evento',
        val: fmtDate(t.dataEvento)
      }, {
        label: 'Limite para comparecimento',
        val: fmtDate(t.limiteComparecimento)
      }, {
        label: 'Preços por categoria',
        val: `${categorias.length} definido${categorias.length !== 1 ? 's' : ''}`
      }].map(c => <div key={c.label} className="bg-card border border-border rounded-card pt-3 px-3.5 pb-3.5">
            <TickRule className="h-1 mb-2" />
            <p className="mt-0 mx-0 mb-1.5 text-micro font-semibold tracking-widest text-text-sub font-mono tabular-nums uppercase">{c.label}</p>
            <p className="m-0 text-compact font-medium text-text font-mono tabular-nums">{c.val}</p>
          </div>)}
      </div>

      <div className="grid grid-cols-1 desktop:grid-cols-dashboard gap-4 items-start">
        <div>
          <Card className="mb-4">
            <div className="flex justify-between items-start mb-3.5 flex-wrap gap-2.5">
              <div>
                <p className="m-0 text-micro font-bold tracking-widest text-gold-text">PADRONIZAÇÃO DO GRUPO</p>
                <Heading size={16} className="mt-1">Roupa e preço por categoria</Heading>
              </div>
              <Button size="compact" variant="ghost">Alterar roupas e preços</Button>
            </div>
            {categorias.length === 0 ? <p className="text-text-sub text-compact">Nenhuma categoria definida ainda.</p> : <div className="grid grid-cols-tiles gap-3.5">
                {categorias.map(c => <CategoriaCard key={c.papel} papel={c.papel} produto={c.produto} preco={c.preco} confidencial={t.trajeConfidencial} />)}
              </div>}
          </Card>

          <Card>
            <div className="flex justify-between items-baseline mb-1.5 flex-wrap gap-2">
              <div>
                <p className="m-0 text-micro font-bold tracking-widest text-gold-text">CONTRATOS INDIVIDUAIS</p>
                <Heading size={16} className="mt-1">Participantes</Heading>
              </div>
              <p className="m-0 text-caption text-text-sub">{compareceram}/{total} compareceram</p>
            </div>
            {integrantes.length === 0 ? <p className="text-text-sub text-compact">Nenhum participante neste pacote ainda.</p> : integrantes.map((i, idx) => <ParticipanteRow key={idx} integrante={i} produto={produtos.find(p => p.id === i.produtoId)} onEditar={() => setEditandoIdx(idx)} />)}
          </Card>
        </div>

        <div>
          <Card className="border-gold-dim mb-3.5">
            <p className="m-0 text-micro font-bold tracking-widest text-gold-text">ACESSO EXCLUSIVO</p>
            <Heading size={19} className="mt-1.5 mx-0 mb-2">Portal do noivo</Heading>
            <p className="mt-0 mx-0 mb-3 text-caption text-text-sub">Este endereço mostra somente este pacote e seus participantes.</p>
            <div className="bg-bg-elevated border border-border rounded-card py-2 px-2.5 text-micro text-gold-text break-all mb-2.5">
              https://portal-do-noivo.apollorigor.com.br/pacote/{t.id}
            </div>
            <Button onClick={() => setPortalAberto(true)} color={C.gold} size="compact" variant="ghost">Pré-visualizar portal do noivo</Button>
          </Card>

          <Card>
            <div className="flex justify-between items-center">
              <div>
                <p className="m-0 font-semibold text-compact text-text">Traje confidencial</p>
                <p className="mt-0.5 mx-0 mb-0 text-caption text-text-sub">Oculto no acesso compartilhado</p>
              </div>
              <button onClick={toggleTrajeConfidencial} className={cn("py-1.5 px-3 rounded-control border-0 cursor-pointer text-caption font-semibold", t.trajeConfidencial ? "bg-gold" : "bg-border", t.trajeConfidencial ? "text-accent-ink" : "text-text-sub")}>{t.trajeConfidencial ? 'Ativado' : 'Desativado'}</button>
            </div>
          </Card>
        </div>
      </div>

      {addAberto && <Modal title="Adicionar participante" onClose={() => setAddAberto(false)}>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-y-0 gap-x-3.5">
            <Input label="Nome completo" value={addForm.nome} onChange={e => setAddForm(x => ({
          ...x,
          nome: e.target.value
        }))} placeholder="Nome" />
            <Input label="Documento" value={addForm.documento} onChange={e => setAddForm(x => ({
          ...x,
          documento: e.target.value
        }))} placeholder="CPF" />
            <Select label="Papel" value={addForm.papel} onChange={e => setAddForm(x => ({
          ...x,
          papel: e.target.value
        }))} options={PAPEIS} />
            <Select label="Traje" value={addForm.produtoId} onChange={e => setAddForm(x => ({
          ...x,
          produtoId: e.target.value,
          tam: ''
        }))} options={produtos.map(p => ({
          value: p.id,
          label: `${p.nome} — ${p.cor}`
        }))} />
            <Select label="Tam." value={addForm.tam} onChange={e => setAddForm(x => ({
          ...x,
          tam: e.target.value
        }))} options={tamOptionsAdd} />
          </div>
          {addErro && <Alert tone="error">{addErro}</Alert>}
          <Button onClick={confirmarAdicao} size="compact">Checar disponibilidade e adicionar</Button>
        </Modal>}

      {editandoIdx !== null && <EditarIntegranteModal integrante={integrantes[editandoIdx]} onClose={() => setEditandoIdx(null)} onSalvar={dados => salvarEdicao(editandoIdx, dados)} />}

      {portalAberto && <PortalNoivoPreview t={t} produtos={produtos} onClose={() => setPortalAberto(false)} />}
    </div>;
}

// ── Aba "Pacotes Padronizados": menu lateral + modal de cadastro ────
