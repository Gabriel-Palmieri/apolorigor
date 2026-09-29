import { useData } from "../../data/useData.js";
export function usePedidos() {
  return [...useData().pedidos].sort((a, b) => b.criadoEm - a.criadoEm);
}
export function useContagemNovos() {
  return useData().pedidos.filter((p) => p.status === "Novo").length;
}
