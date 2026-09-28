import { emailOk, telOk } from '../../shared/lib/validation.js';
import { useEffect, useState } from 'react';
import { criarPedido } from '../../features/pedidos/store.js';
export function usePedidoForm(cliente, rascunho) {
  const [form, setForm] = useState({
    nome: cliente?.nome || '',
    email: cliente?.email || '',
    tel: cliente?.tel || '',
    documento: cliente?.documento || '',
    observacoes: ''
  });
  const [erros, setErros] = useState({});
  const [feito, setFeito] = useState(null);
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [feito]);
  const r = rascunho;
  const set = k => e => setForm(f => ({
    ...f,
    [k]: e.target.value
  }));
  const enviar = () => {
    const er = {};
    if (form.nome.trim().length < 3) er.nome = 'Informe seu nome completo.';
    if (!emailOk(form.email)) er.email = 'E-mail inválido.';
    if (!telOk(form.tel)) er.tel = 'Telefone com DDD.';
    setErros(er);
    if (Object.keys(er).length) return;
    const pedido = criarPedido({
      tipo: r.tipo,
      cliente: {
        nome: form.nome.trim(),
        email: form.email.trim(),
        tel: form.tel.trim(),
        documento: form.documento.trim()
      },
      produtoId: r.produtoId,
      produtoNome: r.produtoNome,
      foto: r.foto,
      cor: r.cor,
      tam: r.tam,
      retirada: r.retirada,
      devolucao: r.devolucao,
      valorEstimado: r.valorEstimado,
      observacoes: form.observacoes.trim()
    });
    setFeito(pedido);
  };
  return {
    form,
    erros,
    feito,
    set,
    enviar,
    r
  };
}
