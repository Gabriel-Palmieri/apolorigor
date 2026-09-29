import { useState } from "react";
import { useLocation, useOutletContext } from "react-router-dom";
import { MeusPedidos } from "../../features/conta/MeusPedidos.jsx";
import { EditarPerfil } from "../../features/conta/PerfilForm.jsx";
import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2, Lead } from "../../shared/ui/estrutura/Typography.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
import { useData } from "../../data/useData.js";
import { useSessao, sair } from "../../features/conta/sessao.js";
import TransacaoLista from "../../features/locacoes/TransacaoLista.jsx";
export default function Conta() {
  const { go } = useOutletContext();
  const location = useLocation();
  const { pedidos, trans, loading } = useData();
  const sessao = useSessao();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const perfil = location.pathname === "/conta/perfil";
  async function logout() {
    if (busy) return; setBusy(true); setError("");
    try { await sair(); go("home"); } catch (err) { setError(err.message); } finally { setBusy(false); }
  }
  if (!sessao) return null;
  return <Section className="pt-10 desktop:pt-16"><Wrap>
    <div className="flex justify-between items-start gap-4 flex-wrap"><div><H2>Olá, {sessao.nome.split(" ")[0]}.</H2><Lead className="mt-3">{sessao.email}</Lead></div><Button variant="ghost" disabled={busy} onClick={logout}>{busy ? "Saindo…" : "Sair"}</Button></div>
    {error && <Alert>{error}</Alert>}
    <nav className="flex gap-3 flex-wrap my-8" aria-label="Área do cliente"><Button variant={perfil ? "ghost" : "solid"} onClick={() => go("conta", "pedidos")}>Pedidos</Button><Button variant={perfil ? "solid" : "ghost"} onClick={() => go("conta", "perfil")}>Meus dados</Button><Button variant="ghost" onClick={() => go("colecao")}>Novo pedido</Button></nav>
    {perfil ? <EditarPerfil key={sessao.id} sessao={sessao} /> : <>{loading && <p role="status" className="text-text-sub">Atualizando pedidos…</p>}<MeusPedidos pedidos={pedidos} go={go} /><h3 className="mt-10 text-xl font-medium">Minhas compras e locações</h3><TransacaoLista rows={trans} /></>}
  </Wrap></Section>;
}
