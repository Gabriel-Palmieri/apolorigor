// Keep the exact request after an ambiguous network failure, including across reloads.
/** @typedef {{ variantId: string, type: "SALE" | "RENTAL", notes: string, startDate?: string, endDate?: string }} OrderIntent */
/** @type {Map<string, OrderIntent>} */
const memory = new Map();
/** @param {string | undefined} owner @param {string | undefined} key */
const keyFor = (owner, key) => `apollo-order-intent:${owner}:${key}`;
/** @param {string | undefined} owner @param {string | undefined} key @returns {OrderIntent | undefined} */
export function readOrderIntent(owner, key) {
  const storageKey = keyFor(owner, key);
  try {
    return JSON.parse(sessionStorage.getItem(storageKey) || "null") || memory.get(storageKey);
  } catch {
    return memory.get(storageKey);
  }
}
/** @param {string} owner @param {string} key @param {OrderIntent} body */
export function rememberOrderIntent(owner, key, body) {
  const storageKey = keyFor(owner, key);
  memory.set(storageKey, body);
  try {
    sessionStorage.setItem(storageKey, JSON.stringify(body));
  } catch { /* In-memory retries remain protected if storage is unavailable. */ }
}
