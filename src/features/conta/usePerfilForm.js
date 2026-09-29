import { useState } from "react";
import { updateProfile } from "../../data/auth.js";
export function usePerfilForm({ sessao }) {
  const base = {
    nome: sessao.nome,
    email: sessao.email,
    tel: sessao.tel,
    documento: sessao.documento,
  };
  const [form, setForm] = useState(base);
  const [erros, setErros] = useState({});
  const [salvo, setSalvo] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setSalvo(false);
  };
  const sujo = ["nome", "tel", "documento"].some((k) => form[k] !== base[k]);
  async function salvar(e) {
    e.preventDefault();
    if (busy) return;
    const er = {};
    if (form.nome.trim().length < 2) er.nome = "Informe seu nome.";
    if (
      form.tel.trim() &&
      (form.tel.trim().length < 8 || form.tel.trim().length > 25)
    )
      er.tel = "Informe um telefone válido.";
    if (base.tel && !form.tel.trim())
      er.tel =
        "O telefone cadastrado precisa ser substituído por outro número.";
    const document = form.documento.replace(/\D/g, "");
    if (document && ![11, 14].includes(document.length))
      er.documento = "Informe um CPF ou CNPJ válido.";
    if (base.documento && !document)
      er.documento =
        "O documento cadastrado precisa ser substituído por outro CPF ou CNPJ.";
    setErros(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    try {
      await updateProfile({
        name: form.nome.trim(),
        ...(form.tel.trim() ? { phone: form.tel.trim() } : {}),
        ...(document ? { document } : {}),
      });
      setSalvo(true);
    } catch (err) {
      setErros({ geral: err.message });
    } finally {
      setBusy(false);
    }
  }
  return {
    base,
    form,
    setForm,
    erros,
    setErros,
    salvo,
    setSalvo,
    set,
    sujo,
    salvar,
    busy,
  };
}
