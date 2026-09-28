import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resumoDashboard } from '../../src/domain/dashboard.js';

test('dashboard counts only open queues and outstanding pieces in late packages', () => {
  const result = resumoDashboard({
    produtos: [],
    pedidos: [{ status: 'Novo' }, { status: 'Em análise' }, { status: 'Aprovado' }, { status: 'Recusado' }],
    ajustes: [{ status: 'Pendente' }, { status: 'Em costura' }, { status: 'Concluído' }],
    trans: [
      { id: 1, tipo: 'locacao_padronizada', devolvido: false, retirada: '2026-09-01', devolucao: '2026-09-20', integrantes: [{ nome: 'A', devolvido: false }, { nome: 'B', devolvido: true }], valor: 300 },
      { id: 2, tipo: 'locacao_avulsa', devolvido: false, retirada: '2026-09-10', devolucao: '2026-09-28', valor: 100 },
      { id: 3, tipo: 'locacao_avulsa', devolvido: true, retirada: '2026-09-01', devolucao: '2026-09-02', valor: 100 },
      { id: 4, tipo: 'venda', devolvido: null, valor: 200 },
    ],
  }, '2026-09-28');
  assert.deepEqual(result.pendencias, { pedidos: 2, ajustes: 2, devolucoes: 1 });
  assert.equal(result.proximos.length, 1);
  assert.equal(result.proximos[0].movimento, 'Devolução');
  assert.equal(result.proximos[0].transId, 2);
  assert.equal(result.valorRegistrado, 700);
});

test('upcoming movements include returns, exclude closed rentals and sort chronologically', () => {
  const data = { produtos: [], pedidos: [], ajustes: [], trans: [
    { id: 1, tipo: 'locacao_avulsa', devolvido: false, retirada: '2026-10-03', devolucao: '2026-10-04' },
    { id: 2, tipo: 'locacao_avulsa', devolvido: false, retirada: '2026-09-20', devolucao: '2026-10-01' },
    { id: 3, tipo: 'locacao_avulsa', devolvido: true, retirada: '2026-09-29', devolucao: '2026-10-02' },
    { id: 4, tipo: 'locacao_padronizada', devolvido: false, retirada: '2026-09-29', devolucao: '2026-09-30', integrantes: [{ devolvido: true }] },
  ] };
  const result = resumoDashboard(data, '2026-09-28');
  assert.deepEqual(result.proximos.map(evento => [evento.transId, evento.movimento]), [[2, 'Devolução'], [1, 'Retirada'], [1, 'Devolução']]);
  assert.deepEqual(resumoDashboard({ produtos: [], pedidos: [], ajustes: [], trans: [] }, '2026-09-28').pendencias, { pedidos: 0, ajustes: 0, devolucoes: 0 });
});
