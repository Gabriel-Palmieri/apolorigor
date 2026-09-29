/** @type {Readonly<Record<import('../../../domain/types').PedidoStatus, {tone: import('../../../domain/types').Tone}>>} */
export const PEDIDO_MAP = {
  Novo: { tone: "blue" },
  "Em análise": { tone: "yellow" },
  Aprovado: { tone: "green" },
  Recusado: { tone: "red" },
};
/** @type {Readonly<Record<import('../../../domain/types').PedidoTipo, {tone: import('../../../domain/types').Tone}>>} */
export const TIPO_MAP = {
  locacao_avulsa: { tone: "orange" },
  venda: { tone: "green" },
};
