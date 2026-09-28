import { createRepository } from './repository.js';
import { PRODUTOS_INIT } from '../fixtures/catalogo.js';
import { TRANS_INIT } from '../fixtures/locacoes.js';
import { AJUSTES_INIT } from '../fixtures/ajustes.js';
import { pedidosDemo } from '../fixtures/pedidos.js';
import { validarDados } from '../domain/dataValidation.js';
const initialData = () => structuredClone({
  produtos: PRODUTOS_INIT,
  trans: TRANS_INIT,
  ajustes: AJUSTES_INIT,
  pedidos: pedidosDemo()
});
const repository = createRepository({
  key: 'apollo-data-v1',
  legacyKey: 'apollo-pedidos',
  initialData,
  storage: () => window.localStorage,
  validate: validarDados
});
if (typeof window !== 'undefined') window.addEventListener('storage', repository.sync);
export const getData = repository.getSnapshot;
export const subscribeData = repository.subscribe;
export const getStorageStatus = repository.getStatus;
export const updateData = repository.update;
export const setProdutos = update => updateData(state => ({
  ...state,
  produtos: typeof update === 'function' ? update(state.produtos) : update
}));
export const setTrans = update => updateData(state => ({
  ...state,
  trans: typeof update === 'function' ? update(state.trans) : update
}));
export const setAjustes = update => updateData(state => ({
  ...state,
  ajustes: typeof update === 'function' ? update(state.ajustes) : update
}));
