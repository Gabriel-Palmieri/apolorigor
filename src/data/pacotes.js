import { api, apiList } from "./apiClient.js";

export function solicitarPacote(data) {
  return api("/wedding-packages", {
    auth: false,
    method: "POST",
    body: data,
  });
}

export function listarPacotes() {
  return apiList("/wedding-packages");
}
