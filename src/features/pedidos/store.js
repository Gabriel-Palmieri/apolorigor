import { getData, updateData } from '../../data/appData.js';
import { useData } from '../../data/useData.js';
import { aprovarPedido, mudarStatus } from '../../domain/pedidos.js';
export { TIPO_LABEL, STATUS_FLUXO } from '../../domain/pedidos.js';
export const listPedidos = () => [...getData().pedidos].sort((a, b) => b.criadoEm - a.criadoEm);
export const getPedido = protocolo => getData().pedidos.find(p => p.protocolo === String(protocolo || '').trim().toUpperCase()) || null;
function novoProtocolo(existentes) {
  const alfabeto = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let protocolo;
  do {
    const bytes = crypto.getRandomValues(new Uint8Array(5));
    protocolo = 'AR-' + Array.from(bytes, n => alfabeto[n % alfabeto.length]).join('');
  } while (existentes.some(p => p.protocolo === protocolo));
  return protocolo;
}
export function criarPedido(dados) {
  let pedido;
  updateData(state => {
    pedido = {
      ...dados,
      id: crypto.randomUUID(),
      protocolo: novoProtocolo(state.pedidos),
      criadoEm: Date.now(),
      status: 'Novo',
      transId: null,
      motivoRecusa: '',
      historico: [{
        status: 'Novo',
        em: Date.now(),
        nota: 'Pedido recebido pelo site.'
      }]
    };
    return {
      ...state,
      pedidos: [pedido, ...state.pedidos]
    };
  });
  return pedido;
}
export const aprovar = id => updateData(state => aprovarPedido(state, id));
export const atualizarStatus = (id, status, nota, extra) => {
  if (status === 'Aprovado') return aprovar(id);
  return updateData(state => mudarStatus(state, id, status, nota, extra));
};
export const removerPedido = id => updateData(state => ({
  ...state,
  pedidos: state.pedidos.filter(p => p.id !== id)
}));
export function usePedidos() {
  return [...useData().pedidos].sort((a, b) => b.criadoEm - a.criadoEm);
}
export function useContagemNovos() {
  return useData().pedidos.filter(p => p.status === 'Novo').length;
}
