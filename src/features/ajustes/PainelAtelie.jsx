import { AJUSTE_STATUS } from "../../domain/statuses.js";
import { statusAppearance, colorClass } from "../../shared/ui/palette.js";
import { Card } from "../../shared/ui/Surfaces.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { cn } from "../../shared/lib/cn.js";
import { AJUSTE_MAP } from "../../shared/ui/status.js";
import { fmtDate } from "../../shared/lib/format.js";
import { useRef, useState } from 'react';
import { useAtelieDrag } from './useAtelieDrag.js';

function PainelAteliê({ produtos, ajustes, setAjustes }) {
  const colunas = AJUSTE_STATUS;
  const boardRef = useRef(null);
  const [announcement, setAnnouncement] = useState('');
  const avancar = (id, status) => {
    const ajuste = ajustes.find(item => item.id === id);
    if (!ajuste || ajuste.status === status || !colunas.includes(status)) return;
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
    const nome = produtos.find(produto => produto.id === ajuste.produtoId)?.nome || 'Ajuste';
    setAnnouncement(`${nome} movido para ${status}.`);
    requestAnimationFrame(() => boardRef.current?.querySelector(`[data-ajuste-id="${id}"]`)?.focus({ preventScroll: true }));
  };
  const drag = useAtelieDrag(avancar);
  return (
    <div ref={boardRef}>
      <p className="mt-0 mb-4 text-xs text-text-sub">Arraste os cartões entre as etapas ou use os botões para mudar o status.</p>
      <p className="sr-only" role="status" aria-live="polite">{announcement}</p>
      <div className="grid grid-cols-1 tablet:grid-cols-3 gap-4">
      {colunas.map((col) => {
        const itens = ajustes.filter((a) => a.status === col);
        const s = statusAppearance(AJUSTE_MAP, col);
        return (
          <section key={col} aria-label={col} {...drag.columnProps(col)} className={cn('atelie-column', drag.dragging !== null && 'atelie-column-ready', drag.over === col && 'atelie-column-over')}>
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
            <div className="atelie-drop-area">
              {itens.length === 0 && (
                <Card className="p-3.5">
                  <p className="m-0 text-xs text-text-sub">{drag.dragging !== null ? 'Solte o cartão aqui.' : 'Nenhum item.'}</p>
                </Card>
              )}
              {itens.map((a) => {
                const produto = produtos.find((p) => p.id === a.produtoId);
                return (
                  <article
                    key={a.id}
                    data-ajuste-id={a.id}
                    aria-label={'Ajuste de ' + (produto?.nome || 'produto')}
                    tabIndex={-1}
                    {...drag.cardProps(a.id)}
                    className={cn(
                      'atelie-drag-card',
                      drag.dragging === a.id && 'atelie-drag-card-active',
                    )}
                  >
                    <Card className={cn('p-3.5', 'border-l-4', colorClass(s.color, 'border'))}>
                    <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-text text-compact mt-0 mx-0 mb-1 font-display">
                      {produto?.nome || "—"}
                    </p>
                    <span className="atelie-drag-handle" aria-hidden="true" {...drag.touchProps(a.id)}>
                      <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor">
                        <circle cx="5" cy="4" r="1.25" /><circle cx="11" cy="4" r="1.25" />
                        <circle cx="5" cy="10" r="1.25" /><circle cx="11" cy="10" r="1.25" />
                        <circle cx="5" cy="16" r="1.25" /><circle cx="11" cy="16" r="1.25" />
                      </svg>
                    </span>
                    </div>
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
                    <div className="flex flex-wrap gap-1.5">
                      {col !== 'Pendente' && <Button onClick={() => avancar(a.id, col === 'Concluído' ? 'Em costura' : 'Pendente')} size="compact" variant="ghost">
                        {col === 'Concluído' ? 'Reabrir costura' : 'Voltar para pendente'}
                      </Button>}
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
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
      </div>
    </div>
  );
}

// ── Fluxo de registro de devoluções ─────────────────────────
export { PainelAteliê };
