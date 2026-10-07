// Os períodos da API usam o dia comercial de São Paulo, independentemente do navegador.
export function todayISO() {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  /** @param {'year' | 'month' | 'day'} type */
  const value = (type) => {
    const part = parts.find((item) => item.type === type);
    if (!part) throw new Error("Não foi possível determinar o dia comercial.");
    return part.value;
  };
  return value("year") + "-" + value("month") + "-" + value("day");
}
/** @param {string} dateStr @param {number} days */
export function addDays(dateStr, days) {
  const date = new Date(dateStr + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
