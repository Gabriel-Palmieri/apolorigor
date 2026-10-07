import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { api, apiList, ApiError } from "../../src/data/apiClient.js";
import { getSession, setSession } from "../../src/data/session.js";
import { getData, refreshData, setDataScope, clearData, dataStatus } from "../../src/data/cache.js";
import { productFromApi, productToApi, orderFromApi, transactionFromApi } from "../../src/data/adapters.js";
const nativeFetch = globalThis.fetch;
const nativeLocal = globalThis.localStorage;
const nativeTab = globalThis.sessionStorage;
const storage = () => {
  const values = new Map();
  return { getItem: key => values.get(key) || null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) };
};
const profile = { id: "client-id", name: "Cliente", email: "cliente@apollo.test", phone: null, document: null, role: "CLIENT" };
const session = token => ({ accessToken: token, refreshToken: "refresh", user: profile });
const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
const product = { id: "product-uuid", name: "Terno", category: "Terno", rentalPriceCents: 25050, salePriceCents: 90000, active: true, variants: [{ id: "variant-uuid", productId: "product-uuid", size: "M", quantity: 4 }] };
beforeEach(() => { globalThis.localStorage = storage(); globalThis.sessionStorage = storage(); setSession(null); setDataScope(["produtos"]); clearData(); });
afterEach(() => { setSession(null); globalThis.fetch = nativeFetch; globalThis.localStorage = nativeLocal; globalThis.sessionStorage = nativeTab; });

test("public requests omit bearer tokens and protected calls require a session", async () => {
  setSession(session("token"));
  globalThis.fetch = async (_url, options) => { assert.equal(options.headers.Authorization, undefined); return response([]); };
  assert.deepEqual(await api("/products", { auth: false }), []);
  setSession(null);
  await assert.rejects(api("/orders"), error => error instanceof ApiError && error.status === 401);
});
test("concurrent 401 responses share a single refresh and replay with rotated tokens", async () => {
  setSession(session("expired")); let renewals = 0;
  globalThis.fetch = async (url, options) => {
    if (url.endsWith("/auth/refresh")) { renewals++; await new Promise(resolve => setTimeout(resolve, 5)); return response(session("renewed")); }
    return options.headers.Authorization === "Bearer expired" ? response({ message: "Expirado" }, 401) : response({ ok: true });
  };
  const results = await Promise.all([api("/orders"), api("/transactions")]);
  assert.deepEqual(results, [{ ok: true }, { ok: true }]); assert.equal(renewals, 1); assert.equal(getSession().accessToken, "renewed");
});
test("failed refresh clears session and private cache instead of continuing offline", async () => {
  setSession(session("expired")); globalThis.fetch = async () => response({ message: "Sessão expirada" }, 401);
  await assert.rejects(api("/orders"), error => error.status === 401);
  assert.equal(getSession(), null); assert.deepEqual(getData().pedidos, []); assert.deepEqual(getData().trans, []);
});
test("a late refresh cannot restore an account after sign-out", async () => {
  setSession(session("expired")); let release;
  globalThis.fetch = async url => {
    if (!url.endsWith("/auth/refresh")) return response({}, 401);
    await new Promise(resolve => { release = resolve; }); return response(session("renewed"));
  };
  const pending = api("/orders");
  while (!release) await new Promise(resolve => setTimeout(resolve, 1));
  setSession(null); release();
  await assert.rejects(pending, error => error.status === 401); assert.equal(getSession(), null);
});
test("403 and 409 preserve authentication and expose server messages", async () => {
  setSession(session("valid"));
  for (const status of [403, 409]) {
    globalThis.fetch = async () => response({ message: "Operação indisponível" }, status);
    await assert.rejects(api("/transactions/x/confirm", { method: "POST" }), error => error.status === status && error.message === "Operação indisponível");
    assert.equal(getSession().accessToken, "valid");
  }
});
test("network failures never retry mutations or create local records", async () => {
  setSession(session("valid")); let calls = 0;
  globalThis.fetch = async () => { calls++; throw new TypeError("offline"); };
  await assert.rejects(api("/orders", { method: "POST", body: { variantId: "v", type: "SALE" } }), /conectar ao servidor/);
  assert.equal(calls, 1); assert.deepEqual(getData().pedidos, []);
});
test("pagination loads subsequent pages and rejects malformed list responses", async () => {
  const pages = [];
  globalThis.fetch = async url => { const page = new URL(url).searchParams.get("page"); pages.push(page); return response(Array(page === "1" ? 100 : 2).fill({ id: page })); };
  assert.equal((await apiList("/products", { auth: false })).length, 102); assert.deepEqual(pages, ["1", "2"]);
  globalThis.fetch = async () => response({ data: [] });
  await assert.rejects(apiList("/products", { auth: false }), /listagem inválida/);
});
test("invalid session profile fields are rejected before rendering", () => {
  for (const patch of [{ name: null }, { email: [] }, { phone: {} }, { role: "OWNER" }])
    assert.throws(() => setSession({ ...session("valid"), user: { ...profile, ...patch } }), /sessão inválida/);
});
test("catalog adapters preserve string IDs, cents and omit unsupported fields", () => {
  const mapped = productFromApi(product);
  assert.equal(mapped.id, "product-uuid"); assert.equal(mapped.variantes[0].id, "variant-uuid"); assert.equal(mapped.aluguel, 250.5);
  const body = productToApi({ ...mapped, status: "Disponível", foto: "", variantes: [{ id: "variant-uuid", tam: "M", qtd: 3 }] });
  assert.equal(body.rentalPriceCents, 25050); assert.deepEqual(body.variants, [{ size: "M", quantity: 3 }]); assert.equal(body.photoUrl, null); assert.equal(body.id, undefined); assert.equal(body.status, undefined);
});
test("order adapters render API states without inventing stock or contract changes", () => {
  const row = orderFromApi({ id: "order", protocol: "AR-A", profileId: "client-id", type: "SALE", status: "APPROVED", quotedPriceCents: 90000, createdAt: "2026-09-29T10:00:00Z", customerName: "Cliente", customerEmail: "cliente@apollo.test", variant: { size: "M", product }, history: [{ status: "NEW", createdAt: "2026-09-29T10:00:00Z", note: "Recebido" }], transaction: { id: "transaction" } });
  assert.equal(row.status, "Aprovado"); assert.equal(row.valorEstimado, 900); assert.equal(row.transId, "transaction"); assert.equal(row.historico[0].status, "Novo");
});
test("only confirmed open rentals feed the operational calendar", () => {
  for (const status of ["DRAFT", "CONFIRMED", "COMPLETED", "CANCELLED"]) {
    const row = transactionFromApi({ id: "transaction", type: "RENTAL", status, priceCents: 25050, variant: { ...product.variants[0], product } });
    assert.equal(row.devolvido, status !== "CONFIRMED"); assert.equal(row.valor, 250.5);
  }
});
test("a failed catalog refresh exposes an error without falling back to demo data", async () => {
  globalThis.fetch = async () => { throw new TypeError("offline"); };
  await refreshData();
  assert.equal(getData().initialized, false); assert.match(getData().error, /conectar ao servidor/); assert.deepEqual(getData().produtos, []);
});

