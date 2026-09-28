import { emailOk, telOk } from '../../shared/lib/validation.js';
import { useCatalogo } from '../../data/useData.js';
import { useEffect, useMemo, useState } from 'react';
import { criarPedido } from '../../features/pedidos/store.js';
const hoje = () => new Date().toISOString().slice(0, 10);
const maisDias = (d, n) => {
  const x = new Date(d + 'T12:00:00');
  x.setDate(x.getDate() + n);
  return x.toISOString().slice(0, 10);
};

// modelos que fazem sentido como base de um pacote (ternos)
export function usePacoteForm(cliente) {
  const CATALOGO = useCatalogo();
  const MODELOS_BASE = useMemo(() => CATALOGO.filter(p => p.categoria === 'Terno'), [CATALOGO]);
  const [form, setForm] = useState({
    noivos: '',
    dataEvento: maisDias(hoje(), 60),
    nIntegrantes: 4,
    modeloBase: '',
    contato: cliente?.nome || '',
    email: cliente?.email || '',
    tel: cliente?.tel || '',
    observacoes: ''
  });
  const [erros, setErros] = useState({});
  const [feito, setFeito] = useState(null);
  useEffect(() => {
    window.scrollTo({
      top: 0
    });
  }, [feito]);
  const set = k => e => setForm(f => ({
    ...f,
    [k]: e.target.value
  }));
  const modelo = useMemo(() => MODELOS_BASE.find(m => String(m.id) === String(form.modeloBase)), [MODELOS_BASE, form.modeloBase]);
  const estimativa = modelo ? modelo.aluguel * Math.max(1, Number(form.nIntegrantes) || 0) : 0;
  const enviar = () => {
    const er = {};
    if (form.noivos.trim().length < 3) er.noivos = 'Informe o nome dos noivos.';
    if (!form.dataEvento || form.dataEvento < hoje()) er.dataEvento = 'Data do evento inválida.';
    if (!(Number(form.nIntegrantes) >= 1)) er.nIntegrantes = 'Ao menos 1 integrante.';
    if (form.contato.trim().length < 3) er.contato = 'Informe o nome do responsável.';
    if (!emailOk(form.email)) er.email = 'E-mail inválido.';
    if (!telOk(form.tel)) er.tel = 'Telefone com DDD.';
    setErros(er);
    if (Object.keys(er).length) return;
    const evento = form.dataEvento;
    const pedido = criarPedido({
      tipo: 'locacao_padronizada',
      cliente: {
        nome: form.contato.trim(),
        email: form.email.trim(),
        tel: form.tel.trim(),
        documento: cliente?.documento || ''
      },
      noivos: form.noivos.trim(),
      dataEvento: evento,
      nIntegrantes: Number(form.nIntegrantes),
      modeloBaseId: modelo ? modelo.id : null,
      modeloBaseNome: modelo ? modelo.nome : '',
      foto: modelo ? modelo.foto : null,
      retirada: maisDias(evento, -4),
      devolucao: maisDias(evento, 3),
      valorEstimado: estimativa,
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
    modelo,
    estimativa,
    MODELOS_BASE
  };
}
