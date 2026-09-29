import { resumoAcervo } from "../../domain/catalogo.js";
export default function EstoqueResumo({ produtos }) {
  const resumo = resumoAcervo(produtos);
  return (
    <dl className="m-0 mb-5 py-5 border-y border-border grid grid-cols-2 desktop:grid-cols-4 gap-5">
      {[
        ["Modelos cadastrados", resumo.modelos],
        ["Modelos ativos", resumo.ativos],
        ["Modelos inativos", resumo.inativos],
        ["Peças cadastradas", resumo.pecas],
      ].map(([label, count]) => (
        <div key={label}>
          <dt className="text-xs text-text-sub">{label}</dt>
          <dd className="m-0 mt-2 text-xl font-medium tabular-nums text-gold-text">
            {count}
          </dd>
        </div>
      ))}
    </dl>
  );
}
