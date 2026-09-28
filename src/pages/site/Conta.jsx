import { MeusPedidos } from "../../features/conta/MeusPedidos.jsx";
import { EditarPerfil } from "../../features/conta/PerfilForm.jsx";
import { Section, Wrap } from "../../layouts/Content.jsx";
import { H2, Lead } from "../../shared/ui/Typography.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useLocation, useOutletContext } from "react-router-dom";
import { useData } from "../../data/useData.js";
import { useEffect } from "react";
import {
  useSessao,
  sair,
  pacoteDaSessao,
} from "../../features/conta/session.js";
import { usePedidos } from "../../features/pedidos/store.js";
// Área do cliente (perfil "noivo" de exemplo). Abas: Pedidos (avulsos + o pacote
// padronizado) e Meus dados. O Portal do noivo não é mais aba: abre ao clicar no
// pedido do pacote de casamento.

export default function Conta() {
  const { go } = useOutletContext();
  const location = useLocation();
  const { trans } = useData();
  const pedidos = usePedidos();
  const sessao = useSessao();
  // 'portal' era uma aba antiga — cai em 'pedidos'
  const aba = location.pathname === "/conta/perfil" ? "perfil" : "pedidos";
  const setAba = (value) => go("conta", value);
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, [aba]);
  useEffect(() => {
    if (sessao === null || (sessao && sessao.tipo !== "cliente")) go("entrar");
  }, [sessao, go]);
  if (!sessao || sessao.tipo !== "cliente") return null;
  const pacote = pacoteDaSessao(sessao, trans);
  // Pedidos avulsos (locação/compra individuais feitas pelo site).
  const meusPedidos = pedidos.filter(
    (p) =>
      (p.cliente?.email || "").toLowerCase() === sessao.email.toLowerCase() &&
      p.tipo !== "locacao_padronizada",
  );
  const totalPedidos = meusPedidos.length + (pacote ? 1 : 0);
  const abas = [
    {
      key: "pedidos",
      label: `Pedidos${totalPedidos ? ` · ${totalPedidos}` : ""}`,
    },
    {
      key: "perfil",
      label: "Meus dados",
    },
  ];
  return (
    <Section className="pt-10 desktop:pt-16">
      <Wrap>
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <H2 className="mt-3.5">Olá, {sessao.nome.split(" ")[0]}.</H2>
            <Lead className="mt-3.5">
              {sessao.papel} · {sessao.email}
            </Lead>
          </div>
          <button
            onClick={() => {
              sair();
              go("home");
            }}
            className="bg-transparent border border-border rounded-control cursor-pointer py-2 px-4 font-mono text-caption font-semibold tracking-widest uppercase text-text-sub"
          >
            Sair
          </button>
        </div>

        <div className="flex gap-3 flex-wrap mt-5">
          <Button onClick={() => go("colecao")}>Abrir novo pedido</Button>
          <Button variant="ghost" onClick={() => go("pacote")}>
            Montar pacote de casamento
          </Button>
        </div>

        <div className="flex flex-wrap border-b border-b-border mt-8 mx-0 mb-7">
          {abas.map((a) => (
            <button
              key={a.key}
              onClick={() => setAba(a.key)}
              className={cn(
                "bg-transparent border-0 cursor-pointer py-2.5 px-0.5 mr-6 font-sans text-sm",
                aba === a.key ? "font-semibold" : "font-medium",
                aba === a.key ? "text-gold-text" : "text-text",
                cn(
                  "border-b-2",
                  aba === a.key ? "border-gold" : "border-transparent",
                ),
              )}
            >
              {a.label}
            </button>
          ))}
        </div>

        {aba === "pedidos" && (
          <MeusPedidos pedidos={meusPedidos} pacote={pacote} go={go} />
        )}

        {aba === "perfil" && <EditarPerfil sessao={sessao} />}
      </Wrap>
    </Section>
  );
}
