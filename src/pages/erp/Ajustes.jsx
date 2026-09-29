import { useState } from "react";
import { useData } from "../../data/useData.js";
import TransacaoLista from "../../features/locacoes/TransacaoLista.jsx";
import FormularioTransacao from "../../features/locacoes/FormularioTransacao.jsx";
export default function Ajustes() {
  const { trans, conflicts } = useData();
  const [editing, setEditing] = useState(null);
  const rows = trans.filter(
    (row) => row.type === "RENTAL" && row.status === "CONFIRMED",
  );
  return (
    <div className="max-w-6xl mx-auto">
      <p className="text-text-sub mb-6">
        Registre a retirada ou devolução de cada traje. O acompanhamento de
        costura ainda não está disponível.
      </p>
      {conflicts.overdue.length > 0 && (
        <p className="text-gold-text mb-6">
          {conflicts.overdue.length} devolução(ões) em atraso.
        </p>
      )}
      <TransacaoLista rows={rows} admin onEdit={setEditing} />
      {editing && (
        <FormularioTransacao row={editing} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}
