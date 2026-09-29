const KEY = "apollo-api-session";
const listeners = new Set();
let session = null;
let status = { restoring: true, verified: false, error: "" };
let persistent = false;

function valid(value) {
  return (
    value &&
    typeof value.accessToken === "string" &&
    value.accessToken &&
    typeof value.refreshToken === "string" &&
    value.refreshToken &&
    value.user &&
    typeof value.user.id === "string" && value.user.id.trim() &&
    typeof value.user.name === "string" && value.user.name.trim() &&
    typeof value.user.email === "string" && value.user.email.trim() &&
    [value.user.phone, value.user.document].every(field => field == null || typeof field === "string") &&
    ["CLIENT", "ADMIN"].includes(value.user.role)
  );
}
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(KEY);
    persistent = Boolean(saved);
    const value = JSON.parse(saved || sessionStorage.getItem(KEY) || "null");
    if (valid(value)) session = value;
  } catch {
    /* Corrupt or unavailable storage does not authenticate a user. */
  }
}
export const getSession = () => session;
export const getSessionStatus = () => status;
export const subscribeSession = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
export function setSession(value, remember = persistent) {
  if (value !== null && !valid(value))
    throw new Error("A API retornou uma sessão inválida.");
  session = value;
  persistent = remember;
  status = { restoring: false, verified: true, error: "" };
  try {
    if (value) {
      (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(value));
      (remember ? sessionStorage : localStorage).removeItem(KEY);
    } else {
      localStorage.removeItem(KEY);
      sessionStorage.removeItem(KEY);
    }
  } catch {
    status = {
      restoring: false,
      verified: true,
      error: "A sessão ficará disponível apenas nesta aba.",
    };
  }
  listeners.forEach((listener) => listener());
}
export function sessionError(error) {
  status = { restoring: false, verified: false, error };
  listeners.forEach((listener) => listener());
}
if (typeof window !== "undefined")
  window.addEventListener("storage", (event) => {
    if (
      (event.key === KEY || event.key === null) &&
      event.newValue === null &&
      persistent
    )
      setSession(null);
  });
