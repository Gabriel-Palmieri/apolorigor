export const SITE_PATHS = {
  home: "/",
  colecao: "/colecao",
  provador: "/provador",
  pedido: "/pedido",
  pacote: "/pacote",
  entrar: "/entrar",
  conta: "/conta/pedidos",
  casamento: "/casamento",
};
export const ERP_NAV = [
  {
    key: "dashboard",
    label: "Dashboard",
    sub: "Painel executivo",
  },
  {
    key: "pedidos",
    label: "Pedidos",
    sub: "Solicitações do site",
  },
  {
    key: "estoque",
    label: "Catálogo & Estoque",
    sub: "Modelos e grade de tamanhos",
  },
  {
    key: "locacoes",
    label: "Vendas e Locações",
    sub: "Avulsa · Padronizada",
  },
  {
    key: "anuario",
    label: "Anuário",
    sub: "Agenda e disponibilidade",
  },
  {
    key: "ajustes",
    label: "Ateliê",
    sub: "Ajustes e devoluções",
  },
];
export function siteDestination(destino, extra) {
  if (destino === "como-funciona" || destino === "atelie")
    return "/#" + destino;
  if (destino === "conta" && ["perfil", "pedidos"].includes(extra))
    return "/conta/" + extra;
  if (destino === "colecao" && extra)
    return "/colecao?vitrine=" + encodeURIComponent(extra);
  if (!SITE_PATHS[destino]) throw new Error("Página desconhecida: " + destino);
  return SITE_PATHS[destino];
}
export function migrateLegacyUrl(location) {
  const hash = location.hash.slice(1);
  const pathname = location.pathname.replace(/\/+$/, "") || "/";
  if (pathname === "/" && SITE_PATHS[hash] && hash !== "home")
    return SITE_PATHS[hash];
  if (pathname === "/sistema" && ERP_NAV.some((page) => page.key === hash))
    return "/sistema/" + hash;
  return null;
}
