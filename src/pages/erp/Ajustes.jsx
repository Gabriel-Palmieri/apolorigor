import { useListaPaginada } from "../../features/listas/useListaPaginada.js";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useData } from "../../data/useData.js";
import TransacaoLista from "../../features/locacoes/TransacaoLista.jsx";
import FormularioTransacao from "../../features/locacoes/FormularioTransacao.jsx";
import PainelAtelie from "../../features/ajustes/PainelAtelie.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
export default function Ajustes() {
  const { trans } = useData();
  const paged = useListaPaginada("trans");
  const overdue = paged.pagination?.summary?.overdue || 0;
  const [editing, setEditing] = useState(null);
  const [params, setParams] = useSearchParams();
  const costura = params.get("aba") === "costura";
  const rows = trans.filter(
    (row) => row.type === "RENTAL" && row.status === "CONFIRMED",
  );
  const mudarAba = (aba) => setParams({ aba });
  return (
    <div className="max-w-6xl mx-auto">
      <nav aria-label="Áreas do ateliê" className="flex gap-3 flex-wrap mb-8">
        <Button
          variant={costura ? "ghost" : "solid"}
          aria-pressed={!costura}
          onClick={() => mudarAba("dev")}
        >
          Retiradas e devoluções
        </Button>
        <Button
          variant={costura ? "solid" : "ghost"}
          aria-pressed={costura}
          onClick={() => mudarAba("costura")}
        >
          Costura
        </Button>
      </nav>
      {costura ? (
        <PainelAtelie />
      ) : (
        <>
          <p className="text-text-sub mb-6">
            Registre a retirada ou devolução de cada traje. O acompanhamento de
            costura ainda não está disponível.
          </p>
          {overdue > 0 && (
            <p className="text-gold-text mb-6">
              {overdue} devolução(ões) em atraso.
            </p>
          )}
          <TransacaoLista rows={rows} paged={paged} admin onEdit={setEditing} />
        </>
      )}
      {editing && (
        <FormularioTransacao row={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
