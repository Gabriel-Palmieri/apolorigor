const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const MES_ABBR = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];
const iso = (d) => d.toISOString().slice(0, 10);
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const startOfWeek = (d) => addDays(d, -d.getDay());
const parse = (s) => new Date(s + "T12:00:00");
const isWeekend = (d) => d.getDay() === 0 || d.getDay() === 6;
const fmtShort = (s) => {
  const d = parse(s);
  return `${d.getDate()} ${MES_ABBR[d.getMonth()]}`;
};
export {
  DIAS,
  MESES,
  MES_ABBR,
  iso,
  addDays,
  startOfWeek,
  parse,
  isWeekend,
  fmtShort,
};
