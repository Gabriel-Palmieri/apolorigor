/** @param {number | string | null | undefined} v */
export const fmt = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });
/** @param {string | null | undefined} d */
export const fmtDate = (d) =>
  d ? new Date(d.slice(0, 10) + "T12:00:00").toLocaleDateString("pt-BR") : "—";

/** @param {number | string | null | undefined} value */
export const money = (value) => `R$ ${fmt(value)}`;
