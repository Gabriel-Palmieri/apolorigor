import { api, apiList } from "./apiClient.js";
import { getSession, subscribeSession } from "./session.js";
import {
  productFromApi,
  orderFromApi,
  transactionFromApi,
} from "./adapters.js";
const listeners = new Set();
const empty = () => ({
  produtos: [],
  trans: [],
  pedidos: [],
  profiles: [],
  initialized: false,
  conflicts: { overdue: [], conflicts: [] },
});
let state = { ...empty(), loading: true, error: "" };
let generation = 0;
let activeRequest;
export const getData = () => state;
export const subscribeData = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
function publish(value) {
  state = value;
  listeners.forEach((listener) => listener());
}
export function clearData() {
  generation++;
  activeRequest?.abort();
  publish({ ...empty(), loading: true, error: "" });
}
export async function refreshData() {
  const current = ++generation;
  activeRequest?.abort();
  activeRequest = new AbortController();
  const signal = activeRequest.signal;
  const session = getSession();
  const admin = session?.user.role === "ADMIN";
  publish({ ...state, loading: true, error: "" });
  try {
    const [products, orders, transactions, profiles, conflicts] =
      await Promise.all([
        apiList(admin ? "/products/admin/all" : "/products", {
          auth: admin,
          signal,
        }),
        session ? apiList("/orders", { signal }) : [],
        session ? apiList("/transactions", { signal }) : [],
        admin ? apiList("/profiles", { signal }) : [],
        admin
          ? api("/transactions/conflicts", { signal })
          : { overdue: [], conflicts: [] },
      ]);
    if (current !== generation) return;
    publish({
      produtos: products.map(productFromApi),
      pedidos: orders.map(orderFromApi),
      trans: transactions.map((row) =>
        transactionFromApi(row, profiles, orders),
      ),
      profiles,
      conflicts,
      initialized: true,
      loading: false,
      error: "",
    });
  } catch (error) {
    if (current === generation)
      publish({ ...state, loading: false, error: error.message });
  }
}
let owner = getSession()?.user.id + ":" + getSession()?.user.role;
subscribeSession(() => {
  const next = getSession()?.user.id + ":" + getSession()?.user.role;
  if (next !== owner) {
    owner = next;
    clearData();
  }
});
