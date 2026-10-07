/** @type {Record<import('./contracts').OrderStatus, import('../domain/types').PedidoStatus>} */
export const ORDER_STATUS = {
  NEW: "Novo",
  UNDER_REVIEW: "Em análise",
  APPROVED: "Aprovado",
  REJECTED: "Recusado",
};
export const TRANSACTION_STATUS = {
  DRAFT: "Rascunho",
  CONFIRMED: "Confirmado",
  COMPLETED: "Concluído",
  CANCELLED: "Cancelado",
};
export const PAYMENT_STATUS = {
  PENDING: "Pendente",
  PAID: "Pago",
  CANCELLED: "Cancelado",
  REFUNDED: "Estornado",
};
/** @param {import('./contracts').Product} product */
export function productFromApi(product) {
  return {
    id: product.id,
    nome: product.name,
    categoria: product.category,
    colecao: product.collection || "",
    tecido: product.fabric || "",
    cor: product.color || "",
    linha: product.line || "",
    foto: product.photoUrl || "",
    ativo: product.active,
    aluguel: product.rentalPriceCents / 100,
    venda: product.salePriceCents / 100,
    variantes: product.variants.map((v) => ({
      id: v.id,
      tam: v.size,
      qtd: v.quantity,
    })),
  };
}
/** @param {import('./contracts').Order} order */
export function orderFromApi(order) {
  const product = order.variant?.product;
  return {
    id: order.id,
    protocolo: order.protocol,
    profileId: order.profileId,
    tipo: order.type === "SALE" ? "venda" : "locacao_avulsa",
    status: ORDER_STATUS[order.status],
    criadoEm: Date.parse(order.createdAt),
    transId: order.transaction?.id || null,
    transacao: order.transaction || null,
    cliente: {
      nome: order.customerName,
      email: order.customerEmail,
      tel: order.customerPhone || "",
      documento: order.customerDocument || "",
    },
    produtoId: product?.id,
    produtoNome: product?.name || "",
    foto: product?.photoUrl || "",
    cor: product?.color || "",
    tam: order.variant?.size || "",
    retirada: order.startDate,
    devolucao: order.endDate,
    valorEstimado: order.quotedPriceCents / 100,
    observacoes: order.notes || "",
    motivoRecusa: order.rejectionReason || "",
    historico: order.history.map((h) => ({
      status: ORDER_STATUS[h.status],
      em: Date.parse(h.createdAt),
      nota: h.note,
    })),
  };
}
/**
 * @param {import('./contracts').Transaction} row
 * @param {{ id: string, name: string }[]} profiles
 * @param {Pick<import('./contracts').Order, 'id' | 'customerName'>[]} orders
 */
export function transactionFromApi(row, profiles = [], orders = []) {
  const profile = profiles.find((p) => p.id === row.profileId);
  const order = orders.find((p) => p.id === row.orderId);
  return {
    ...row,
    tipo: row.type === "SALE" ? "venda" : "locacao_avulsa",
    produtoId: row.variant.productId,
    tamEntregue: row.variant.size,
    tamPedido: row.variant.size,
    valor: row.priceCents / 100,
    cliente: row.profile?.name || profile?.name || order?.customerName || "Cliente",
    retirada: row.startDate,
    devolucao: row.endDate,
    devolvido:
      row.type === "RENTAL" && row.status === "CONFIRMED" ? false : true,
    contrato: TRANSACTION_STATUS[row.status],
    integrantes: [],
  };
}
/** @param {import('./contracts').ProductForm} product */
export function productToApi(product) {
  /** @type {import('./contracts').ProductWrite} */
  const body = {
    name: product.nome.trim(),
    category: product.categoria,
    rentalPriceCents: Math.round(Number(product.aluguel) * 100),
    salePriceCents: Math.round(Number(product.venda) * 100),
    variants: product.variantes.map((v) => ({
      size: v.tam.trim(),
      quantity: Number(v.qtd),
    })),
  };
  const optional = {
    collection: product.colecao,
    fabric: product.tecido,
    color: product.cor,
    line: product.linha,
    photoUrl: product.foto,
  };
  for (const key of /** @type {(keyof typeof optional)[]} */ (Object.keys(optional))) {
    const value = optional[key];
    if (value !== undefined) {
      if (value?.trim()) body[key] = value.trim();
      else if (product.id) body[key] = null;
    }
  }
  return body;
}
