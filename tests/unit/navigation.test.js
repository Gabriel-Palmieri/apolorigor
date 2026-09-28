import { test } from 'node:test';
import assert from 'node:assert/strict';
import { migrateLegacyUrl, siteDestination } from '../../src/app/navigation.js';
import { aprovarPedido, mudarStatus, pedidoParaTransacao } from '../../src/domain/pedidos.js';
import { nextId } from '../../src/domain/ids.js';

test('old page hashes migrate but document anchors and unknown paths stay intact', () => {
  assert.equal(migrateLegacyUrl({ pathname: '/', hash: '#colecao' }), '/colecao');
  assert.equal(migrateLegacyUrl({ pathname: '/sistema', hash: '#estoque' }), '/sistema/estoque');
  assert.equal(migrateLegacyUrl({ pathname: '/', hash: '#como-funciona' }), null);
  assert.equal(migrateLegacyUrl({ pathname: '/sistema-inexistente', hash: '#estoque' }), null);
});
test('navigation preserves collection filters and account destinations in paths', () => {
  assert.equal(siteDestination('colecao', 'noivo'), '/colecao?vitrine=noivo');
  assert.equal(siteDestination('conta', 'perfil'), '/conta/perfil');
  assert.equal(siteDestination('como-funciona'), '/#como-funciona');
  assert.throws(() => siteDestination('inexistente'), /desconhecida/);
});
const pedido = { id: 'p1', tipo: 'locacao_avulsa', status: 'Novo', cliente: { nome: 'Cliente', tel: '' }, tam: 'M', produtoId: 1, historico: [] };
test('repeated approval cannot create a second transaction', () => {
  const state = aprovarPedido({ pedidos: [pedido], trans: [{ id: 2000 }] }, 'p1');
  assert.equal(state.trans.at(-1).id, 2001);
  assert.throws(() => aprovarPedido(state, 'p1'), /finalizado/);
  assert.equal(state.trans.length, 2);
});
test('rejected requests and unknown statuses cannot bypass the lifecycle', () => {
  const state = mudarStatus({ pedidos: [pedido], trans: [] }, 'p1', 'Recusado');
  assert.throws(() => aprovarPedido(state, 'p1'), /finalizado/);
  assert.throws(() => mudarStatus({ pedidos: [pedido] }, 'p1', 'Outro'), /inválido/);
});
test('new rental package retains business dates and client ownership', () => {
  const t = pedidoParaTransacao({ ...pedido, tipo: 'locacao_padronizada', dataEvento: '2026-10-20', cliente: { nome: 'Casal', email: 'casal@a.com' } }, [], '2026-09-28');
  assert.equal(t.limiteComparecimento, '2026-10-06');
  assert.equal(t.clienteEmail, 'casal@a.com');
  assert.equal(t.contrato, 'Rascunho');
});
test('IDs consider persisted records rather than module counters', () => {
  assert.equal(nextId([{ id: 1 }, { id: 99 }]), 100);
  assert.equal(nextId([]), 1);
});
