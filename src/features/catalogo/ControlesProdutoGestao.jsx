import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Field, Input, Select } from "../../shared/ui/formularios/Form.jsx";
export default function ControlesProdutoGestao({
  busca,
  onBusca,
  estado,
  onEstado,
  onCadastrar,
}) {
  return (
    <>
      <div className="flex justify-between items-center flex-wrap gap-5 mb-6">
        <p className="m-0 text-sm text-text-sub">
          Modelos e quantidades cadastradas. As reservas são conferidas por
          período.
        </p>
        <Button onClick={onCadastrar}>Cadastrar modelo</Button>
      </div>
      <div className="grid tablet:grid-cols-summary gap-4">
        <Field label="Buscar modelo">
          <Input
            value={busca}
            onChange={(event) => onBusca(event.target.value)}
            placeholder="Nome, cor ou categoria"
            type="search"
          />
        </Field>
        <Field label="Situação do modelo">
          <Select
            value={estado}
            onChange={(event) => onEstado(event.target.value)}
          >
            <option value="todos">Todos</option>
            <option value="ativos">Ativos</option>
            <option value="inativos">Inativos</option>
          </Select>
        </Field>
      </div>
    </>
  );
}
