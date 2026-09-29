import { useState } from "react";
import { useData } from "../../data/useData.js";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Input, Field } from "../../shared/ui/formularios/Form.jsx";
import { money } from "../../shared/lib/format.js";
import { PLACEHOLDER, onImgError } from "../../shared/lib/images.js";
import FormularioProdutoGestao from "../../features/catalogo/FormularioProdutoGestao.jsx";
export default function Estoque() {
  const { produtos } = useData();
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const visible = produtos.filter((p) =>
    (p.nome + " " + p.cor + " " + p.categoria)
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center flex-wrap gap-5 mb-8">
        <p className="m-0 text-sm text-text-sub">
          Modelos e quantidades cadastradas. As reservas são conferidas por
          período.
        </p>
        <Button onClick={() => setEditing("new")}>Cadastrar modelo</Button>
      </div>
      <Field label="Buscar modelo">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nome, cor ou categoria"
        />
      </Field>
      {!visible.length && (
        <p className="text-text-sub py-6" role="status">
          Nenhum modelo encontrado.
        </p>
      )}
      <div>
        {visible.map((p) => (
          <button
            key={p.id}
            onClick={() => setEditing(p)}
            className="w-full flex gap-4 text-left py-5 border-b border-border bg-transparent font-sans"
          >
            <img
              src={p.foto || PLACEHOLDER}
              onError={onImgError}
              alt=""
              className="w-16 h-20 object-cover bg-card shrink-0"
            />
            <div className="min-w-0 flex-1">
              <div className="flex justify-between gap-4 flex-wrap">
                <h3 className="m-0 text-base font-medium text-text">
                  {p.nome}
                </h3>
                <span className="text-sm text-gold-text">
                  {p.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
              <p className="my-2 text-sm text-text-sub">
                {p.categoria} · {p.cor} ·{" "}
                {p.variantes.reduce((sum, v) => sum + v.qtd, 0)} peças
                cadastradas
              </p>
              <p className="m-0 text-sm text-text-sub">
                Aluguel {money(p.aluguel)} · Venda {money(p.venda)}
              </p>
            </div>
          </button>
        ))}
      </div>
      {editing && (
        <FormularioProdutoGestao
          produto={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
