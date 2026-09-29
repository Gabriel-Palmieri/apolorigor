import { useState } from "react";
import { useData } from "../../data/useData.js";
import FormularioProdutoGestao from "../../features/catalogo/FormularioProdutoGestao.jsx";
import ControlesProdutoGestao from "../../features/catalogo/ControlesProdutoGestao.jsx";
import EstoqueResumo from "../../features/catalogo/EstoqueResumo.jsx";
import EstoqueItens from "../../features/catalogo/EstoqueItens.jsx";
export default function Estoque() {
  const { produtos } = useData();
  const [editing, setEditing] = useState(null);
  const [busca, setBusca] = useState("");
  const [estado, setEstado] = useState("todos");
  const visiveis = produtos.filter(
    (produto) =>
      (produto.nome + " " + produto.cor + " " + produto.categoria)
        .toLowerCase()
        .includes(busca.trim().toLowerCase()) &&
      (estado === "todos" || produto.ativo === (estado === "ativos")),
  );
  return (
    <div className="max-w-6xl mx-auto">
      <ControlesProdutoGestao
        busca={busca}
        onBusca={setBusca}
        estado={estado}
        onEstado={setEstado}
        onCadastrar={() => setEditing("new")}
      />
      <EstoqueResumo produtos={produtos} />
      <EstoqueItens produtos={visiveis} onEditar={setEditing} />
      {editing && (
        <FormularioProdutoGestao
          produto={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
