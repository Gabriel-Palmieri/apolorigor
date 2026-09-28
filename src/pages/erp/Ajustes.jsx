import { Devolucoes } from "../../features/ajustes/Devolucoes.jsx";
import { PainelAteliê } from "../../features/ajustes/PainelAtelie.jsx";
import { Card } from "../../shared/ui/Surfaces.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useData } from "../../data/useData.js";
import { useSearchParams } from "react-router-dom";
// ── Painel de acompanhamento do ateliê ──────────────────────

// ── Main ──────────────────────────────────────────────────────
export default function Ajustes() {
  const { produtos, trans, ajustes, setAjustes } = useData();
  const [params, setParams] = useSearchParams();
  const aba = params.get('aba') === 'dev' ? 'dev' : 'painel';
  const setAba = value => setParams(current => {
    const next = new URLSearchParams(current);
    if (value === 'dev') next.set('aba', 'dev');
    else next.delete('aba');
    return next;
  });
  return (
    <div>
      <div className="flex gap-1.5 mb-4">
        {[
          {
            key: "painel",
            label: "Painel do Ateliê",
          },
          {
            key: "dev",
            label: "Registrar Devolução",
          },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setAba(key)}
            className={cn(
              "py-1.5 px-4 rounded-card cursor-pointer text-xs font-semibold font-sans",
              aba === key ? "bg-gold" : "bg-transparent",
              aba === key ? "text-accent-ink" : "text-text-sub",
              aba === key ? "border-0" : "border border-border",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {aba === "painel" &&
        (ajustes.length === 0 ? (
          <Card>
            <p className="text-text-sub text-compact m-0">
              Nenhum ajuste em andamento. Ajustes são criados automaticamente
              quando uma locação usa um tamanho maior que o pedido, ou
              manualmente ao registrar uma devolução.
            </p>
          </Card>
        ) : (
          <PainelAteliê
            produtos={produtos}
            ajustes={ajustes}
            setAjustes={setAjustes}
          />
        ))}

      {aba === "dev" && (
        <Devolucoes
          produtos={produtos}
          trans={trans}
        />
      )}
    </div>
  );
}
