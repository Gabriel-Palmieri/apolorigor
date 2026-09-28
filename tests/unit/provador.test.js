import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_FOTO_BYTES, mensagemCamera, ternosParaProva, validarFoto } from '../../src/domain/provador.js';

test('fitting room uses the live suit collection and leaves other categories out', () => {
  const terno = { id: 1, categoria: 'Terno', nome: 'Modelo editado' };
  assert.deepEqual(ternosParaProva([terno, { id: 2, categoria: 'Sapato' }]), [terno]);
  assert.deepEqual(ternosParaProva([]), []);
});
test('photo validation rejects unsupported, empty and oversized files with recovery instructions', () => {
  for (const type of ['image/jpeg', 'image/png', 'image/webp']) assert.doesNotThrow(() => validarFoto({ type, size: MAX_FOTO_BYTES }));
  assert.throws(() => validarFoto({ type: 'image/heic', size: 123 }), /HEIC/);
  assert.throws(() => validarFoto({ type: 'image/jpeg', size: MAX_FOTO_BYTES + 1 }), /10 MB/);
  assert.throws(() => validarFoto({ type: 'image/png', size: 0 }), /vazio/);
  assert.match(mensagemCamera({ name: 'NotAllowedError' }), /não foi autorizado/);
  assert.match(mensagemCamera({ name: 'NotFoundError' }), /Não encontramos/);
});
