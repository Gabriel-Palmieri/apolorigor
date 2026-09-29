import { test } from "node:test";
import assert from "node:assert/strict";
import { resumoDashboard } from "../../src/domain/dashboard.js";
test("dashboard uses backend conflict reports and only open request queues", () => {
  const result = resumoDashboard({
    produtos: [], trans: [], pedidos: [{status:"Novo"}, {status:"Em análise"}, {status:"Aprovado"}, {status:"Recusado"}],
    conflicts: { overdue: ["transaction-a"], conflicts: [{transactionId:"transaction-b"}] },
  }, "2026-09-29");
  assert.deepEqual(result.pendencias, { pedidos: 2, devolucoes: 1, conflitos: 1 });
  assert.deepEqual(result.proximos, []);
});
test("upcoming movements keep UUIDs and exclude completed rentals", () => {
  const result = resumoDashboard({
    produtos: [], pedidos: [], conflicts: { overdue: [], conflicts: [] }, trans: [
      { id: "uuid-a", tipo: "locacao_avulsa", devolvido: false, retirada: "2026-10-03", devolucao: "2026-10-04" },
      { id: "uuid-b", tipo: "locacao_avulsa", devolvido: false, retirada: "2026-09-20", devolucao: "2026-10-01" },
      { id: "uuid-c", tipo: "locacao_avulsa", devolvido: true, retirada: "2026-09-29", devolucao: "2026-10-02" },
    ],
  }, "2026-09-28");
  assert.deepEqual(result.proximos.map(e => [e.transId, e.movimento]), [["uuid-b","Devolução"],["uuid-a","Retirada"],["uuid-a","Devolução"]]);
});
