import { Card } from "../../shared/ui/Surfaces.jsx";
import { SectionTitle } from "../../shared/ui/Typography.jsx";
import { Input, Select } from "../../shared/ui/Form.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { useState, useMemo } from 'react';
import { contagemVariante } from '../../domain/rules.js';
export default function VendaAvulsa({
  produtos,
  trans,
  ajustes,
  registrarVenda
}) {
  const disponiveis = useMemo(() => {
    const list = [];
    produtos.forEach(p => (p.variantes || []).forEach(v => {
      if (contagemVariante(p, v.tam, trans, ajustes).disponivel > 0) {
        list.push({
          key: `${p.id}|${v.tam}`,
          produtoId: p.id,
          tam: v.tam,
          produto: p
        });
      }
    }));
    return list;
  }, [produtos, trans, ajustes]);
  const EMPTY = {
    key: '',
    cliente: '',
    tel: '',
    documento: '',
    valor: ''
  };
  const [f, setF] = useState(EMPTY);
  const submit = () => {
    const sel = disponiveis.find(d => d.key === f.key);
    if (!sel || !f.cliente || !f.valor) return;
    if (!registrarVenda({
      produtoId: sel.produtoId,
      tam: sel.tam,
      cliente: f.cliente,
      tel: f.tel,
      documento: f.documento,
      valor: Number(f.valor)
    })) return;
    setF(EMPTY);
  };
  return <Card className="border-gold-dim">
      <SectionTitle>VENDA AVULSA — REGISTRO DIRETO DE VENDA DO ESTOQUE</SectionTitle>
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-y-0 gap-x-3.5">
        <Select label="Peça (disponíveis em estoque)" value={f.key} onChange={e => {
        const sel = disponiveis.find(d => d.key === e.target.value);
        setF(x => ({
          ...x,
          key: e.target.value,
          valor: sel?.produto.venda ?? ''
        }));
      }} options={disponiveis.map(d => ({
        value: d.key,
        label: `${d.produto.nome} (${d.tam} — ${d.produto.cor})`
      }))} />
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
        <Input label="Valor da Venda (R$)" type="number" value={f.valor} onChange={e => setF(x => ({
        ...x,
        valor: e.target.value
      }))} placeholder="0,00" />
      </div>
      <Button onClick={submit} size="compact">Confirmar Venda</Button>
    </Card>;
}
