import { useEffect } from "react";
import { restoreSession } from "../data/auth.js";
import { clearData, refreshData } from "../data/cache.js";
import { useSessao, useEstadoSessao } from "../features/conta/sessao.js";
let restoring;
export function ApiConnection() {
  const session = useSessao();
  const { restoring: pending, verified } = useEstadoSessao();
  const id = session?.id;
  const type = session?.tipo;
  useEffect(() => {
    restoring ??= restoreSession();
  }, []);
  useEffect(() => {
    clearData();
    if (!pending && verified) void refreshData();
  }, [id, type, pending, verified]);
  return null;
}
