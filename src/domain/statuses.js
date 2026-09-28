/** @type {readonly import('./types').EstoqueStatus[]} */
export const ESTOQUE_STATUS = [
  "Disponível",
  "Alugado",
  "Em Ajuste",
  "Indisponível",
  "Vendido",
  "Misto",
];
/** @type {readonly import('./types').AjusteStatus[]} */
export const AJUSTE_STATUS = ["Pendente", "Em costura", "Concluído"];
/** @type {readonly import('./types').ContratoStatus[]} */
export const CONTRATO_STATUS = [
  "Rascunho",
  "Aguardando assinatura loja",
  "Aguardando assinatura cliente",
  "Confirmado",
];
/** @type {readonly import('./types').IntegranteStatus[]} */
export const INTEGRANTE_STATUS = [
  "Aguardando retirada",
  "Comparecimento pendente",
  "Com o cliente",
  "Devolvido",
  "Atrasado",
];
/** @type {readonly import('./types').PagamentoStatus[]} */
export const PAGAMENTO_STATUS = [
  "Pendente",
  "Parcial",
  "Pago",
  "Incluso no pacote",
];
/** @type {readonly import('./types').PedidoStatus[]} */
export const PEDIDO_STATUS = ["Novo", "Em análise", "Aprovado", "Recusado"];

/** @param {import('./types').ContratoStatus} status */
export function proximoStatusContrato(status) {
  const index = CONTRATO_STATUS.indexOf(status);
  return index >= 0 && index < CONTRATO_STATUS.length - 1 ? CONTRATO_STATUS[index + 1] : status;
}
