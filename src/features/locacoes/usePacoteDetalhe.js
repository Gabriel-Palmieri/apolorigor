import { getData } from '../../data/appData.js';
import { nextId } from '../../domain/ids.js';
import { useState } from 'react';
import { buscarTamanhoComFlexibilidade, alertaPacote, comparecimentoPacote } from '../../domain/rules.js';
import { categoriasDoGrupo } from '../../domain/pacotes.js';
// ── "□ Pacote selecionado" — detalhe completo de um pacote ──────────
export function usePacoteDetalhe({
  t,
  produtos,
  trans,
  setTrans,
  ajustes,
  setAjustes
}) {
  const integrantes = t.integrantes || [];
  const alerta = alertaPacote(t);
  const {
    total,
    compareceram
  } = comparecimentoPacote(t);
  const categorias = categoriasDoGrupo(integrantes, produtos);
  const EMPTY_ADD = {
    nome: '',
    documento: '',
    papel: 'Padrinho',
    produtoId: '',
    tam: ''
  };
  const [addAberto, setAddAberto] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_ADD);
  const [addErro, setAddErro] = useState('');
  const [editandoIdx, setEditandoIdx] = useState(null);
  const [portalAberto, setPortalAberto] = useState(false);
  const produtoAddSel = produtos.find(p => p.id === Number(addForm.produtoId));
  const tamOptionsAdd = (produtoAddSel?.variantes || []).map(v => v.tam);
  const confirmarAdicao = () => {
    if (!addForm.nome || !addForm.produtoId || !addForm.tam) {
      setAddErro('Preencha nome, traje e tamanho.');
      return;
    }
    const produto = produtos.find(p => p.id === Number(addForm.produtoId));
    const r = buscarTamanhoComFlexibilidade(produto, addForm.tam, t.retirada, t.devolucao, trans, ajustes);
    if (!r.disponivel) {
      setAddErro(`"${produto.nome}" tamanho ${addForm.tam} está esgotado, mesmo considerando tamanhos maiores.`);
      return;
    }
    setTrans(prev => prev.map(x => x.id !== t.id ? x : {
      ...x,
      integrantes: [...(x.integrantes || []), {
        nome: addForm.nome,
        documento: addForm.documento,
        papel: addForm.papel,
        produtoId: produto.id,
        tam: addForm.tam,
        tamEntregue: r.tam,
        numeroContrato: '',
        precoNegociado: produto.aluguel,
        excecaoPreco: '',
        pagamento: 'Pendente',
        devolvido: false,
        avarias: ''
      }]
    }));
    if (r.precisaAjuste) {
      setAjustes(prev => [...prev, {
        id: nextId(getData().ajustes),
        produtoId: produto.id,
        transId: t.id,
        desc: `Ajuste de caimento: peça retirada no tamanho ${r.tam} para atender pedido do tamanho ${addForm.tam}.`,
        tamOriginal: addForm.tam,
        tamEntregue: r.tam,
        entrega: t.retirada || '',
        status: 'Pendente'
      }]);
    }
    setAddForm(EMPTY_ADD);
    setAddAberto(false);
    setAddErro('');
  };
  const salvarEdicao = (idx, dados) => {
    setTrans(prev => prev.map(x => x.id !== t.id ? x : {
      ...x,
      integrantes: x.integrantes.map((i, iIdx) => iIdx === idx ? {
        ...i,
        ...dados
      } : i)
    }));
    setEditandoIdx(null);
  };
  const toggleTrajeConfidencial = () => {
    setTrans(prev => prev.map(x => x.id === t.id ? {
      ...x,
      trajeConfidencial: !x.trajeConfidencial
    } : x));
  };
  return {
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
    setAddErro,
    editandoIdx,
    setEditandoIdx,
    portalAberto,
    setPortalAberto,
    tamOptionsAdd,
    confirmarAdicao,
    salvarEdicao,
    toggleTrajeConfidencial
  };
}
