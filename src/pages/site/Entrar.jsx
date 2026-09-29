import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2, Lead } from "../../shared/ui/estrutura/Typography.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Field, Input } from "../../shared/ui/formularios/Form.jsx";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
import { login, register, recover } from "../../data/auth.js";
export default function Entrar() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const changeMode = value => { setMode(value); setError(""); setMessage(""); };
  async function submit(event) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError(""); setMessage("");
    try {
      if (mode === "register") {
        const result = await register({ name: name.trim(), email: email.trim(), password });
        setMessage(result.message); setPassword(""); setMode("login");
      } else if (mode === "recover") {
        const result = await recover(email.trim()); setMessage(result.message);
      } else {
        const result = await login(email.trim(), password, remember);
        const next = params.get("next");
        const safe = next?.startsWith("/") && !next.startsWith("//") && !next.includes("\\");
        navigate(result.user.role === "ADMIN" ? "/sistema" : safe && !next.startsWith("/sistema") ? next : "/conta/pedidos", { replace: true });
      }
    } catch (err) { setError(err.message); }
    finally { setPending(false); }
  }
  return <Section className="pt-10 desktop:pt-16"><Wrap narrow className="max-w-lg">
    <H2>{mode === "register" ? "Criar conta" : mode === "recover" ? "Recuperar senha" : "Entrar"}</H2>
    <Lead className="mt-4">Seu acesso à Apollo Rigor.</Lead>
    <form onSubmit={submit} className="mt-8 p-6 desktop:p-8 bg-bg-elevated" aria-busy={pending}>
      {error && <Alert>{error}</Alert>}
      {message && <Alert tone="info">{message}</Alert>}
      {mode === "register" && <Field label="Nome completo"><Input required minLength={2} maxLength={100} autoComplete="name" value={name} onChange={e => setName(e.target.value)} /></Field>}
      <Field label="E-mail"><Input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} /></Field>
      {mode !== "recover" && <Field label="Senha"><Input required type="password" minLength={8} maxLength={128} autoComplete={mode === "register" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)} /></Field>}
      {mode === "login" && <label className="flex items-center gap-2 mb-5 text-sm text-text-sub"><input type="checkbox" className="accent-gold" checked={remember} onChange={e => setRemember(e.target.checked)} />Manter conectado</label>}
      <Button type="submit" disabled={pending}>{pending ? "Aguarde…" : mode === "register" ? "Criar conta" : mode === "recover" ? "Enviar instruções" : "Entrar"}</Button>
      <div className="flex flex-wrap gap-4 mt-5">
        {mode !== "login" && <Button variant="ghost" disabled={pending} onClick={() => changeMode("login")}>Voltar ao acesso</Button>}
        {mode === "login" && <><Button variant="ghost" disabled={pending} onClick={() => changeMode("register")}>Criar conta</Button><Button variant="ghost" disabled={pending} onClick={() => changeMode("recover")}>Esqueci a senha</Button></>}
      </div>
    </form>
    <p className="mt-5 text-sm text-text-sub"><Link to="/colecao" className="underline text-gold-text">Ver a coleção</Link></p>
  </Wrap></Section>;
}
