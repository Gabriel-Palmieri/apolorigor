import { TableViewport } from "../../shared/ui/Table.jsx";
import { SectionTitle } from "../../shared/ui/Typography.jsx";
import { TH, TD } from "../../shared/ui/Surfaces.jsx";
import { Input, Select } from "../../shared/ui/Form.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Alert } from "../../shared/ui/Feedback.jsx";
import { useState } from 'react';
import { fmt } from '../../shared/lib/format.js';
import { buscarTamanhoComFlexibilidade } from '../../domain/rules.js';
import { addDays } from '../../shared/lib/dates.js';
import { PAPEIS_PADRONIZADO as PAPEIS } from '../../domain/locacoes.js';
export default function LocacaoPadronizada({
  produtos,
  trans,
  ajustes,
  registrarPadronizada
}) {
  const EMPTY_HEAD = {
    noivos: '',
    dataEvento: '',
    limiteComparecimento: '',
    cliente: '',
    tel: ''
  };
  const EMPTY_INT = {
    nome: '',
    documento: '',
    papel: 'Padrinho',
    produtoId: '',
    tam: ''
  };
  const [head, setHead] = useState(EMPTY_HEAD);
  const [integrantes, setIntegrantes] = useState([]);
  const [novo, setNovo] = useState(EMPTY_INT);
  const [resultado, setResultado] = useState(null);
  const produtoNovoSel = produtos.find(p => p.id === Number(novo.produtoId));
  const tamOptionsNovo = (produtoNovoSel?.variantes || []).map(v => v.tam);
  const addIntegrante = () => {
    if (!novo.nome || !novo.produtoId || !novo.tam) return;
    setIntegrantes(prev => [...prev, {
      ...novo,
      produtoId: Number(novo.produtoId)
    }]);
    setNovo(EMPTY_INT);
    setResultado(null);
  };
  const removeIntegrante = idx => {
    setIntegrantes(prev => prev.filter((_, i) => i !== idx));
    setResultado(null);
  };
  const verificar = () => {
    if (!head.noivos || !head.dataEvento || !head.limiteComparecimento || integrantes.length === 0) {
      setResultado({
        erro: 'Preencha os dados do evento, o limite para comparecimento e adicione ao menos um integrante.'
      });
      return;
    }
    const retirada = head.dataEvento;
    const devolucao = addDays(head.dataEvento, 3);
    const checagens = integrantes.map(i => {
      const produto = produtos.find(p => p.id === i.produtoId);
      const r = buscarTamanhoComFlexibilidade(produto, i.tam, retirada, devolucao, trans, ajustes);
      return {
        integrante: i,
        produto,
        ...r
      };
    });
    const indisponiveis = checagens.filter(c => !c.disponivel);
    if (indisponiveis.length > 0) {
      setResultado({
        erro: `Indisponibilidade: ${indisponiveis.map(c => `${c.integrante.nome} (${c.produto.nome} tam. ${c.integrante.tam})`).join('; ')}.`
      });
      return;
    }
    const valorTotal = checagens.reduce((s, c) => s + (c.produto.aluguel || 0), 0);
    setResultado({
      disponivel: true,
      checagens,
      valorTotal,
      retirada,
      devolucao
    });
  };
  const confirmar = () => {
    if (!resultado?.disponivel) return;
    if (!registrarPadronizada({
      ...head,
      cliente: head.cliente || head.noivos,
      valor: resultado.valorTotal,
      retirada: resultado.retirada,
      devolucao: resultado.devolucao,
      dataFechamento: new Date().toISOString().slice(0, 10),
      integrantes: resultado.checagens.map(c => ({
        nome: c.integrante.nome,
        documento: c.integrante.documento,
        papel: c.integrante.papel,
        produtoId: c.produto.id,
        tam: c.integrante.tam,
        tamEntregue: c.tam,
        precisaAjuste: c.precisaAjuste,
        numeroContrato: '',
        precoNegociado: c.produto.aluguel,
        excecaoPreco: '',
        pagamento: 'Pendente',
        devolvido: false,
        avarias: ''
      }))
    })) return;
    setHead(EMPTY_HEAD);
    setIntegrantes([]);
    setResultado(null);
  };
  return <div>
      <SectionTitle>NOVO PACOTE — NOIVOS, PADRINHOS, PAIS E PAJENS</SectionTitle>
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-y-0 gap-x-3.5">
        <Input label="Nome dos Noivos" value={head.noivos} onChange={e => {
        setHead(x => ({
          ...x,
          noivos: e.target.value
        }));
        setResultado(null);
      }} placeholder="Ex: Marcos Silva & Ana Andrade" />
        <Input label="Data do Evento" type="date" value={head.dataEvento} onChange={e => {
        setHead(x => ({
          ...x,
          dataEvento: e.target.value
        }));
        setResultado(null);
      }} />
        <Input label="Limite para Comparecimento" type="date" value={head.limiteComparecimento} onChange={e => {
        setHead(x => ({
          ...x,
          limiteComparecimento: e.target.value
        }));
        setResultado(null);
      }} />
        <Input label="Contato responsável" value={head.cliente} onChange={e => setHead(x => ({
        ...x,
        cliente: e.target.value
      }))} placeholder="Nome do cerimonial / responsável" />
        <Input label="Telefone" value={head.tel} onChange={e => setHead(x => ({
        ...x,
        tel: e.target.value
      }))} placeholder="(11) 99999-9999" />
      </div>

      <div className="mt-4 mx-0 mb-2.5 p-3.5 bg-bg-elevated border border-border rounded-card">
        <p className="text-micro text-gold-text font-bold tracking-wide mt-0 mx-0 mb-2.5">ADICIONAR PESSOA AUTORIZADA A RETIRAR O TRAJE</p>
        <div className="grid grid-cols-1 wide:grid-cols-rental-row gap-y-0 gap-x-2.5 items-end">
          <Input label="Nome completo" value={novo.nome} onChange={e => setNovo(x => ({
          ...x,
          nome: e.target.value
        }))} placeholder="Nome" />
          <Input label="Documento" value={novo.documento} onChange={e => setNovo(x => ({
          ...x,
          documento: e.target.value
        }))} placeholder="CPF" />
          <Select label="Papel" value={novo.papel} onChange={e => setNovo(x => ({
          ...x,
          papel: e.target.value
        }))} options={PAPEIS} />
          <Select label="Traje (padronização)" value={novo.produtoId} onChange={e => setNovo(x => ({
          ...x,
          produtoId: e.target.value,
          tam: ''
        }))} options={produtos.map(p => ({
          value: p.id,
          label: `${p.nome} — ${p.cor}`
        }))} />
          <Select label="Tam." value={novo.tam} onChange={e => setNovo(x => ({
          ...x,
          tam: e.target.value
        }))} options={tamOptionsNovo} />
          <div className="mb-3"><Button onClick={addIntegrante} size="compact" variant="ghost">+ Adicionar</Button></div>
        </div>
      </div>

      {integrantes.length > 0 && <TableViewport><table className="w-full border-collapse text-xs mb-3.5">
          <thead><tr><TH>Nome</TH><TH>Documento</TH><TH>Papel</TH><TH>Traje</TH><TH>Tam.</TH><TH></TH></tr></thead>
          <tbody>
            {integrantes.map((i, idx) => {
            const produto = produtos.find(p => p.id === i.produtoId);
            return <tr key={idx}>
                  <TD>{i.nome}</TD><TD>{i.documento || '—'}</TD><TD>{i.papel}</TD>
                  <TD>{produto ? `${produto.nome} — ${produto.cor}` : '—'}</TD><TD>{i.tam}</TD>
                  <TD><Button color="var(--status-red-fg)" onClick={() => removeIntegrante(idx)} size="compact" variant="ghost">Remover</Button></TD>
                </tr>;
          })}
          </tbody>
        </table></TableViewport>}

      {resultado?.erro && <Alert tone="error">{resultado.erro}</Alert>}
      {resultado?.disponivel && <Alert tone="success">
          Disponibilidade confirmada para todos os {resultado.checagens.length} trajes.
          {resultado.checagens.some(c => c.precisaAjuste) && ' Alguns itens usarão tamanho maior e serão encaminhados ao Ateliê para ajuste.'}
          {' '}Valor total estimado: R$ {fmt(resultado.valorTotal)}.
        </Alert>}

      <div className="flex gap-2">
        {!resultado?.disponivel && <Button onClick={verificar} size="compact">Checar Disponibilidade (Anuário)</Button>}
        {resultado?.disponivel && <Button onClick={confirmar} size="compact">Cadastrar Pacote</Button>}
        {resultado && <Button onClick={() => setResultado(null)} size="compact" variant="ghost">Refazer verificação</Button>}
      </div>
    </div>;
}
