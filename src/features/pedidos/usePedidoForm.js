import { useState } from "react";
import { criarPedido } from "../../data/pedidos.js";
import { updateProfile } from "../../data/auth.js";
export function usePedidoForm(cliente, rascunho) {
  const [form, setForm] = useState({
    nome: cliente?.nome || "",
    email: cliente?.email || "",
    tel: cliente?.tel || "",
    documento: cliente?.documento || "",
    observacoes: "",
  });
  const [erros, setErros] = useState({});
  const [feito, setFeito] = useState(null);
  const [busy, setBusy] = useState(false);
  const r = rascunho;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  async function enviar() {
    if (busy) return;
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
      try {
        sessionStorage.removeItem("apollo-pedido-rascunho");
      } catch {
        /* O pedido já foi salvo no servidor. */
      }
    } catch (error) {
      setErros({ geral: error.message });
    } finally {
      setBusy(false);
    }
  }
  return { form, erros, feito, busy, set, enviar, r };
}
