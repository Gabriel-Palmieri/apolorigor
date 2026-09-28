import { nextId } from './ids.js';

export function registrarDevolucao(state, { transId, integranteIdx = null, avarias = '', precisaAjuste = false, desc = '', entrega = '' }) {
  const transacao = state.trans.find(item => item.id === transId);
  if (!transacao || transacao.tipo === 'venda') throw new Error('Locação não encontrada.');
  if (integranteIdx !== null && (!Number.isSafeInteger(integranteIdx) || integranteIdx < 0)) throw new Error('Participante inválido para esta locação.');
  const integrante = integranteIdx === null ? null : transacao.integrantes?.[integranteIdx];
  if (transacao.tipo === 'locacao_padronizada' && !integrante) throw new Error('Participante não encontrado.');
  if (transacao.tipo === 'locacao_avulsa' && integranteIdx !== null) throw new Error('Participante inválido para esta locação.');
  if ((integrante || transacao).devolvido !== false) throw new Error('Esta devolução já foi registrada. Atualize a seleção.');
  const produtoId = integrante ? integrante.produtoId : transacao.produtoId;
  const tam = integrante ? integrante.tamEntregue : transacao.tamEntregue;
  const trans = state.trans.map(item => {
    if (item.id !== transId) return item;
    if (!integrante) return { ...item, devolvido: true, avarias };
    const integrantes = item.integrantes.map((pessoa, index) => index === integranteIdx ? { ...pessoa, devolvido: true, avarias } : pessoa);
    return { ...item, integrantes, devolvido: integrantes.every(pessoa => pessoa.devolvido) };
  });
  const ajustes = precisaAjuste ? [...state.ajustes, {
    id: nextId(state.ajustes), produtoId, transId,
    desc: desc || 'Ajuste de costura solicitado na devolução.',
    tamOriginal: tam, tamEntregue: tam, entrega, status: 'Pendente'
  }] : state.ajustes;
  return { ...state, trans, ajustes };
}
