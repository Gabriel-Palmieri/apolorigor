/**
 * @param {{ status: import('./types').OperacaoStatus, pickedUpAt?: string | null } | null | undefined} transaction
 * @param {import('./types').PedidoTipo} tipo
 */
export function descricaoAprovacao(transaction, tipo) {
  if (!transaction || transaction.status === "DRAFT")
    return "Pedido aprovado. A operação aguarda confirmação pelo ateliê.";
  if (transaction.status === "CANCELLED")
    return "A operação deste pedido foi cancelada.";
  if (transaction.status === "COMPLETED")
    return tipo === "venda"
      ? "Compra concluída. Entrega registrada pelo ateliê."
      : "Locação concluída. Devolução registrada pelo ateliê.";
  if (transaction.status === "CONFIRMED") {
    if (tipo === "venda")
      return "Compra confirmada. Aguarde a entrega combinada com o ateliê.";
    return transaction.pickedUpAt
      ? "Retirada registrada. Devolva o traje na data combinada."
      : "Reserva confirmada. Aguarde a retirada combinada com o ateliê.";
  }
  return "Consulte o ateliê para acompanhar esta operação.";
}
