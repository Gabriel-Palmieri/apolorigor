import { AJUSTE_STATUS, CONTRATO_STATUS, PAGAMENTO_STATUS, PEDIDO_STATUS } from './statuses.js';

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string';
const nonempty = value => text(value) && value.trim().length > 0;
const id = value => Number.isSafeInteger(value) && value > 0;
const money = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const optional = (value, validate) => value === undefined || validate(value);
const date = value => text(value) && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const emptyDate = value => value === '' || value === null || date(value);
const modalidade = value => ['venda', 'locacao_avulsa', 'locacao_padronizada'].includes(value);
const collection = (value, validate) => Array.isArray(value) && value.every(validate) && new Set(value.map(item => item.id)).size === value.length;
const strings = (value, keys) => keys.every(key => text(value[key]));
const optionalStrings = (value, keys) => keys.every(key => optional(value[key], text));

function produtoValido(produto) {
  return record(produto) && id(produto.id) && nonempty(produto.nome)
    && strings(produto, ['categoria', 'colecao', 'tecido', 'cor', 'linha', 'foto'])
    && money(produto.aluguel) && money(produto.venda)
    && Array.isArray(produto.variantes) && produto.variantes.every(variante => record(variante) && nonempty(variante.tam) && Number.isSafeInteger(variante.qtd) && variante.qtd >= 0)
    && new Set(produto.variantes.map(variante => variante.tam)).size === produto.variantes.length;
}
function integranteValido(integrante) {
  return record(integrante) && strings(integrante, ['nome', 'papel', 'tam', 'tamEntregue'])
    && id(integrante.produtoId) && typeof integrante.devolvido === 'boolean'
    && PAGAMENTO_STATUS.includes(integrante.pagamento) && money(integrante.precoNegociado)
    && optionalStrings(integrante, ['documento', 'numeroContrato', 'avarias'])
    // Legacy records describe the exception in text; the editor also saves a numeric override.
    && optional(integrante.excecaoPreco, value => text(value) || value === null || money(value));
}
function transacaoValida(transacao) {
  if (!record(transacao) || !id(transacao.id) || !modalidade(transacao.tipo)
    || !strings(transacao, ['cliente', 'tel', 'tamPedido', 'tamEntregue'])
    || !money(transacao.valor) || !date(transacao.data) || !CONTRATO_STATUS.includes(transacao.contrato)
    || !Array.isArray(transacao.integrantes) || !transacao.integrantes.every(integranteValido)
    || !optionalStrings(transacao, ['documento', 'clienteEmail', 'avarias', 'noivos'])
    || !['dataEvento', 'dataFechamento', 'limiteComparecimento'].every(key => optional(transacao[key], emptyDate))
    || !optional(transacao.trajeConfidencial, value => typeof value === 'boolean')) return false;
  if (transacao.tipo === 'venda') return id(transacao.produtoId) && transacao.devolvido === null && emptyDate(transacao.retirada) && emptyDate(transacao.devolucao);
  return typeof transacao.devolvido === 'boolean' && date(transacao.retirada) && date(transacao.devolucao)
    && transacao.retirada <= transacao.devolucao
    && (transacao.tipo === 'locacao_padronizada' ? transacao.produtoId === null : id(transacao.produtoId));
}
function ajusteValido(ajuste) {
  return record(ajuste) && id(ajuste.id) && id(ajuste.produtoId) && (ajuste.transId === null || id(ajuste.transId))
    && strings(ajuste, ['desc', 'tamOriginal', 'tamEntregue']) && emptyDate(ajuste.entrega) && AJUSTE_STATUS.includes(ajuste.status);
}
function pedidoValido(pedido) {
  return record(pedido) && nonempty(pedido.id) && nonempty(pedido.protocolo) && modalidade(pedido.tipo)
    && PEDIDO_STATUS.includes(pedido.status) && money(pedido.criadoEm)
    && record(pedido.cliente) && strings(pedido.cliente, ['nome', 'email', 'tel'])
    && optional(pedido.cliente.documento, text)
    && optional(pedido.transId, value => value === null || id(value))
    && optional(pedido.produtoId, id) && optional(pedido.valorEstimado, money)
    && optionalStrings(pedido, ['produtoNome', 'foto', 'cor', 'tam', 'observacoes', 'noivos', 'motivoRecusa'])
    && ['retirada', 'devolucao', 'dataEvento'].every(key => optional(pedido[key], emptyDate))
    && Array.isArray(pedido.historico) && pedido.historico.every(evento => record(evento) && PEDIDO_STATUS.includes(evento.status) && money(evento.em) && optional(evento.nota, text));
}

export const validarPedidos = pedidos => collection(pedidos, pedidoValido);
export function validarDados(value) {
  return record(value) && collection(value.produtos, produtoValido) && collection(value.trans, transacaoValida)
    && collection(value.ajustes, ajusteValido) && validarPedidos(value.pedidos);
}
