import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { restoreSession } from "../data/auth.js";
import { clearData, getData, refreshData, setDataScope } from "../data/cache.js";
import { resourcesForRoute, pagesForRoute } from "./dataScope.js";
import { useSessao, useEstadoSessao } from "../features/conta/sessao.js";
let restoring;
export function ApiConnection() {
  const session = useSessao();
  const { restoring: pending, verified } = useEstadoSessao();
  const id = session?.id;
  const type = session?.tipo;
  const { pathname, search } = useLocation();
  useEffect(() => {
    restoring ??= restoreSession();
  }, []);
  useEffect(() => {
    clearData();
  }, [id, type, pending, verified]);
  useEffect(() => {
    setDataScope(resourcesForRoute(pathname, search), pagesForRoute(pathname, search));
    if (!pending && verified) void refreshData();
  }, [id, type, pending, verified, pathname, search]);
  useEffect(() => {
    if (pending || !verified) return;
    const refresh = () => {
      if (!document.hidden && !getData().loading) void refreshData();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    const timer = id ? window.setInterval(refresh, 30000) : null;
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      if (timer !== null) window.clearInterval(timer);
    };
  }, [id, pending, verified]);
  return null;
}
