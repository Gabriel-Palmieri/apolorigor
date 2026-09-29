import { api } from "./apiClient.js";
import { refreshData } from "./cache.js";
import { productToApi } from "./adapters.js";
export async function salvarProduto(product) {
  const result = await api(
    product.id ? `/products/${encodeURIComponent(product.id)}` : "/products",
    { method: product.id ? "PATCH" : "POST", body: productToApi(product) },
  );
  await refreshData();
  return result;
}
export async function desativarProduto(id) {
  await api(`/products/${encodeURIComponent(id)}`, { method: "DELETE" });
  await refreshData();
}
export function consultarDisponibilidade(
  productId,
  variantId,
  startDate,
  endDate,
  signal,
) {
  const query = new URLSearchParams({ startDate, endDate });
  return api(
    `/products/${encodeURIComponent(productId)}/variants/${encodeURIComponent(variantId)}/availability?${query}`,
    { auth: false, signal },
  );
}
