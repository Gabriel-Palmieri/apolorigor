import { useData } from "../../data/useData.js";
export function usePedidos() {
  return [...useData().pedidos].sort((a, b) => b.criadoEm - a.criadoEm);
}
export function useContagemNovos() {
  return useData().pedidoResumo?.NEW || 0;
}
