import { useSyncExternalStore } from "react";
import { createRepository } from "../../data/repository.js";
import { getData } from "../../data/appData.js";
import { PERFIS } from "../../fixtures/perfis.js";
export { PERFIS } from "../../fixtures/perfis.js";
const repository = createRepository({
  key: "apollo-sessao",
  initialData: () => null,
  storage: () => window.localStorage,
  validate: s => s === null || typeof s === "object" && ["cliente", "admin"].includes(s.tipo)
});
window.addEventListener("storage", repository.sync);
export function pacoteDaSessao(sessao, trans = getData().trans) {
  return sessao?.tipo === "cliente" ? trans.find(t => t.id === sessao.pacoteId) || null : null;
}
export function entrarComoCliente() {
  repository.update(() => ({
    ...PERFIS.cliente,
    em: Date.now()
  }));
}
export function atualizarSessao(patch) {
  repository.update(s => s ? {
    ...s,
    ...patch
  } : null);
}
export function sair() {
  repository.update(() => null);
}
export function useSessao() {
  return useSyncExternalStore(repository.subscribe, repository.getSnapshot, repository.getSnapshot);
}
export function useSessionStorageStatus() {
  return useSyncExternalStore(repository.subscribe, repository.getStatus, repository.getStatus);
}
