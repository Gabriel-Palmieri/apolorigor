import { buildEventos } from "./agenda.js";
export function resumoOperacoes(trans) {
  const registradas = trans.filter((transacao) =>
    ["CONFIRMED", "COMPLETED"].includes(transacao.status),
  );
  return {
    locacoesAbertas: registradas.filter(
      (transacao) =>
        transacao.type === "RENTAL" && transacao.status === "CONFIRMED",
    ).length,
    valorCentavos: registradas.reduce(
      (total, transacao) => total + transacao.priceCents,
      0,
    ),
  };
}
export function resumoDashboard({ produtos, trans, pedidos, conflicts }, hoje) {
  const eventos = buildEventos(produtos, trans);
  const proximos = eventos
    .flatMap((evento) => [
      { ...evento, movimento: "Retirada", data: evento.retirada },
      { ...evento, movimento: "Devolução", data: evento.devolucao },
    ])
    .filter((evento) => evento.data && evento.data >= hoje)
    .sort(
      (a, b) =>
        a.data.localeCompare(b.data) ||
        a.movimento.localeCompare(b.movimento) ||
        String(a.transId).localeCompare(String(b.transId)),
    )
    .slice(0, 5);
  return {
    pendencias: {
      pedidos: pedidos.filter((p) => ["Novo", "Em análise"].includes(p.status))
        .length,
      devolucoes: conflicts.overdue.length,
      conflitos: conflicts.conflicts.length,
    },
    proximos,
  };
}
