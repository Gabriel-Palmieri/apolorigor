import { useState } from "react";
import { Modal } from "../../shared/ui/dialogos/Modal.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Field, Input, Select } from "../../shared/ui/formularios/Form.jsx";
import { PAPEIS_DO_GRUPO } from "../pedidos/usePacoteForm.js";
export default function IntegranteModal({ participante, onSalvar, onClose }) {
  const [form, setForm] = useState({
    nome: participante?.nome || "",
    papel: participante?.papel || "Padrinho",
    tamanho: participante?.tamanho || "",
  });
  const [erro, setErro] = useState("");
  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));
  function salvar(event) {
    event.preventDefault();
    if (form.nome.trim().length < 2) {
      setErro("Informe o nome do participante.");
      return;
    }
    onSalvar(
      { ...form, nome: form.nome.trim(), tamanho: form.tamanho.trim() },
      participante?.id,
    );
    onClose();
  }
  return (
    <Modal
      title={
        participante
          ? "Editar participante do planejamento"
          : "Adicionar participante ao planejamento"
      }
      onClose={onClose}
    >
      <p className="text-sm text-text-sub mt-0 mb-6">
        Estas informações ficam somente nesta tela. Não haverá cadastro ou
        contratação.
      </p>
      <form onSubmit={salvar}>
        <Field label="Nome do participante" error={erro}>
          <Input
            required
            minLength={2}
            maxLength={100}
            value={form.nome}
            onChange={set("nome")}
          />
        </Field>
        <Field label="Papel no grupo">
          <Select value={form.papel} onChange={set("papel")}>
            {PAPEIS_DO_GRUPO.map((papel) => (
              <option key={papel}>{papel}</option>
            ))}
          </Select>
        </Field>
        <Field
          label="Tamanho de referência"
          hint="Opcional. O tamanho final depende da prova."
        >
          <Input
            maxLength={10}
            value={form.tamanho}
            onChange={set("tamanho")}
          />
        </Field>
        <Button type="submit">Usar no planejamento</Button>
      </form>
    </Modal>
  );
}
