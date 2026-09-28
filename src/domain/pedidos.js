import { nextId } from './ids.js';
import { addDays } from '../shared/lib/dates.js';
export { PEDIDO_STATUS as STATUS_FLUXO } from './statuses.js';
import { PEDIDO_STATUS as STATUS_FLUXO } from './statuses.js';
export const TIPO_LABEL = {
  locacao_avulsa: 'Locação',
  venda: 'Compra',
  locacao_padronizada: 'Pacote de casamento'
};
export function pedidoParaTransacao(pedido, trans, hoje = new Date().toISOString().slice(0, 10)) {
  const base = {
    id: nextId(trans),
    cliente: pedido.noivos || pedido.cliente.nome,
    tel: pedido.cliente.tel,
    documento: pedido.cliente.documento || '',
    clienteEmail: pedido.cliente.email,
    valor: pedido.valorEstimado || 0,
    data: hoje,
    avarias: '',
    contrato: 'Rascunho',
    noivos: pedido.noivos || '',
    dataEvento: pedido.dataEvento || '',
    integrantes: []
  };
  if (pedido.tipo === 'venda') return {
    ...base,
    tipo: 'venda',
    produtoId: pedido.produtoId,
    tamPedido: pedido.tam,
    tamEntregue: pedido.tam,
    retirada: null,
    devolucao: null,
    devolvido: null
  };
  if (pedido.tipo === 'locacao_avulsa') return {
    ...base,
    tipo: pedido.tipo,
    produtoId: pedido.produtoId,
    tamPedido: pedido.tam,
    tamEntregue: pedido.tam,
    retirada: pedido.retirada,
    devolucao: pedido.devolucao,
    devolvido: false
  };
  if (pedido.tipo !== 'locacao_padronizada') throw new Error('Modalidade de pedido inválida.');
  return {
    ...base,
    tipo: pedido.tipo,
    produtoId: null,
    tamPedido: '',
    tamEntregue: '',
    retirada: pedido.retirada,
    devolucao: pedido.devolucao,
    devolvido: false,
    dataFechamento: hoje,
    limiteComparecimento: pedido.dataEvento ? addDays(pedido.dataEvento, -14) : '',
    trajeConfidencial: false
  };
}
export function mudarStatus(state, id, status, nota = '', extra = {}) {
  if (!STATUS_FLUXO.includes(status)) throw new Error('Status inválido.');
  const pedido = state.pedidos.find(p => p.id === id);
  if (!pedido) throw new Error('Pedido não encontrado.');
  if (pedido.status === 'Aprovado' || pedido.status === 'Recusado') throw new Error('Este pedido já foi finalizado.');
  return {
    ...state,
    pedidos: state.pedidos.map(p => p.id !== id ? p : {
      ...p,
      ...extra,
      status,
      historico: [...(p.historico || []), {
        status,
        em: Date.now(),
        nota
      }]
    })
  };
}
export function aprovarPedido(state, id) {
  const pedido = state.pedidos.find(p => p.id === id);
  if (!pedido) throw new Error('Pedido não encontrado.');
  const transacao = pedidoParaTransacao(pedido, state.trans);
  const aprovado = mudarStatus(state, id, 'Aprovado', `Transação #${transacao.id} criada em Vendas e Locações (rascunho).`, {
    transId: transacao.id
  });
  return {
    ...aprovado,
    trans: [...state.trans, transacao]
  };
}
