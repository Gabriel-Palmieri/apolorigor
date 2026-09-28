import { emailOk, telOk } from '../../shared/lib/validation.js';
import { useState } from 'react';
import { atualizarSessao } from '../../features/conta/session.js';
export function usePerfilForm({
  sessao
}) {
  const base = {
    nome: sessao.nome || '',
    email: sessao.email || '',
    tel: sessao.tel || '',
    documento: sessao.documento || ''
  };
  const [form, setForm] = useState(base);
  const [erros, setErros] = useState({});
  const [salvo, setSalvo] = useState(false);
  const set = k => e => {
    setForm(f => ({
      ...f,
      [k]: e.target.value
    }));
    setSalvo(false);
  };
  const sujo = ['nome', 'email', 'tel', 'documento'].some(k => form[k] !== base[k]);
  const salvar = e => {
    e.preventDefault();
    const er = {};
    if (form.nome.trim().length < 3) er.nome = 'Informe seu nome completo.';
    if (!emailOk(form.email)) er.email = 'E-mail inválido.';
    if (form.tel.trim() && !telOk(form.tel)) er.tel = 'Telefone com DDD.';
    setErros(er);
    if (Object.keys(er).length) return;
    atualizarSessao({
      nome: form.nome.trim(),
      email: form.email.trim(),
      tel: form.tel.trim(),
      documento: form.documento.trim()
    });
    setErros({});
    setSalvo(true);
  };
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
    salvar
  };
}
