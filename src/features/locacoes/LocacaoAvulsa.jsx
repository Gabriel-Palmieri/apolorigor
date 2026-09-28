import { Card } from "../../shared/ui/Surfaces.jsx";
import { SectionTitle } from "../../shared/ui/Typography.jsx";
import { Input, Select } from "../../shared/ui/Form.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Alert } from "../../shared/ui/Feedback.jsx";
import { useState } from 'react';
import { fmtDate } from '../../shared/lib/format.js';
import { buscarTamanhoComFlexibilidade } from '../../domain/rules.js';
export default function LocacaoAvulsa({
  produtos,
  trans,
  ajustes,
  registrarLocacao
}) {
  const EMPTY = {
    produtoId: '',
    tam: '',
    cliente: '',
    tel: '',
    documento: '',
    retirada: '',
    devolucao: '',
    valor: ''
  };
  const [f, setF] = useState(EMPTY);
  const [resultado, setResultado] = useState(null);
  const produtoSel = produtos.find(p => p.id === Number(f.produtoId));
  const tamOptions = (produtoSel?.variantes || []).map(v => v.tam);
  const verificar = () => {
    if (!produtoSel || !f.tam || !f.retirada || !f.devolucao) {
      setResultado({
        erro: 'Preencha peça, tamanho e datas para checar a agenda.'
      });
      return;
    }
    const r = buscarTamanhoComFlexibilidade(produtoSel, f.tam, f.retirada, f.devolucao, trans, ajustes);
    if (!r.disponivel) {
      setResultado({
        erro: `Indisponibilidade: "${produtoSel.nome}" (${produtoSel.cor}) tamanho ${f.tam} está esgotado para o período de ${fmtDate(f.retirada)} a ${fmtDate(f.devolucao)}, mesmo considerando tamanhos maiores.`
      });
      return;
    }
    setResultado(r);
  };
  const confirmar = () => {
    if (!resultado?.disponivel || !f.cliente || !f.valor) return;
    if (!registrarLocacao({
      produtoId: produtoSel.id,
      tamPedido: f.tam,
      tamEntregue: resultado.tam,
      precisaAjuste: resultado.precisaAjuste,
      cliente: f.cliente,
      tel: f.tel,
      documento: f.documento,
      retirada: f.retirada,
      devolucao: f.devolucao,
      valor: Number(f.valor)
    })) return;
    setF(EMPTY);
    setResultado(null);
  };
  return <Card className="border-gold-dim">
      <SectionTitle>LOCAÇÃO AVULSA — ALUGUEL INDIVIDUAL DE PEÇA</SectionTitle>
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-y-0 gap-x-3.5">
        <Select label="Peça (modelo + cor)" value={f.produtoId} onChange={e => {
        const p = produtos.find(x => x.id === Number(e.target.value));
        setF(x => ({
          ...x,
          produtoId: e.target.value,
          tam: '',
          valor: p?.aluguel ?? ''
        }));
        setResultado(null);
      }} options={produtos.map(p => ({
        value: p.id,
        label: `${p.nome} — ${p.cor}`
      }))} />
        <Select label="Tamanho desejado" value={f.tam} onChange={e => {
        setF(x => ({
          ...x,
          tam: e.target.value
        }));
        setResultado(null);
      }} options={tamOptions} />
        <Input label="Data de Retirada" type="date" value={f.retirada} onChange={e => {
        setF(x => ({
          ...x,
          retirada: e.target.value
        }));
        setResultado(null);
      }} />
        <Input label="Data Prevista de Devolução" type="date" value={f.devolucao} onChange={e => {
        setF(x => ({
          ...x,
          devolucao: e.target.value
        }));
        setResultado(null);
      }} />
        <Input label="Nome do Cliente" value={f.cliente} onChange={e => setF(x => ({
        ...x,
        cliente: e.target.value
      }))} placeholder="Nome completo" />
        <Input label="Telefone" value={f.tel} onChange={e => setF(x => ({
        ...x,
        tel: e.target.value
      }))} placeholder="(11) 99999-9999" />
        <Input label="Documento (CPF)" value={f.documento} onChange={e => setF(x => ({
        ...x,
        documento: e.target.value
      }))} placeholder="000.000.000-00" />
        <Input label="Valor do Aluguel (R$)" type="number" value={f.valor} onChange={e => setF(x => ({
        ...x,
        valor: e.target.value
      }))} placeholder="0,00" />
      </div>

      {resultado?.erro && <Alert tone="error">{resultado.erro}</Alert>}
      {resultado?.disponivel && resultado.precisaAjuste && <Alert tone="warn">
          Tamanho {f.tam} esgotado. Encontramos disponibilidade no tamanho {resultado.tam}. A peça será liberada para locação e encaminhada automaticamente ao Ateliê para ajuste.
        </Alert>}
      {resultado?.disponivel && !resultado.precisaAjuste && <Alert tone="success">Disponibilidade confirmada na agenda do Anuário para o período selecionado.</Alert>}

      <div className="flex gap-2">
        {!resultado?.disponivel && <Button onClick={verificar} size="compact">Checar Disponibilidade (Anuário)</Button>}
        {resultado?.disponivel && <Button onClick={confirmar} size="compact">Gerar Contrato de Locação</Button>}
        {resultado && <Button onClick={() => setResultado(null)} size="compact" variant="ghost">Refazer verificação</Button>}
      </div>
    </Card>;
}
