import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../data/auth.js";
import { Button } from "../../shared/ui/botoes/Button.jsx";
export default function BotaoSair() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function sair() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await logout();
      navigate("/entrar", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="flex gap-3 items-center flex-wrap">
      <Button variant="ghost" size="compact" disabled={busy} onClick={sair}>
        {busy ? "Saindo…" : "Sair"}
      </Button>
      {error && (
        <span className="text-sm text-text-sub" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
