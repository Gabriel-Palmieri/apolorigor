import { api } from "./apiClient.js";
import { refreshData } from "./cache.js";
export async function salvarTransacao(id, body) {
  const row = await api(
    id ? `/transactions/${encodeURIComponent(id)}` : "/transactions",
    { method: id ? "PATCH" : "POST", body },
  );
  await refreshData();
  return row;
}
export async function executarTransacao(id, action, body) {
  if (
    !["confirm", "cancel", "pickup", "return", "deliver", "checkout"].includes(
      action,
    )
  )
    throw new Error("Ação inválida.");
  const row = await api(`/transactions/${encodeURIComponent(id)}/${action}`, {
    method: "POST",
    ...(body ? { body } : {}),
  });
  await refreshData();
  return row;
}
