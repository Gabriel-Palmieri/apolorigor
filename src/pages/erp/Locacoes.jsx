import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../../data/useData.js";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import TransacaoLista from "../../features/locacoes/TransacaoLista.jsx";
import FormularioTransacao from "../../features/locacoes/FormularioTransacao.jsx";
import PacotesPadronizados from "../../features/locacoes/PacotesPadronizados.jsx";
export default function Locacoes() {
  const { trans } = useData();
  const [editing, setEditing] = useState(null);
  const [params, setParams] = useSearchParams();
  const pacotes = params.get("aba") === "pacotes";
  return (
    <div className="max-w-6xl mx-auto">
      <nav
        aria-label="Áreas de vendas e locações"
        className="flex gap-3 flex-wrap mb-8"
      >
        <Button
          variant={pacotes ? "ghost" : "solid"}
          aria-pressed={!pacotes}
          onClick={() => setParams({ aba: "historico" })}
        >
          Histórico
        </Button>
        <Button
          variant={pacotes ? "solid" : "ghost"}
          aria-pressed={pacotes}
          onClick={() => setParams({ aba: "pacotes" })}
        >
          Pacotes padronizados
        </Button>
      </nav>
      {pacotes ? (
        <PacotesPadronizados />
      ) : (
        <>
          <div className="flex justify-between items-center gap-4 flex-wrap mb-8">
            <p className="text-sm text-text-sub m-0">
              Vendas e locações individuais, da confirmação à conclusão.
            </p>
            <Button onClick={() => setEditing("new")}>Nova operação</Button>
          </div>
          <TransacaoLista rows={trans} admin onEdit={setEditing} />
        </>
      )}
      {editing && (
        <FormularioTransacao
          row={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
