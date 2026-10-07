import { api } from "./apiClient.js";
import { getData, refreshData } from "./cache.js";
import { productFromApi, orderFromApi } from "./adapters.js";
import { getSession } from "./session.js";
import { readOrderIntent, rememberOrderIntent } from "./orderIntent.js";
export const getPedido = (protocolo) =>
  getData().pedidos.find(
    (p) =>
      p.protocolo ===
      String(protocolo || "")
        .trim()
        .toUpperCase(),
  ) || null;
export async function criarPedido(dados) {
  const owner = getSession()?.user.id;
  if (!owner) throw new Error("Entre para enviar o pedido.");
  if (!dados.requestKey) throw new Error("Selecione novamente o modelo para iniciar o pedido.");
  const previous = readOrderIntent(owner, dados.requestKey);
  if (previous) {
    const row = await api("/orders", { method: "POST", body: previous, idempotencyKey: dados.requestKey });
    await refreshData();
    return orderFromApi(row);
  }
  const product = getData().produtos.find((p) => p.id === dados.produtoId) || productFromApi(await api("/products/" + encodeURIComponent(dados.produtoId), { auth: false }));
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
  rememberOrderIntent(owner, dados.requestKey, body);
  const row = await api("/orders", { method: "POST", body, idempotencyKey: dados.requestKey });
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
