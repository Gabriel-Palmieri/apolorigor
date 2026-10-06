import { api, apiList } from "./apiClient.js";
import { getSession, subscribeSession } from "./session.js";
import { productFromApi, orderFromApi, transactionFromApi } from "./adapters.js";
const listeners = new Set();
const labels = {
  produtos: "Coleção", pedidos: "Pedidos", trans: "Operações",
  profiles: "Clientes", conflicts: "Pendências", pacotes: "Pacotes",
  pedidoResumo: "Resumo de pedidos", dashboard: "Painel",
};
const empty = () => ({
  produtos: [], trans: [], pedidos: [], profiles: [], pacotes: [],
  conflicts: { overdue: [], conflicts: [] },
  pedidoResumo: null, dashboard: null,
});
const initialResources = () => Object.fromEntries(
  Object.keys(labels).map(key => [key, { initialized: false, loading: false, error: "" }]),
);
let scope = ["produtos"];
let pageQueries = {};
let raw = empty();
let state = { ...empty(), resources: initialResources(), initialized: false, loading: true, error: "" };
let generation = 0;
const requests = new Map();
export const getData = () => state;
export const subscribeData = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export function dataStatus(data, keys) {
  const resources = keys.map(key => data.resources[key]);
  return {
    initialized: resources.every(resource => resource.initialized),
    loading: resources.some(resource => resource.loading),
    error: keys.filter(key => data.resources[key].error)
      .map(key => `${labels[key]}: ${data.resources[key].error}`).join(" "),
  };
}
function publish(value) {
  state = { ...value, ...dataStatus(value, scope) };
  listeners.forEach(listener => listener());
}
export function setDataScope(keys, queries = {}) {
  scope = keys;
  for (const key of Object.keys(labels)) {
    if (JSON.stringify(pageQueries[key]) !== JSON.stringify(queries[key])) {
      requests.get(key)?.abort();
      requests.delete(key);
      // A page is not a complete collection. Never expose it as one on another route.
      const modeChanged = Boolean(pageQueries[key]) !== Boolean(queries[key]);
      if (modeChanged) {
        raw = { ...raw, [key]: empty()[key] };
        state = { ...state, [key]: empty()[key] };
      }
      state = { ...state, resources: { ...state.resources, [key]: {
        ...state.resources[key], initialized: modeChanged ? false : state.resources[key].initialized,
        requestedKey: JSON.stringify(queries[key] ?? null),
        loading: true, error: "", ...(modeChanged ? { pagination: undefined } : {}),
      } } };
    }
  }
  pageQueries = queries;
  publish(state);
}
export function clearData() {
  generation++;
  requests.forEach(controller => controller.abort());
  requests.clear();
  raw = empty();
  publish({ ...empty(), resources: initialResources() });
}
function permitted(key, session) {
  return key === "produtos" || (session && (
    ["pedidos", "trans"].includes(key) || session.user.role === "ADMIN"
  ));
}
async function refreshResource(key, session) {
  const current = generation;
  requests.get(key)?.abort();
  const controller = new AbortController();
  requests.set(key, controller);
  const admin = session?.user.role === "ADMIN";
  const update = status => publish({
    ...state,
    resources: { ...state.resources, [key]: { ...state.resources[key], ...status } },
  });
  update({ loading: true, error: "" });
  try {
    const paths = {
      produtos: admin ? "/products/admin/all" : "/products",
      pedidos: "/orders", trans: "/transactions", profiles: "/profiles",
      conflicts: "/transactions/conflicts", pacotes: "/wedding-packages",
      pedidoResumo: "/orders/summary", dashboard: "/transactions/dashboard",
    };
    const query = pageQueries[key];
    const pagedPaths = { produtos: "/products/admin/page", pedidos: "/orders/page", trans: "/transactions/page", pacotes: "/wedding-packages/page" };
    const { public: publicOnly, ...params } = query || {};
    const path = query ? (key === "produtos" && publicOnly ? "/products/page" : pagedPaths[key]) + "?" + new URLSearchParams(params) : paths[key];
    const result = await (query || ["conflicts", "pedidoResumo", "dashboard"].includes(key) ? api : apiList)(path, {
      signal: controller.signal, auth: key === "produtos" ? admin && !publicOnly : true,
    });
    if (current !== generation || requests.get(key) !== controller) return;
    if (query && (!Array.isArray(result?.items) || !Number.isInteger(result.page) || result.page < 1 ||
      !Number.isInteger(result.total) || result.total < 0 || !Number.isInteger(result.pages) || result.pages < result.page ||
      result.limit !== query.limit || result.items.length > query.limit || result.items.length > result.total))
      throw new Error("O servidor retornou uma página inválida.");
    const next = { ...raw, [key]: query ? result.items : result };
    const mapped = {
      produtos: next.produtos.map(productFromApi),
      pedidos: next.pedidos.map(orderFromApi),
      trans: next.trans.map(row => transactionFromApi(row, next.profiles, next.pedidos)),
    };
    raw = next;
    publish({
      ...state, ...raw, ...mapped,
      resources: { ...state.resources, [key]: { initialized: true, loading: false, error: "",
        requestedKey: JSON.stringify(query ?? null), queryKey: JSON.stringify(query ?? null),
        pagination: query ? { ...result, items: undefined } : undefined } },
    });
  } catch (error) {
    if (current === generation && requests.get(key) === controller)
      update({ loading: false, error: error.message });
  } finally {
    if (requests.get(key) === controller) requests.delete(key);
  }
}
export async function refreshData() {
  const session = getSession();
  // The sidebar count updates independently and never blocks another screen.
  if (session?.user.role === "ADMIN" && !scope.includes("pedidoResumo"))
    void refreshResource("pedidoResumo", session);
  await Promise.all(scope.filter(key => permitted(key, session)).map(key => refreshResource(key, session)));
}
let owner = getSession()?.user.id + ":" + getSession()?.user.role;
subscribeSession(() => {
  const next = getSession()?.user.id + ":" + getSession()?.user.role;
  if (next !== owner) {
    owner = next;
    clearData();
  }
});
