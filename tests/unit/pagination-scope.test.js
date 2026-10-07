import { test } from "node:test";
import assert from "node:assert/strict";
import { pagesForRoute, resourcesForRoute } from "../../src/app/dataScope.js";

test("customer pagination rejects non-finite page numbers and does not decode arbitrary protocols", () => {
  for (const value of ["Infinity", "NaN", "-1", "1.5", "9007199254740992"])
    assert.equal(pagesForRoute("/conta/pedidos", "?paginaPedidos=" + value).pedidos.page, 1);
  assert.equal(pagesForRoute("/conta/pedidos/%bad").pedidos.protocol, "%bad");
  const pages = pagesForRoute("/conta/pedidos", "?paginaPedidos=3&paginaOperacoes=2");
  assert.equal(pages.pedidos.page, 3);
  assert.equal(pages.trans.page, 2);
});

test("every route with list resources declares a bounded page; dashboard and agenda avoid full lists", () => {
  for (const [path, query] of [["/", ""], ["/colecao", ""], ["/provador", ""], ["/conta/pedidos", ""], ["/sistema/estoque", ""], ["/sistema/pedidos", ""], ["/sistema/ajustes", ""], ["/sistema/locacoes", ""], ["/sistema/locacoes", "?aba=pacotes"]]) {
    const pages = pagesForRoute(path, query);
    for (const key of resourcesForRoute(path, query)) {
      assert.ok(pages[key]?.limit <= 20, `${path}: ${key}`);
      assert.ok(pages[key]?.page >= 1);
    }
  }
  assert.deepEqual(resourcesForRoute("/sistema/dashboard"), ["dashboard"]);
  for (const route of ["/sistema/anuario", "/sistema", "/not-found", "/pedido", "/pacote"])
    assert.deepEqual(resourcesForRoute(route), []);
});
