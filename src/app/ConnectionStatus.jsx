import { useLocation } from "react-router-dom";
import { useData } from "../data/useData.js";
import { refreshData } from "../data/cache.js";
import { restoreSession } from "../data/auth.js";
import { useEstadoSessao } from "../features/conta/sessao.js";
export function ConnectionStatus() {
  const data = useData();
  const session = useEstadoSessao();
  const { pathname } = useLocation();
  const privatePage = /^\/(sistema|conta|pedido)(\/|$)/.test(pathname);
  const message = session.error || (privatePage && data.initialized ? data.error : "");
  return message ? (
    <div className="connection-status" role="alert">
      <span>{message}</span>
      <button className="underline underline-offset-4 text-gold-text shrink-0" disabled={data.loading || session.restoring}
        onClick={() => (session.error ? restoreSession() : refreshData())}>
        Tentar novamente
      </button>
    </div>
  ) : null;
}
