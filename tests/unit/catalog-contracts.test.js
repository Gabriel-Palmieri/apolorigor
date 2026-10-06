import { test } from "node:test";
import assert from "node:assert/strict";
import { isProductPhotoUrl } from "../../src/shared/lib/images.js";
import { fmtDate } from "../../src/shared/lib/format.js";

test("catalog photo addresses allow seeded names and HTTPS but reject paths outside the image folder", () => {
  for (const address of ["/produtos/terno.jpg", "/produtos/feminino/vestido-esmeralda.png", "/produtos/WhatsApp%20Image%202026-09-29%20at%2021.14.17%20(1).jpeg", "https://example.com/foto.png?width=400"])
    assert.equal(isProductPhotoUrl(address), true, address);
  for (const address of ["//evil.example/foto.jpg", "/produtos/../foto.jpg", "/produtos/%2e%2e%2ffoto.jpg", "/produtos/%5cfoto.jpg", "/produtos/%252e%252e.jpg", "/produtos/foto.svg", "/outros/foto.jpg", "http://example.com/foto.jpg", "javascript:alert(1)", "/produtos/%broken.jpg"])
    assert.equal(isProductPhotoUrl(address), false, address);
});

test("calendar dates retain their day with current and legacy package payloads", () => {
  assert.equal(fmtDate("2026-11-15"), "15/11/2026");
  assert.equal(fmtDate("2026-11-15T00:00:00.000Z"), "15/11/2026");
  assert.equal(fmtDate(null), "—");
});

import { productToApi } from '../../src/data/adapters.js';
import { descricaoAprovacao } from '../../src/domain/rastreio.js';

test('catalog editing distinguishes clearing an optional field from omitting it', () => {
  const base = {nome:'Terno',categoria:'Terno',aluguel:100,venda:200,variantes:[]};
  assert.equal(productToApi({...base,cor:''}).color,undefined);
  assert.equal(productToApi({...base,id:'product',cor:' '}).color,null);
  assert.equal(productToApi({...base,id:'product'}).color,undefined);
  assert.equal(productToApi({...base,id:'product',cor:' Azul '}).color,'Azul');
});

test('approved tracking distinguishes draft, confirmed, picked up, completed and cancelled operations', () => {
  assert.match(descricaoAprovacao({status:'DRAFT'},'locacao_avulsa'),/aguarda confirmação/);
  assert.match(descricaoAprovacao({status:'CONFIRMED'},'locacao_avulsa'),/Reserva confirmada/);
  assert.match(descricaoAprovacao({status:'CONFIRMED',pickedUpAt:'2026-10-06'},'locacao_avulsa'),/Retirada registrada/);
  assert.match(descricaoAprovacao({status:'COMPLETED'},'locacao_avulsa'),/Devolução registrada/);
  assert.match(descricaoAprovacao({status:'COMPLETED'},'venda'),/Entrega registrada/);
  assert.match(descricaoAprovacao({status:'CANCELLED'},'venda'),/cancelada/);
});