test("independent resources publish before a slow report and preserve successful data on failure", async () => {
  setSession({ ...session('valid'), user: { ...profile, role: 'ADMIN' } });
  setDataScope(['produtos', 'conflicts']);
  let release;
  globalThis.fetch = async url => {
    if (url.endsWith('/transactions/conflicts')) {
      await new Promise(resolve => { release = resolve; });
      return response({message:'Relatório indisponível'},503);
    }
    return response(url.includes('/products') ? [product] : []);
  };
  const pending = refreshData();
  while (!release || !getData().resources.produtos.initialized) await new Promise(resolve => setTimeout(resolve,1));
  assert.equal(dataStatus(getData(), ['produtos']).initialized,true);
  assert.equal(dataStatus(getData(), ['produtos']).loading,false);
  release();
  await pending;
  assert.equal(getData().produtos[0].id,product.id);
  assert.match(getData().resources.conflicts.error,/Relatório indisponível/);
  setDataScope(['produtos']);
  assert.equal(getData().initialized,true);
  assert.equal(getData().error,'');
});

test("a late resource response cannot repopulate cache after account change", async () => {
  setSession(session('valid'));
  let release;
  globalThis.fetch = async () => {
    await new Promise(resolve => { release = resolve; });
    return response([product]);
  };
  const pending = refreshData();
  while (!release) await new Promise(resolve => setTimeout(resolve,1));
  setSession(null);
  release();
  await pending;
  assert.deepEqual(getData().produtos,[]);
  assert.equal(getData().resources.produtos.initialized,false);
});

test('paged resources request only the selected page and discard it before complete reads', async () => {
  setSession({...session('valid'),user:{...profile,role:'ADMIN'}});
  const urls=[];
  globalThis.fetch = async url => {
    urls.push(url);
    if (url.endsWith('/orders/summary')) return response({NEW:0});
    if (url.includes('/products/admin/page')) return response({items:[product],page:2,pages:2,total:21,limit:20});
    return response([product,{...product,id:'second-product'}]);
  };
  setDataScope(['produtos'],{produtos:{page:2,limit:20,q:'Terno',state:'all'}});
  await refreshData();
  assert.equal(getData().produtos.length,1);
  assert.equal(getData().resources.produtos.pagination.total,21);
  assert.equal(urls.filter(url=>url.includes('/products')).length,1);
  assert.match(urls.find(url=>url.includes('/products')),/page=2&limit=20/);
  setDataScope(['produtos']);
  assert.equal(getData().resources.produtos.initialized,false);
  assert.deepEqual(getData().produtos,[]);
  await refreshData();
  assert.equal(getData().produtos.length,2);
  assert.equal(getData().resources.produtos.pagination,undefined);
});

test('late page responses cannot replace the currently selected page', async () => {
  setSession({...session('valid'),user:{...profile,role:'ADMIN'}});
  let release;
  globalThis.fetch = async url => {
    if (url.endsWith('/orders/summary')) return response({NEW:0});
    const page=Number(new URL(url).searchParams.get('page'));
    if (page===1) await new Promise(resolve=>{release=resolve;});
    return response({items:[{...product,id:'page-'+page}],page,pages:2,total:21,limit:20});
  };
  setDataScope(['produtos'],{produtos:{page:1,limit:20}});
  const old=refreshData();
  while (!release) await new Promise(resolve=>setTimeout(resolve,1));
  setDataScope(['produtos'],{produtos:{page:2,limit:20}});
  await refreshData();
  release();
  await old;
  assert.equal(getData().produtos[0].id,'page-2');
  assert.equal(getData().resources.produtos.pagination.page,2);
});

test('malformed pagination is surfaced instead of showing invalid navigation', async () => {
  setSession({...session('valid'),user:{...profile,role:'ADMIN'}});
  globalThis.fetch=async url=>response(url.endsWith('/orders/summary')?{NEW:0}:{items:[],page:1,total:20});
  setDataScope(['produtos'],{produtos:{page:1,limit:20}});
  await refreshData();
  assert.match(getData().error,/página inválida/);
  assert.equal(getData().initialized,false);
});
