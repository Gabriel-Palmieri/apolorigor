import { useDevolucoes } from "./useDevolucoes.js";
import { Card } from "../../shared/ui/Surfaces.jsx";
import { SectionTitle } from "../../shared/ui/Typography.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Select, TextArea, Input } from "../../shared/ui/Form.jsx";
import { Alert } from "../../shared/ui/Feedback.jsx";
// ── Painel de acompanhamento do ateliê ──────────────────────
// ── Fluxo de registro de devoluções ─────────────────────────
function Devolucoes({ produtos, trans }) {
  const { d, setD, msg, setMsg, erro, opcoes, confirmar } = useDevolucoes({
    produtos,
    trans,
  });
  return (
    <Card className="border-gold">
      <SectionTitle>REGISTRAR DEVOLUÇÃO</SectionTitle>
      {msg && <Alert tone="success">{msg}</Alert>}
      {erro && <Alert tone="error">{erro}</Alert>}
      {opcoes.length === 0 ? (
        <p className="text-text-sub text-compact">
          Não há locações em aberto para devolução.
        </p>
      ) : (
        <>
          <Select
            label="Locação em aberto"
            value={d.key}
            onChange={(e) => {
              setD((x) => ({
                ...x,
                key: e.target.value,
              }));
              setMsg("");
            }}
            options={opcoes.map((o) => ({
              value: o.key,
              label: o.label,
            }))}
          />
          <TextArea
            label="Avarias ou problemas identificados na peça"
            value={d.avarias}
            onChange={(e) =>
              setD((x) => ({
                ...x,
                avarias: e.target.value,
              }))
            }
            placeholder="Descreva manchas, rasgos, botões faltando, odor, etc. Deixe em branco se a peça voltou em bom estado."
          />
          <div className="flex items-center gap-2.5 mt-1 mx-0 mb-3.5">
            <input
              type="checkbox"
              id="cb-ajuste"
              checked={d.precisaAjuste}
              onChange={(e) =>
                setD((x) => ({
                  ...x,
                  precisaAjuste: e.target.checked,
                }))
              }
              className="w-4 h-4 cursor-pointer accent-gold"
            />
            <label
              htmlFor="cb-ajuste"
              className="text-compact text-text-sub cursor-pointer"
            >
              Peça precisa de ajuste ou reparo no ateliê antes de voltar ao
              estoque
            </label>
          </div>
          {d.precisaAjuste && (
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-y-0 gap-x-3.5">
              <Input
                label="Descrição do reparo"
                value={d.desc}
                onChange={(e) =>
                  setD((x) => ({
                    ...x,
                    desc: e.target.value,
                  }))
                }
                placeholder="Ex: Costurar bainha rasgada"
              />
              <Input
                label="Data Prevista de Entrega"
                type="date"
                value={d.entrega}
                onChange={(e) =>
                  setD((x) => ({
                    ...x,
                    entrega: e.target.value,
                  }))
                }
              />
            </div>
          )}
          <Button onClick={confirmar} size="compact">
            Confirmar Devolução
          </Button>
        </>
      )}
    </Card>
  );
}

// ── Main ──────────────────────────────────────────────────────
export { Devolucoes };
