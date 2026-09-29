import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { acceptCallback, resetPassword } from "../../data/auth.js";
import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2 } from "../../shared/ui/estrutura/Typography.jsx";
import { Field, Input } from "../../shared/ui/formularios/Form.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
export default function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const started = useRef(false);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const reset = location.pathname === "/auth/reset-password";
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const hash = window.location.hash;
    window.history.replaceState(null, "", window.location.pathname);
    acceptCallback(hash)
      .then((value) => {
        setReady(true);
        if (!reset)
          navigate(
            value.user.role === "ADMIN" ? "/sistema" : "/conta/pedidos",
            { replace: true },
          );
      })
      .catch((err) => setError(err.message));
  }, [navigate, reset]);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      await resetPassword(password);
      setDone(true);
      setPassword("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Section>
      <Wrap narrow>
        <H2>{reset ? "Nova senha" : "Confirmando seu acesso"}</H2>
        {error && <Alert>{error}</Alert>}
        {!ready && !error && <p role="status">Validando seu link…</p>}
        {reset && ready && !done && (
          <form onSubmit={submit} className="mt-6">
            <Field label="Nova senha">
              <Input
                type="password"
                required
                minLength={8}
                maxLength={128}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Field>
            <Button type="submit" disabled={busy}>
              {busy ? "Salvando…" : "Atualizar senha"}
            </Button>
          </form>
        )}
        {done && (
          <p role="status">Senha atualizada. Você já pode acessar sua conta.</p>
        )}
        {(error || done) && (
          <Link
            className="inline-block mt-4 underline text-gold-text"
            to="/entrar"
          >
            Voltar ao acesso
          </Link>
        )}
      </Wrap>
    </Section>
  );
}
