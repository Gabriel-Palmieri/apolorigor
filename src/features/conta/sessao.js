import { useMemo, useSyncExternalStore } from "react";
import {
  getSession,
  subscribeSession,
  getSessionStatus,
} from "../../data/session.js";
export { logout as sair } from "../../data/auth.js";
export function useSessao() {
  const value = useSyncExternalStore(subscribeSession, getSession, getSession);
  return useMemo(
    () =>
      value
        ? {
            id: value.user.id,
            tipo: value.user.role === "ADMIN" ? "admin" : "cliente",
            nome: value.user.name,
            email: value.user.email,
            tel: value.user.phone || "",
            documento: value.user.document || "",
          }
        : null,
    [value],
  );
}
export function useEstadoSessao() {
  return useSyncExternalStore(
    subscribeSession,
    getSessionStatus,
    getSessionStatus,
  );
}
