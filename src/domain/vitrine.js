// tamanhos cadastrados para um modelo, na ordem da grade
/** @param {{ variantes?: { tam: string }[] }} p */
export const tamanhosDe = (p) => (p.variantes || []).map((v) => v.tam);

// menor preço de aluguel do catálogo, para a chamada "a partir de"
/** @param {{ aluguel: number }[]} catalogo */
export const aluguelMinimo = (catalogo) =>
  catalogo.length ? Math.min(...catalogo.map((p) => p.aluguel)) : 0;

/** @type {{ id: string, titulo: string, desc: string, filtro: (p: import("./types").CatalogProduct) => boolean }[]} */
export const VITRINES = [
  {
    id: "noivo",
    titulo: "Para o noivo",
    desc: "Ternos e smokings de cerimônia, com ajuste de ateliê incluso.",
    filtro: (p) =>
      p.categoria === "Terno" &&
      (p.colecao === "Noivos Premium" || p.colecao === "Black Tie"),
  },
  {
    id: "padrinhos",
    titulo: "Padrinhos e pais",
    desc: "Modelos padronizados para vestir o grupo inteiro na mesma linha.",
    filtro: (p) => p.linha === "Padronizada" && p.categoria === "Terno",
  },
  {
    id: "convidado",
    titulo: "Convidado",
    desc: "Um traje certo para a festa sem precisar comprar.",
    filtro: (p) => p.categoria === "Terno" && p.colecao === "Clássica",
  },
  {
    id: "acessorios",
    titulo: "Sapatos e acessórios",
    desc: "Fecham o traje: verniz, gravata de seda, camisaria.",
    filtro: (p) =>
      ["Sapato", "Gravata", "Camisa", "Acessório"].includes(p.categoria),
  },
];
