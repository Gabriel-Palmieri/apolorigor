import { useState } from "react";
import { useData } from "../../data/useData.js";
import FormularioProdutoGestao from "../../features/catalogo/FormularioProdutoGestao.jsx";
import ControlesProdutoGestao from "../../features/catalogo/ControlesProdutoGestao.jsx";
import EstoqueResumo from "../../features/catalogo/EstoqueResumo.jsx";
import EstoqueItens from "../../features/catalogo/EstoqueItens.jsx";
import { useListaPaginada } from "../../features/listas/useListaPaginada.js";
import Paginacao from "../../shared/ui/estrutura/Paginacao.jsx";
export default function Estoque() {
  const { produtos } = useData();
  const [editing, setEditing] = useState(null);
  const { params, filter, pagination, pending, error, changingPage, changePage } = useListaPaginada("produtos");
  const estados = { all: "todos", active: "ativos", inactive: "inativos" };
  return (
    <div className="max-w-6xl mx-auto">
      <ControlesProdutoGestao
        busca={params.get("busca") || ""}
        onBusca={value => filter("busca", value)}
        estado={estados[params.get("situacao")] || "todos"}
        onEstado={value => filter("situacao", { todos: "all", ativos: "active", inativos: "inactive" }[value])}
        onCadastrar={() => setEditing("new")}
      />
      <EstoqueResumo produtos={produtos} summary={pagination?.summary} />
      <Paginacao pagination={pagination} pending={pending} error={error} onPage={changePage} />
      {!changingPage && <EstoqueItens produtos={produtos} onEditar={setEditing} />}
      {editing && (
        <FormularioProdutoGestao
          produto={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
