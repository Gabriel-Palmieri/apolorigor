import { updateData } from "../../data/appData.js";
import { registrarDevolucao } from "../../domain/devolucoes.js";
import { useState } from "react";
// ── Painel de acompanhamento do ateliê ──────────────────────
// ── Fluxo de registro de devoluções ─────────────────────────
export function useDevolucoes({ produtos, trans }) {
  const opcoes = [];
  trans.forEach((t) => {
    if (t.tipo === "locacao_avulsa" && t.devolvido === false) {
      const p = produtos.find((x) => x.id === t.produtoId);
      opcoes.push({
        key: `av-${t.id}`,
        transId: t.id,
        integranteIdx: null,
        label: `${p?.nome || "—"} (${t.tamEntregue}) — ${t.cliente}`,
        produtoId: t.produtoId,
        tam: t.tamEntregue,
      });
    }
    if (t.tipo === "locacao_padronizada" && t.devolvido === false) {
      (t.integrantes || []).forEach((i, idx) => {
        if (i.devolvido) return;
        const p = produtos.find((x) => x.id === i.produtoId);
        opcoes.push({
          key: `pad-${t.id}-${idx}`,
          transId: t.id,
          integranteIdx: idx,
          label: `${p?.nome || "—"} (${i.tamEntregue}) — ${i.nome} (${t.noivos})`,
          produtoId: i.produtoId,
          tam: i.tamEntregue,
        });
      });
    }
  });
  const EMPTY = {
    key: "",
    avarias: "",
    precisaAjuste: false,
    desc: "",
    entrega: "",
  };
  const [d, setD] = useState(EMPTY);
  const [msg, setMsg] = useState("");
  const [erro, setErro] = useState("");
  const sel = opcoes.find((o) => o.key === d.key);
  const confirmar = () => {
    if (!sel) return;
    try {
      updateData(state => registrarDevolucao(state, { ...d, transId: sel.transId, integranteIdx: sel.integranteIdx }));
    } catch (error) {
      setMsg('');
      setErro(error.message);
      return;
    }
    setErro('');
    setMsg(
      `Devolução de "${sel.label}" registrada com sucesso.${d.precisaAjuste ? " Encaminhado ao ateliê." : " Peça liberada para o estoque."}`,
    );
    setD(EMPTY);
  };
  return {
    d,
    setD,
    msg,
    setMsg,
    opcoes,
    erro,
    confirmar,
  };
}
