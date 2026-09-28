import { AJUSTE_STATUS } from "../../domain/statuses.js";
import { statusAppearance, colorClass } from "../../shared/ui/palette.js";
import { Card } from "../../shared/ui/Surfaces.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { cn } from "../../shared/lib/cn.js";
import { AJUSTE_MAP } from "../../shared/ui/status.js";
import { fmtDate } from "../../shared/lib/format.js";
// ── Painel de acompanhamento do ateliê ──────────────────────
// ── Painel de acompanhamento do ateliê ──────────────────────
function PainelAteliê({ produtos, ajustes, setAjustes }) {
  const colunas = AJUSTE_STATUS;
  const avancar = (id, status) =>
    setAjustes((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status,
            }
          : a,
      ),
    );
  return (
    <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
      {colunas.map((col) => {
        const itens = ajustes.filter((a) => a.status === col);
        const s = statusAppearance(AJUSTE_MAP, col);
        return (
          <div key={col}>
            <div className="flex items-center gap-2 mb-3">
              <span
                className={cn(
                  "w-2 h-2 rounded-full inline-block",
                  colorClass(s.color, "bg"),
                )}
              />
              <p
                className={cn(
                  "m-0 text-caption font-bold tracking-wide",
                  colorClass(s.color, "text"),
                )}
              >
                {col.toUpperCase()} ({itens.length})
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              {itens.length === 0 && (
                <Card className="p-3.5">
                  <p className="m-0 text-xs text-text-muted">Nenhum item.</p>
                </Card>
              )}
              {itens.map((a) => {
                const produto = produtos.find((p) => p.id === a.produtoId);
                return (
                  <Card
                    key={a.id}
                    className={cn(
                      "p-3.5",
                      cn("border-l-4", colorClass(s.color, "border")),
                    )}
                  >
                    <p className="font-bold text-text text-compact mt-0 mx-0 mb-1 font-display">
                      {produto?.nome || "—"}
                    </p>
                    <p className="text-text-sub text-xs mt-0 mx-0 mb-1.5">
                      {a.desc}
                    </p>
                    {a.tamOriginal &&
                      a.tamEntregue &&
                      a.tamOriginal !== a.tamEntregue && (
                        <p className="text-text-muted text-caption mt-0 mx-0 mb-1.5">
                          Tam. pedido {a.tamOriginal} → entregue {a.tamEntregue}
                        </p>
                      )}
                    <p className="text-text-sub text-caption mt-0 mx-0 mb-2.5">
                      Entrega prevista:{" "}
                      <span className="text-text">{fmtDate(a.entrega)}</span>
                    </p>
                    <div className="flex gap-1.5">
                      {col === "Pendente" && (
                        <Button
                          color="var(--status-blue-fg)"
                          onClick={() => avancar(a.id, "Em costura")}
                          size="compact"
                          variant="ghost"
                        >
                          Iniciar costura
                        </Button>
                      )}
                      {col === "Em costura" && (
                        <Button
                          color="var(--status-green-fg)"
                          onClick={() => avancar(a.id, "Concluído")}
                          size="compact"
                          variant="ghost"
                        >
                          Concluir
                        </Button>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Fluxo de registro de devoluções ─────────────────────────
export { PainelAteliê };
