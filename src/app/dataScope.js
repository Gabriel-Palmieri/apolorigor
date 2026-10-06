// Each screen waits only for the resources it actually uses.
/**
 * @param {string} pathname
 * @param {string} search
 * @returns {import('../data/contracts').ResourceKey[]}
 */
export function resourcesForRoute(pathname, search = "") {
  if (pathname === "/sistema/estoque") return ["produtos"];
  if (pathname === "/sistema/pedidos") return ["pedidos"];
  if (pathname === "/sistema/locacoes" && new URLSearchParams(search).get("aba") === "pacotes")
    return new URLSearchParams(search).get("visao") === "planejamento" ? [] : ["pacotes"];
  if (pathname === "/sistema/locacoes") return ["trans"];
  if (pathname === "/sistema/ajustes" && new URLSearchParams(search).get("aba") === "costura") return [];
  if (pathname === "/sistema/ajustes") return ["trans"];
  if (pathname.endsWith("dashboard")) return ["dashboard"];
  if (pathname.endsWith("anuario")) return [];
  if (pathname.startsWith("/sistema")) {
    /** @type {import('../data/contracts').ResourceKey[]} */
    const keys = ["produtos", "pedidos", "trans", "profiles"];
    if (pathname.endsWith("dashboard") || pathname.endsWith("ajustes")) keys.push("conflicts");
    return keys;
  }
  if (pathname.startsWith("/conta/pedidos")) return ["pedidos", "trans"];
  if (pathname === "/pedido" || pathname === "/pacote") return [];
  if (/^\/(conta|entrar|auth|casamento)(\/|$)/.test(pathname)) return [];
  return ["produtos"];
}

/** @param {string} pathname @param {string} search */
export function pagesForRoute(pathname, search = "") {
  const params = new URLSearchParams(search);
  const requested = Number(params.get("pagina"));
  const page = Number.isSafeInteger(requested) && requested > 0 ? requested : 1;
  const q = (params.get("busca") || "").trim().slice(0, 120);
  if (pathname === "/sistema/estoque") {
    const state = params.get("situacao") || "all";
    return { produtos: { page, limit: 20, q, state: ["active", "inactive"].includes(state) ? state : "all" } };
  }
  if (pathname === "/sistema/pedidos") {
    const status = params.get("status") || "NEW";
    return { pedidos: { page, limit: 20, ...(["NEW", "UNDER_REVIEW", "APPROVED", "REJECTED"].includes(status) ? { status } : {}) } };
  }
  if (pathname === "/sistema/locacoes") {
    if (params.get("aba") === "pacotes")
      return params.get("visao") === "planejamento" ? {} : { pacotes: { page, limit: 20 } };
    return { trans: { page, limit: 20, q } };
  }
  if (pathname === "/sistema/ajustes") return params.get("aba") === "costura" ? {} : { trans: { page, limit: 20, q, type: "RENTAL", status: "CONFIRMED" } };
  if (pathname.startsWith("/conta/pedidos")) {
    /** @param {string} key */
    const readPage = (key) => Math.max(1, Math.floor(Number(params.get(key)) || 1));
    const protocol = pathname.split("/")[3];
    return { pedidos: { page: readPage("paginaPedidos"), limit: 20, ...(protocol ? { protocol: decodeURIComponent(protocol) } : {}) }, trans: { page: readPage("paginaOperacoes"), limit: 20, q: (params.get("buscaOperacoes") || "").trim().slice(0, 120) } };
  }
  if (pathname === "/" || pathname.startsWith("/colecao") || pathname === "/provador") {
    const category = pathname === "/provador" ? "Terno" : params.get("categoria");
    const showcase = params.get("vitrine");
    return { produtos: { page, limit: pathname === "/" ? 6 : 20, public: true, ...(category ? { category } : {}), ...(showcase && showcase !== "todos" ? { showcase } : {}) } };
  }
  return {};
}
