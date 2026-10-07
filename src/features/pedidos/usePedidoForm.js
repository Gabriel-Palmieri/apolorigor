import { useState } from "react";
import { criarPedido } from "../../data/pedidos.js";
import { updateProfile } from "../../data/auth.js";
import { readOrderIntent } from "../../data/orderIntent.js";
export function usePedidoForm(cliente, rascunho, descartarRascunho) {
  const [attempt, setAttempt] = useState(() => readOrderIntent(cliente?.id, rascunho?.requestKey));
  const [form, setForm] = useState({
    nome: cliente?.nome || "",
    email: cliente?.email || "",
    tel: cliente?.tel || "",
    documento: cliente?.documento || "",
    observacoes: attempt?.notes || "",
  });
  const [erros, setErros] = useState({});
  const [feito, setFeito] = useState(null);
  const [busy, setBusy] = useState(false);
  const r = rascunho;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  async function enviar() {
    if (busy || feito || !r) return;
    const er = {};
    if (form.nome.trim().length < 2) er.nome = "Informe seu nome.";
    if (
      form.tel.trim() &&
      (form.tel.trim().length < 8 || form.tel.trim().length > 25)
    )
      er.tel = "Informe um telefone válido.";
    const document = form.documento.replace(/\D/g, "");
    if (document && ![11, 14].includes(document.length))
      er.documento = "Informe um CPF ou CNPJ válido.";
    setErros(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await updateProfile({
        name: form.nome.trim(),
        ...(form.tel.trim() ? { phone: form.tel.trim() } : {}),
        ...(document ? { document } : {}),
      });
      const pedido = await criarPedido({
        ...r,
        observacoes: form.observacoes.trim(),
      });
      setFeito(pedido);
      descartarRascunho();
    } catch (error) {
      setAttempt(readOrderIntent(cliente?.id, r?.requestKey));
      setErros({ geral: error.message });
    } finally {
      setBusy(false);
    }
  }
  return { form, erros, feito, busy, set, enviar, r, retrying: Boolean(attempt) };
}
