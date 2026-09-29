import { Button } from "../../shared/ui/botoes/Button.jsx";
export default function PainelAtelie() {
  return (
    <section aria-labelledby="costura-heading">
      <div className="flex justify-between items-start gap-4 flex-wrap mb-5">
        <div>
          <h2
            id="costura-heading"
            className="m-0 text-lg font-medium text-text"
          >
            Ordens de costura
          </h2>
          <p className="mt-3 mb-0 text-sm text-text-sub">
            O acompanhamento de costura ainda não está disponível. A estrutura
            do painel foi preservada; não há ordens ou etapas sendo registradas
            por aqui.
          </p>
        </div>
        <Button disabled title="Cadastro de ordens de costura indisponível.">
          Nova ordem de ajuste
        </Button>
      </div>
      <div className="atelier-board">
        {[
          ["Pendente", "Peças aguardando o início do ajuste."],
          ["Em costura", "Ajustes em execução no ateliê."],
          ["Concluído", "Peças com o ajuste finalizado."],
        ].map(([status, description]) => (
          <section key={status} className="atelie-column" aria-label={status}>
            <h3 className="mt-0 mb-3 text-sm font-semibold text-text">
              {status}
            </h3>
            <p className="mt-0 mb-6 text-xs text-text-sub">{description}</p>
            <div className="atelie-column-empty">
              <p className="m-0 text-sm text-text-sub">Ordens indisponíveis</p>
              <p className="mt-2 mb-0 text-xs text-text-sub">
                Os dados desta etapa não estão disponíveis para consulta.
              </p>
            </div>
          </section>
        ))}
      </div>
      <details className="mt-7 border-t border-border">
        <summary className="py-4 cursor-pointer text-sm text-text">
          Campos da ordem de ajuste
        </summary>
        <dl className="m-0 pb-5 grid tablet:grid-cols-3 gap-5 text-sm">
          {[
            ["Traje e tamanho", "Modelo, variante e tamanho da peça."],
            ["Serviço solicitado", "Descrição do ajuste e observações."],
            ["Prazo e andamento", "Previsão de entrega e etapa da costura."],
          ].map(([label, detail]) => (
            <div key={label}>
              <dt className="text-text font-medium">{label}</dt>
              <dd className="m-0 mt-2 text-xs text-text-sub">{detail}</dd>
            </div>
          ))}
        </dl>
      </details>
    </section>
  );
}
