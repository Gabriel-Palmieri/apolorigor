import { api } from "./apiClient.js";
import { getData, refreshData } from "./cache.js";
import { orderFromApi } from "./adapters.js";
export const getPedido = (protocolo) =>
  getData().pedidos.find(
    (p) =>
      p.protocolo ===
      String(protocolo || "")
        .trim()
        .toUpperCase(),
  ) || null;
export async function criarPedido(dados) {
  const product = getData().produtos.find((p) => p.id === dados.produtoId);
  const variant = product?.variantes.find((v) => v.tam === dados.tam);
  if (!variant)
    throw new Error("Atualize a coleção e selecione novamente o tamanho.");
  const body = {
    variantId: variant.id,
    type: dados.tipo === "venda" ? "SALE" : "RENTAL",
    notes: dados.observacoes || "",
  };
  if (body.type === "RENTAL") {
    body.startDate = dados.retirada;
    body.endDate = dados.devolucao;
  }
  const row = await api("/orders", { method: "POST", body });
  await refreshData();
  return orderFromApi(row);
}
export async function atualizarStatus(id, status, nota) {
  const action = {
    "Em análise": "review",
    Aprovado: "approve",
    Recusado: "reject",
  }[status];
  if (!action) throw new Error("Ação de pedido inválida.");
  const row = await api("/orders/" + encodeURIComponent(id) + "/" + action, {
    method: "POST",
    ...(action === "reject" ? { body: { reason: nota } } : {}),
  });
  await refreshData();
  return orderFromApi(row);
}
export const aprovar = (id) => atualizarStatus(id, "Aprovado");
