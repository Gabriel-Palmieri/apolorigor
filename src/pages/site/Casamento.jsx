import { Section, Wrap } from "../../layouts/Content.jsx";
import { Display, Lead } from "../../shared/ui/Typography.jsx";
import { useParams, useOutletContext } from "react-router-dom";
import { useData } from "../../data/useData.js";
// ── Portal do casamento ──────────────────────────────────────────────────────
// Página dedicada (fora da Área do cliente). Abre ao clicar no pedido do pacote
// padronizado em Conta → Pedidos. Banner com o nome dos noivos + o portal
// (PortalNoivo) logo abaixo.
import { useEffect } from "react";
import { pacoteDaSessao } from "../../features/conta/session.js";
import PortalNoivo from "../../features/locacoes/PortalNoivo.jsx";
const dataLonga = (iso) =>
  iso
    ? new Date(iso + "T12:00:00").toLocaleDateString("pt-BR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";
function VoltarLink({ go }) {
  return (
    <button
      onClick={() => go("conta", "pedidos")}
      className="bg-transparent border-0 cursor-pointer py-1 px-0 font-mono text-caption font-semibold tracking-widest uppercase text-text-sub"
    >
      ← Meus pedidos
    </button>
  );
}
export default function Casamento() {
  const { go, cliente } = useOutletContext();
  const { trans } = useData();
  const { pacoteId } = useParams();
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  useEffect(() => {
    if (!cliente) go("entrar");
  }, [cliente, go]);
  if (!cliente) return null;
  const associado = pacoteDaSessao(cliente, trans);
  const pacote =
    !pacoteId || String(associado?.id) === pacoteId ? associado : null;
  if (!pacote) {
    return (
      <Section className="pt-10 desktop:pt-16">
        <Wrap narrow>
          <VoltarLink go={go} />
          <p className="mt-4 text-sm text-text-sub">
            Nenhum pacote de casamento vinculado à sua conta.
          </p>
        </Wrap>
      </Section>
    );
  }
  const nomes = String(pacote.noivos || "")
    .split(/\s*&\s*/)
    .map((n) => n.trim().split(/\s+/)[0])
    .filter(Boolean);
  const titulo =
    nomes.length === 2 ? (
      <>
        {nomes[0]}
        <span className="px-0.5 font-normal italic text-gold-text">&</span>
        {nomes[1]}
      </>
    ) : (
      nomes.join(" & ") || pacote.noivos
    );
  return (
    <>
      {/* Banner — nome dos noivos */}
      <Section className="pt-10 desktop:pt-16 pb-rhythm">
        <Wrap>
          <VoltarLink go={go} />
          <Display className="mt-4">{titulo}</Display>
          <Lead className="mt-4">
            Cerimônia em {dataLonga(pacote.dataEvento)}
          </Lead>
          <p className="mt-2.5 mx-0 mb-0 text-caption text-text-muted font-mono">
            {pacote.noivos}
          </p>
        </Wrap>
      </Section>

      {/* Conteúdo do portal */}
      <Section className="pt-0 pb-section">
        <Wrap>
          <PortalNoivo pacote={pacote} />
        </Wrap>
      </Section>
    </>
  );
}
