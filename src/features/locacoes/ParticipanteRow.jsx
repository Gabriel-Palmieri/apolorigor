import { statusAppearance, colorClass } from "../../shared/ui/palette.js";
import { Button } from "../../shared/ui/Button.jsx";
import { cn } from "../../shared/lib/cn.js";
import { fmt } from '../../shared/lib/format.js';
import { PAGAMENTO_MAP } from "../../shared/ui/status.js";
import { integranteCompareceu } from '../../domain/rules.js';
// ── Linha de participante (Contratos individuais) ────────────────────
function ParticipanteRow({
  integrante,
  produto,
  onEditar
}) {
  const compareceu = integranteCompareceu(integrante);
  const pagInfo = statusAppearance(PAGAMENTO_MAP, integrante.pagamento) || statusAppearance(PAGAMENTO_MAP, 'Pendente');
  const valor = integrante.excecaoPreco !== '' && integrante.excecaoPreco != null ? integrante.excecaoPreco : integrante.precoNegociado;
  return <div className="py-3 px-0 border-b border-b-border">
      <div className="grid grid-cols-1 wide:grid-cols-package-row gap-3.5 items-center">
        <div>
          {compareceu ? <span className="inline-block py-1 px-2.5 rounded-card bg-gold text-accent-ink font-bold text-xs">{integrante.numeroContrato}</span> : <span className="inline-block py-1 px-2.5 rounded-card border border-dashed border-border text-text-sub text-micro">Sem contrato</span>}
        </div>
        <div>
          <p className="m-0 font-semibold text-text text-compact">{integrante.nome}</p>
          <p className="mt-0.5 mx-0 mb-0 text-caption text-text-sub">{integrante.papel}</p>
        </div>
        <div>
          <p className="m-0 text-micro text-text-sub tracking-wide">TRAJE</p>
          <p className="mt-0.5 mx-0 mb-0 text-xs text-text">{produto?.nome || '—'}</p>
        </div>
        <div>
          <p className="m-0 text-micro text-text-sub tracking-wide">VALOR A COBRAR</p>
          <p className="mt-0.5 mx-0 mb-0 text-compact font-bold text-gold-text">R$ {fmt(valor)}</p>
          <p className={cn("mt-0.5 mx-0 mb-0 text-micro", colorClass(pagInfo.color, "text"))}>{integrante.pagamento}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={cn("py-1 px-2 rounded-control text-micro font-semibold font-mono tabular-nums", cn("border", compareceu ? "border-gold" : "border-border"), compareceu ? "text-gold-text" : "text-text-sub")}>
            {compareceu ? '✓ Contrato aberto' : 'Aguardando contrato'}
          </span>
          <Button onClick={onEditar} size="compact" variant="ghost">Editar</Button>
        </div>
      </div>
    </div>;
}

// ── Modal "Atualizar [Nome]" ──────────────────────────────────────────
export { ParticipanteRow };
