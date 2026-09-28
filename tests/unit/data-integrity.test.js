import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createRepository } from '../../src/data/repository.js';
import { validarDados } from '../../src/domain/dataValidation.js';
import { registrarDevolucao } from '../../src/domain/devolucoes.js';
import { CONTRATO_STATUS, PAGAMENTO_STATUS, proximoStatusContrato } from '../../src/domain/statuses.js';
import { PAGAMENTO_OPCOES } from '../../src/domain/locacoes.js';
import { PRODUTOS_INIT } from '../../src/fixtures/catalogo.js';
import { TRANS_INIT } from '../../src/fixtures/locacoes.js';
import { AJUSTES_INIT } from '../../src/fixtures/ajustes.js';
import { pedidosDemo } from '../../src/fixtures/pedidos.js';
import { contagemVariante } from '../../src/domain/rules.js';

const initialData = () => structuredClone({ produtos: PRODUTOS_INIT, trans: TRANS_INIT, ajustes: AJUSTES_INIT, pedidos: pedidosDemo() });
function memoryStorage() {
  const values = new Map();
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
}
const create = (storage, options = {}) => createRepository({ key: 'data', initialData, storage, validate: validarDados, ...options });

test('current fixtures and intentionally empty collections satisfy the persistence contract', () => {
  assert.equal(validarDados(initialData()), true);
  const edited = initialData();
  edited.trans[3].integrantes[0].excecaoPreco = 125;
  assert.equal(validarDados(edited), true, 'participant price overrides are numeric');
  assert.equal(validarDados({ produtos: [], trans: [], ajustes: [], pedidos: [] }), true);
});

test('malformed nested records, states, dates and IDs are rejected at the storage boundary', () => {
  const corruptions = [
    state => { state.produtos[0] = null; },
    state => { state.produtos[0].variantes = [null]; },
    state => { state.produtos[0].variantes[0].qtd = -1; },
    state => { state.produtos[0].venda = '850'; },
    state => { state.produtos.push(state.produtos[0]); },
    state => { state.trans[0].contrato = 'Desconhecido'; },
    state => { state.trans[0].devolucao = '2026-02-30'; },
    state => { state.trans[0].devolucao = '2020-01-01'; },
    state => { state.trans[3].integrantes[0] = null; },
    state => { state.trans[3].integrantes[0].pagamento = 'Outro'; },
    state => { state.trans[3].integrantes[0].excecaoPreco = {}; },
    state => { state.ajustes[0].status = 'Outro'; },
    state => { state.pedidos[0].cliente = null; },
    state => { state.pedidos[0].historico = [null]; },
    state => { state.pedidos[0].historico[0].status = 'Outro'; },
  ];
  for (const corrupt of corruptions) {
    const state = initialData();
    corrupt(state);
    assert.equal(validarDados(state), false);
    const storage = memoryStorage();
    storage.setItem('data', JSON.stringify(state));
    const repository = create(storage);
    assert.equal(validarDados(repository.getSnapshot()), true);
    assert.match(repository.getStatus(), /ler os dados salvos/);
    assert.equal(storage.getItem('data'), JSON.stringify(state), 'recovery does not overwrite stored data');
  }
});

test('invalid legacy request records enter recovery instead of bypassing validation', () => {
  for (const pedidos of [[null], [{ id: 'invalid' }], pedidosDemo(), []]) {
    const storage = memoryStorage();
    storage.setItem('legacy', JSON.stringify(pedidos));
    const repository = create(storage, { legacyKey: 'legacy' });
    if (pedidos.length && !pedidos[0]?.protocolo) assert.match(repository.getStatus(), /ler os dados salvos/);
    else assert.deepEqual(repository.getSnapshot().pedidos, pedidos);
    assert.equal(validarDados(repository.getSnapshot()), true);
  }
});

test('invalid live writes and cross-tab updates preserve the last valid snapshot', () => {
  const storage = memoryStorage();
  const repository = create(storage);
  repository.update(state => state);
  const previous = repository.getSnapshot();
  const saved = storage.getItem('data');
  assert.throws(() => repository.update(state => ({ ...state, produtos: [null] })), /dados inválidos/);
  assert.deepEqual(repository.getSnapshot(), previous);
  assert.equal(storage.getItem('data'), saved);
  storage.setItem('data', JSON.stringify({ ...previous, pedidos: [null] }));
  repository.sync({ key: 'data' });
  assert.deepEqual(repository.getSnapshot(), previous);
  assert.match(repository.getStatus(), /mantidos/);
});

test('return and repair persist in one write and reload together, keeping the piece unavailable', () => {
  const storage = memoryStorage();
  const setItem = storage.setItem;
  let writes = 0;
  storage.setItem = (key, value) => { writes++; setItem(key, value); };
  const repository = create(storage);
  repository.update(state => registrarDevolucao(state, { transId: 1, precisaAjuste: true, desc: 'Bainha' }));
  assert.equal(writes, 1);
  const restored = create(storage).getSnapshot();
  assert.equal(restored.trans.find(item => item.id === 1).devolvido, true);
  assert.equal(restored.ajustes.find(item => item.transId === 1).desc, 'Bainha');
  const produto = restored.produtos.find(item => item.id === 2);
  assert.equal(contagemVariante(produto, 'G', restored.trans, restored.ajustes).ajuste, 1);
});

test('failed return write keeps both changes in memory and restores neither after reload', () => {
  const storage = memoryStorage();
  storage.setItem('data', JSON.stringify(initialData()));
  const repository = create(storage);
  storage.setItem = () => { throw new Error('quota'); };
  repository.update(state => registrarDevolucao(state, { transId: 1, precisaAjuste: true }));
  assert.equal(repository.getSnapshot().trans[0].devolvido, true);
  assert.equal(repository.getSnapshot().ajustes.some(item => item.transId === 1), true);
  assert.match(repository.getStatus(), /apenas nesta aba/);
  const restored = create(storage).getSnapshot();
  assert.equal(restored.trans[0].devolvido, false);
  assert.equal(restored.ajustes.some(item => item.transId === 1), false);
});

test('package returns update only the selected participant and reject a repeated return', () => {
  const source = initialData();
  let state = source;
  const original = structuredClone(state);
  const count = state.trans[3].integrantes.length;
  for (let integranteIdx = 0; integranteIdx < count; integranteIdx++) {
    state = registrarDevolucao(state, { transId: 4, integranteIdx, precisaAjuste: integranteIdx === 0 });
    assert.equal(state.trans[3].devolvido, integranteIdx === count - 1);
  }
  assert.equal(state.ajustes.filter(item => item.transId === 4).length, 1);
  assert.throws(() => registrarDevolucao(state, { transId: 4, integranteIdx: 0, precisaAjuste: true }), /já foi registrada/);
  assert.deepEqual(source, original, 'the transition must not mutate the original snapshot');
  assert.throws(() => registrarDevolucao(state, { transId: 4 }), /Participante/);
  assert.throws(() => registrarDevolucao(source, { transId: 4, integranteIdx: '0' }), /Participante inválido/);
});

test('contracts advance through the central sequence and payment options share its central definition', () => {
  for (let index = 0; index < CONTRATO_STATUS.length; index++) {
    assert.equal(proximoStatusContrato(CONTRATO_STATUS[index]), CONTRATO_STATUS[Math.min(index + 1, CONTRATO_STATUS.length - 1)]);
  }
  assert.equal(proximoStatusContrato('Desconhecido'), 'Desconhecido');
  assert.strictEqual(PAGAMENTO_OPCOES, PAGAMENTO_STATUS);
});
