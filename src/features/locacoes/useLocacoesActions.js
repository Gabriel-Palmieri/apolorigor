import { useState } from 'react';
import { updateData } from '../../data/appData.js';
import { nextId } from '../../domain/ids.js';
import { proximoStatusContrato } from '../../domain/statuses.js';
import { contagemVariante, checkDisponibilidade } from '../../domain/rules.js';
function ajusteParaTamanho(ajustes, produtoId, tamPedido, tamEntregue, transId, entrega) {
  if (tamPedido === tamEntregue) return ajustes;
  return [...ajustes, {
    id: nextId(ajustes),
    produtoId,
    transId,
    desc: `Ajuste de caimento: peça retirada no tamanho ${tamEntregue} para atender pedido do tamanho ${tamPedido}.`,
    tamOriginal: tamPedido,
    tamEntregue,
    entrega: entrega || '',
    status: 'Pendente'
  }];
}
export function useLocacoesActions(onHistorico) {
  const [erro, setErro] = useState('');
  const executar = operation => {
    try {
      updateData(operation);
      setErro('');
      return true;
    } catch (e) {
      setErro(e.message);
      return false;
    }
  };
  const base = (state, f) => ({
    id: nextId(state.trans),
    cliente: f.cliente,
    tel: f.tel,
    documento: f.documento || '',
    valor: f.valor,
    data: new Date().toISOString().slice(0, 10),
    avarias: '',
    noivos: '',
    dataEvento: '',
    integrantes: []
  });
  const registrarVenda = f => {
    const ok = executar(state => {
      const produto = state.produtos.find(p => p.id === f.produtoId);
      if (!produto || contagemVariante(produto, f.tam, state.trans, state.ajustes).disponivel < 1) throw new Error('A peça não está mais disponível. Atualize a seleção.');
      const t = {
        ...base(state, f),
        tipo: 'venda',
        produtoId: f.produtoId,
        tamPedido: f.tam,
        tamEntregue: f.tam,
        retirada: null,
        devolucao: null,
        devolvido: null,
        contrato: 'Confirmado'
      };
      return {
        ...state,
        trans: [...state.trans, t],
        produtos: state.produtos.map(p => p.id !== f.produtoId ? p : {
          ...p,
          variantes: p.variantes.map(v => v.tam === f.tam ? {
            ...v,
            qtd: v.qtd - 1
          } : v)
        })
      };
    });
    if (ok) onHistorico();
    return ok;
  };
  const registrarLocacao = f => {
    const ok = executar(state => {
      const produto = state.produtos.find(p => p.id === f.produtoId);
      if (!produto || !checkDisponibilidade(produto, f.tamEntregue, f.retirada, f.devolucao, state.trans, state.ajustes).disponivel) throw new Error('A disponibilidade mudou. Confira as datas e o tamanho novamente.');
      const t = {
        ...base(state, f),
        tipo: 'locacao_avulsa',
        produtoId: f.produtoId,
        tamPedido: f.tamPedido,
        tamEntregue: f.tamEntregue,
        retirada: f.retirada,
        devolucao: f.devolucao,
        devolvido: false,
        contrato: 'Rascunho'
      };
      return {
        ...state,
        trans: [...state.trans, t],
        ajustes: f.precisaAjuste ? ajusteParaTamanho(state.ajustes, f.produtoId, f.tamPedido, f.tamEntregue, t.id, f.retirada) : state.ajustes
      };
    });
    if (ok) onHistorico();
    return ok;
  };
  const registrarPadronizada = f => executar(state => {
    const t = {
      ...base(state, f),
      tipo: 'locacao_padronizada',
      produtoId: null,
      tamPedido: '',
      tamEntregue: '',
      retirada: f.retirada,
      devolucao: f.devolucao,
      devolvido: false,
      contrato: 'Rascunho',
      noivos: f.noivos,
      dataEvento: f.dataEvento,
      dataFechamento: f.dataFechamento,
      limiteComparecimento: f.limiteComparecimento,
      trajeConfidencial: false,
      integrantes: f.integrantes
    };
    const ajustes = f.integrantes.reduce((arr, i) => i.precisaAjuste ? ajusteParaTamanho(arr, i.produtoId, i.tam, i.tamEntregue, t.id, f.retirada) : arr, state.ajustes);
    return {
      ...state,
      trans: [...state.trans, t],
      ajustes
    };
  });
  const onAvancarContrato = id => executar(state => {
    return {
      ...state,
      trans: state.trans.map(t => {
        return t.id === id ? {
          ...t,
          contrato: proximoStatusContrato(t.contrato)
        } : t;
      })
    };
  });
  return {
    erro,
    registrarVenda,
    registrarLocacao,
    registrarPadronizada,
    onAvancarContrato
  };
}
