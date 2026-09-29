// ── Catálogo (Módulo 1) ────────────────────────────────────────
export const CATEGORIAS = [
  "Terno",
  "Vestido",
  "Sapato",
  "Gravata",
  "Camisa",
  "Acessório",
];

// Quantidades físicas cadastradas; disponibilidade depende de tamanho e período.
export function resumoAcervo(produtos) {
  return {
    modelos: produtos.length,
    ativos: produtos.filter((produto) => produto.ativo).length,
    inativos: produtos.filter((produto) => !produto.ativo).length,
    pecas: produtos.reduce(
      (total, produto) =>
        total +
        produto.variantes.reduce((sum, variante) => sum + variante.qtd, 0),
      0,
    ),
  };
}
export const COLECOES = [
  "Clássica",
  "Verão 2026",
  "Inverno 2026",
  "Noivos Premium",
  "Black Tie",
];
export const TECIDOS = [
  "Lã Fria",
  "Linho",
  "Algodão",
  "Poliéster",
  "Seda",
  "Couro",
  "Renda",
];
export const LINHAS = ["Padronizada", "Premium"];

// ordem de tamanhos para a grade e para a lógica de flexibilidade do ateliê
export const NUMERIC_SIZES = Array.from(
  {
    length: 24,
  },
  (_, i) => String(34 + i),
); // 34..57
export const LETTER_SIZES = ["PP", "P", "M", "G", "GG", "XG"];
export const TAM_OPTIONS = [...LETTER_SIZES, ...NUMERIC_SIZES];
export function sizeFamily(tam) {
  return LETTER_SIZES.includes(tam) ? LETTER_SIZES : NUMERIC_SIZES;
}

// tamanhos maiores que `tam`, na mesma família, em ordem crescente de proximidade
export function largerSizes(tam) {
  const fam = sizeFamily(tam);
  const idx = fam.indexOf(tam);
  if (idx === -1) return [];
  return fam.slice(idx + 1);
}
