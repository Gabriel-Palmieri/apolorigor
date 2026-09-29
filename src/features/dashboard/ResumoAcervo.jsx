import { Link } from "react-router-dom";
import { resumoAcervo } from "../../domain/catalogo.js";
import { resumoOperacoes } from "../../domain/dashboard.js";
import { money } from "../../shared/lib/format.js";
export default function ResumoAcervo({ produtos, trans }) {
  const acervo = resumoAcervo(produtos);
  const operacoes = resumoOperacoes(trans);
  const valores = [
    ["Modelos cadastrados", acervo.modelos],
    ["Modelos ativos", acervo.ativos],
    ["Peças cadastradas", acervo.pecas],
    ["Locações confirmadas em aberto", operacoes.locacoesAbertas],
    ["Valor das operações", money(operacoes.valorCentavos / 100)],
  ];
  return (
    <details className="dashboard-summary">
      <summary className="cursor-pointer py-5 text-sm font-medium text-text">
        Acervo e operações
      </summary>
      <div className="pb-6">
        <dl className="m-0 grid grid-cols-2 desktop:grid-cols-3 gap-x-8 gap-y-6">
          {valores.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-text-sub">{label}</dt>
              <dd className="dashboard-number m-0 mt-2 text-lg">{value}</dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">
          <Link to="/sistema/estoque" className="dashboard-text-link">
            Consultar estoque
          </Link>
          <Link to="/sistema/locacoes" className="dashboard-text-link">
            Ver operações
          </Link>
        </div>
        <p className="mt-3 mb-0 text-xs text-text-sub">
          Quantidades físicas cadastradas; consulte a disponibilidade por
          período. O valor considera operações confirmadas ou concluídas, exclui
          rascunhos e cancelamentos e não representa pagamentos recebidos.
        </p>
      </div>
    </details>
  );
}
