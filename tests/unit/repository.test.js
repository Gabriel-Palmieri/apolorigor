import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRepository } from '../../src/data/repository.js';
import { aprovarPedido } from '../../src/domain/pedidos.js';

const initialData = () => ({ produtos: [{ id: 1, nome: 'Original' }], trans: [], ajustes: [], pedidos: [] });
function memoryStorage(values = {}) {
  const data = new Map(Object.entries(values));
  return { getItem: (key) => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
}
const create = (storage, extra = {}) => createRepository({ key: 'data', storage, initialData,
  validate: (state) => state && ['produtos', 'trans', 'ajustes', 'pedidos'].every((key) => Array.isArray(state[key])), ...extra });
const pedido = { id: 'p1', tipo: 'locacao_avulsa', status: 'Novo', cliente: { nome: 'Cliente', email: 'a@b.com', tel: '11999999999' }, produtoId: 1, tam: 'M', retirada: '2026-10-10', devolucao: '2026-10-12', historico: [] };

test('approval and its transaction survive reload together', () => {
  const storage = memoryStorage();
  const repository = create(storage);
  repository.update((state) => ({ ...state, pedidos: [pedido] }));
  repository.update((state) => aprovarPedido(state, pedido.id));
  const restored = create(storage).getSnapshot();
  assert.equal(restored.pedidos[0].status, 'Aprovado');
  assert.equal(restored.pedidos[0].transId, restored.trans[0].id);
  assert.equal(restored.trans[0].clienteEmail, pedido.cliente.email);
});
test('legacy requests are preserved, including an intentionally empty list', () => {
  for (const pedidos of [[pedido], []]) {
    const repository = create(memoryStorage({ legacy: JSON.stringify(pedidos) }), { legacyKey: 'legacy' });
    assert.deepEqual(repository.getSnapshot().pedidos, pedidos);
  }
});
test('edited catalog is restored rather than replaced by demo data', () => {
  const storage = memoryStorage();
  create(storage).update((state) => ({ ...state, produtos: [{ id: 1, nome: 'Editado' }] }));
  assert.equal(create(storage).getSnapshot().produtos[0].nome, 'Editado');
});
test('same-tab subscribers receive updates and can unsubscribe', () => {
  const repository = create(memoryStorage());
  let calls = 0;
  const unsubscribe = repository.subscribe(() => calls++);
  repository.update((state) => ({ ...state, pedidos: [pedido] }));
  unsubscribe();
  repository.update((state) => ({ ...state, pedidos: [] }));
  assert.equal(calls, 1);
});
test('another tab refreshes its snapshot on a relevant storage event', () => {
  const storage = memoryStorage();
  const first = create(storage);
  const second = create(storage);
  first.update((state) => ({ ...state, pedidos: [pedido] }));
  second.sync({ key: 'unrelated' });
  assert.equal(second.getSnapshot().pedidos.length, 0);
  second.sync({ key: 'data' });
  assert.equal(second.getSnapshot().pedidos[0].id, pedido.id);
});
test('unavailable storage preserves changes in memory and reports their limited durability', () => {
  const repository = create({ getItem: () => null, setItem: () => { throw new Error('quota'); } });
  repository.update((state) => ({ ...state, pedidos: [pedido] }));
  assert.equal(repository.getSnapshot().pedidos[0].id, pedido.id);
  assert.match(repository.getStatus(), /apenas nesta aba/);
});
test('corrupt external updates preserve the last coherent snapshot', () => {
  const storage = memoryStorage();
  const repository = create(storage);
  repository.update((state) => ({ ...state, pedidos: [pedido] }));
  storage.setItem('data', '{broken');
  repository.sync({ key: 'data' });
  assert.equal(repository.getSnapshot().pedidos[0].id, pedido.id);
  assert.match(repository.getStatus(), /mantidos/);
});
test('invalid operations do not partially mutate persisted state', () => {
  const storage = memoryStorage();
  const repository = create(storage);
  const before = repository.getSnapshot();
  assert.throws(() => repository.update(() => ({ pedidos: [] })), /inválidos/);
  assert.equal(repository.getSnapshot(), before);
  assert.equal(storage.getItem('data'), null);
});

test('updates from a stale tab retain the changes already saved by another tab', () => {
  const storage = memoryStorage();
  const first = create(storage);
  const second = create(storage);
  first.update((state) => ({ ...state, pedidos: [pedido] }));
  second.update((state) => ({ ...state, produtos: [{ id: 1, nome: 'Editado' }] }));
  const saved = create(storage).getSnapshot();
  assert.equal(saved.pedidos[0].id, pedido.id);
  assert.equal(saved.produtos[0].nome, 'Editado');
});
test('temporary persistence failure does not erase in-memory changes on the next update', () => {
  const storage = memoryStorage();
  const originalWrite = storage.setItem;
  const repository = create(storage);
  repository.update((state) => state);
  storage.setItem = () => { throw new Error('quota'); };
  repository.update((state) => ({ ...state, pedidos: [pedido] }));
  storage.setItem = originalWrite;
  repository.update((state) => ({ ...state, produtos: [{ id: 1, nome: 'Editado' }] }));
  assert.equal(create(storage).getSnapshot().pedidos[0].id, pedido.id);
  assert.equal(repository.getStatus(), null);
});
test('a storage event cannot silently discard unsaved changes', () => {
  const storage = memoryStorage();
  const repository = create(storage);
  storage.setItem = () => { throw new Error('quota'); };
  repository.update((state) => ({ ...state, pedidos: [pedido] }));
  repository.sync({ key: 'data' });
  assert.equal(repository.getSnapshot().pedidos[0].id, pedido.id);
  assert.match(repository.getStatus(), /preservar/);
});
