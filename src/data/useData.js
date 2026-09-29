import { useMemo, useSyncExternalStore } from "react";
import { getData, subscribeData } from "./cache.js";
export function useData() {
  return useSyncExternalStore(subscribeData, getData, getData);
}
export function useCatalogo() {
  const { produtos } = useData();
  return useMemo(() => produtos.filter((p) => p.ativo), [produtos]);
}
