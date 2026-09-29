import { useState } from "react";
import { useCatalogo } from "../../data/useData.js";
export const PAPEIS_DO_GRUPO = ["Noivo", "Padrinho", "Pai", "Pajem", "Outro"];

// Planejamento efêmero da interface: não cria pedidos, contratos ou reservas.
export function usePacoteForm(contato) {
  const catalogo = useCatalogo();
  const modelos = catalogo.filter((produto) => produto.categoria === "Terno");
  const [form, setForm] = useState({
    noivos: "",
    dataEvento: "",
    nIntegrantes: "1",
    modeloBase: "",
    contato: contato?.nome || "",
    email: contato?.email || "",
    tel: contato?.tel || "",
    observacoes: "",
  });
  const [participantes, setParticipantes] = useState([]);
  const set = (key) => (event) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));
  const modelo =
    modelos.find((produto) => produto.id === form.modeloBase) || null;
  const quantidade = Number(form.nIntegrantes);
  const referencia =
    modelo &&
    Number.isInteger(quantidade) &&
    quantidade >= 1 &&
    quantidade <= 30
      ? (Math.round(modelo.aluguel * 100) * quantidade) / 100
      : null;
  function salvarParticipante(dados, id) {
    if (id)
      setParticipantes((current) =>
        current.map((item) => (item.id === id ? { ...item, ...dados } : item)),
      );
    else
      setParticipantes((current) => [
        ...current,
        { ...dados, id: crypto.randomUUID() },
      ]);
  }
  const removerParticipante = (id) =>
    setParticipantes((current) => current.filter((item) => item.id !== id));
  return {
    form,
    set,
    modelos,
    modelo,
    referencia,
    participantes,
    salvarParticipante,
    removerParticipante,
  };
}
