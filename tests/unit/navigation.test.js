import { test } from "node:test";
import assert from "node:assert/strict";
import { migrateLegacyUrl, siteDestination } from "../../src/app/navigation.js";
test("old page hashes migrate but document anchors and unknown paths stay intact", () => {
  assert.equal(migrateLegacyUrl({ pathname: "/", hash: "#colecao" }), "/colecao");
  assert.equal(migrateLegacyUrl({ pathname: "/sistema", hash: "#estoque" }), "/sistema/estoque");
  assert.equal(migrateLegacyUrl({ pathname: "/", hash: "#como-funciona" }), null);
  assert.equal(migrateLegacyUrl({ pathname: "/sistema-inexistente", hash: "#estoque" }), null);
});
test("navigation preserves collection filters and account destinations in paths", () => {
  assert.equal(siteDestination("colecao", "noivo"), "/colecao?vitrine=noivo");
  assert.equal(siteDestination("conta", "perfil"), "/conta/perfil");
  assert.equal(siteDestination("como-funciona"), "/#como-funciona");
  assert.throws(() => siteDestination("inexistente"), /desconhecida/);
});
