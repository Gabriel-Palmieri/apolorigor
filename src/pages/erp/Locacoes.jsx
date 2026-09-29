import { useState } from "react";
import { useData } from "../../data/useData.js";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import TransacaoLista from "../../features/locacoes/TransacaoLista.jsx";
import FormularioTransacao from "../../features/locacoes/FormularioTransacao.jsx";
export default function Locacoes() {
  const { trans } = useData();
  const [editing, setEditing] = useState(null);
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center gap-4 flex-wrap mb-8">
        <p className="text-sm text-text-sub m-0">
          Vendas e locações individuais, da confirmação à conclusão.
        </p>
        <Button onClick={() => setEditing("new")}>Nova operação</Button>
      </div>
      <TransacaoLista rows={trans} admin onEdit={setEditing} />
      {editing && (
        <FormularioTransacao
          row={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
