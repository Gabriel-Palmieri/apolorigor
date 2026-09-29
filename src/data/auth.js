import { api } from "./apiClient.js";
import { getSession, setSession, sessionError } from "./session.js";
export async function login(email, password, remember) {
  const value = await api("/auth/login", {
    auth: false,
    method: "POST",
    body: { email, password },
  });
  setSession(value, remember);
  return value;
}
export const register = (body) =>
  api("/auth/register", { auth: false, method: "POST", body });
export const recover = (email) =>
  api("/auth/recover", { auth: false, method: "POST", body: { email } });
export async function restoreSession() {
  if (!getSession()) {
    setSession(null);
    return;
  }
  const previous = getSession();
  try {
    const user = await api("/auth/me");
    if (getSession()?.user.id === previous.user.id)
      setSession({ ...getSession(), user });
  } catch (error) {
    if (error.status === 401) setSession(null);
    else sessionError(error.message);
  }
}
export async function logout() {
  await api("/auth/logout", { method: "POST" });
  setSession(null);
}
export async function updateProfile(body) {
  const previous = getSession();
  const user = await api("/auth/me", { method: "PATCH", body });
  if (getSession()?.user.id === previous?.user.id)
    setSession({ ...getSession(), user });
  return user;
}
export async function acceptCallback(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  if (params.get("error"))
    throw new Error(
      params.get("error_description") || "O link de acesso não é válido.",
    );
  const refreshToken = params.get("refresh_token");
  if (!refreshToken)
    throw new Error(
      "O link não contém uma sessão válida. Solicite um novo e-mail.",
    );
  const value = await api("/auth/refresh", {
    auth: false,
    method: "POST",
    body: { refreshToken },
  });
  setSession(value, false);
  return value;
}
export const resetPassword = (password) =>
  api("/auth/reset-password", { method: "POST", body: { password } });
