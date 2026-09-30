import { getSession, setSession } from "./session.js";
export const API_URL = (
  import.meta.env?.VITE_API_URL || "http://localhost:3000/api"
).replace(/\/+$/, "");
export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
let refreshing;
async function send(path, { method = "GET", body, token, signal, timeoutMs = 20000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const abort = () => controller.abort();
  signal?.addEventListener("abort", abort, { once: true });
  if (signal?.aborted) controller.abort();
  try {
    const multipart = typeof FormData !== "undefined" && body instanceof FormData;
    const response = await fetch(API_URL + path, {
      method,
      signal: controller.signal,
      headers: {
        ...(body !== undefined && !multipart ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      ...(body !== undefined ? { body: multipart ? body : JSON.stringify(body) } : {}),
    });
    const data =
      response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
      const message = Array.isArray(data?.message)
        ? data.message.join(" · ")
        : data?.message;
      throw new ApiError(
        message || "Não foi possível concluir a operação. Tente novamente.",
        response.status,
      );
    }
    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      error.name === "AbortError"
        ? "A conexão demorou demais. Tente novamente."
        : "Não foi possível conectar ao servidor. Confira sua conexão e tente novamente.",
      0,
    );
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener("abort", abort);
  }
}
export async function refreshSession() {
  if (!refreshing) {
    const previous = getSession();
    if (!previous) throw new ApiError("Entre para continuar.", 401);
    refreshing = send("/auth/refresh", {
      method: "POST",
      body: { refreshToken: previous.refreshToken },
    })
      .then((value) => {
        if (getSession() !== previous)
          throw new ApiError("A sessão mudou. Tente novamente.", 401);
        setSession(value);
        return value;
      })
      .catch((error) => {
        if (error.status === 401 && getSession() === previous) setSession(null);
        throw error;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}
export async function api(path, options = {}) {
  const { auth = true, ...request } = options;
  const original = auth ? getSession() : null;
  if (auth && !original) throw new ApiError("Entre para continuar.", 401);
  try {
    return await send(path, { ...request, token: original?.accessToken });
  } catch (error) {
    if (!auth || error.status !== 401) throw error;
    const current = getSession();
    if (!current || current.user.id !== original.user.id) throw error;
    const renewed =
      current.accessToken !== original.accessToken
        ? current
        : await refreshSession();
    try {
      return await send(path, { ...request, token: renewed.accessToken });
    } catch (retryError) {
      if (retryError.status === 401 && getSession() === renewed)
        setSession(null);
      throw retryError;
    }
  }
}
export async function apiList(path, options = {}) {
  const result = [];
  for (let page = 1; ; page++) {
    const rows = await api(
      `${path}${path.includes("?") ? "&" : "?"}page=${page}&limit=100`,
      options,
    );
    if (!Array.isArray(rows))
      throw new ApiError("O servidor retornou uma listagem inválida.", 502);
    result.push(...rows);
    if (rows.length < 100) return result;
  }
}
