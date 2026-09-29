export const fmt = (v) =>
  Number(v || 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
  });
export const fmtDate = (d) =>
  d ? new Date(d + "T12:00:00").toLocaleDateString("pt-BR") : "—";

export const money = (value) => `R$ ${fmt(value)}`;
