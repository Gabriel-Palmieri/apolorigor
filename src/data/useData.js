import { useSyncExternalStore } from 'react';
import { getData, subscribeData, getStorageStatus, setProdutos, setTrans, setAjustes } from './appData.js';
export function useData() {
  const state = useSyncExternalStore(subscribeData, getData, getData);
  return {
    ...state,
    setProdutos,
    setTrans,
    setAjustes
  };
}
export function useCatalogo() {
  return useData().produtos;
}
export function useStorageStatus() {
  return useSyncExternalStore(subscribeData, getStorageStatus, getStorageStatus);
}
