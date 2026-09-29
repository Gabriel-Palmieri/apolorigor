import { fmtDate } from "../../shared/lib/format.js";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import CategoriaCard from "./CategoriaCard.jsx";
import ParticipanteRow from "./ParticipanteRow.jsx";
export default function PortalNoivo({ planejamento }) {
  const { form, modelo, participantes = [] } = planejamento || {};
  const referencias = [
    [
      "Data do evento",
      form?.dataEvento ? fmtDate(form.dataEvento) : "A definir",
    ],
    ["Retirada e devolução", "Não disponíveis"],
    ["Contrato", "Não contratado"],
  ];
  return (
    <div className="casamento-portal">
      <section className="casamento-bloco">
        <h2 className="m-0 text-title font-display font-medium text-text break-words">
          {form?.noivos || "Seu casamento"}
        </h2>
        <p role="status" className="mt-4 mb-6 text-sm text-text-sub">
          {planejamento
            ? "Prévia visual do planejamento. Não existe pacote contratado, reserva ou pagamento."
            : "O acompanhamento de pacotes e participantes ainda não está disponível. Você pode conhecer a estrutura do portal e planejar os trajes do grupo."}
        </p>
        <dl className="casamento-referencias">
          {referencias.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="casamento-bloco" aria-labelledby="roupas-casamento">
        <h2
          id="roupas-casamento"
          className="mt-0 mb-5 text-lg font-medium text-text"
        >
          Roupas do casamento
        </h2>
        <CategoriaCard produto={modelo} />
        <div className="flex flex-wrap items-center gap-4 mt-5 pt-5 border-t border-border-soft">
          <Button disabled variant="ghost" size="compact">
            Revelar traje do noivo
          </Button>
          <p className="m-0 text-xs text-text-sub">
            A confidencialidade do traje depende do serviço de contratação.
          </p>
        </div>
      </section>
      <section className="casamento-bloco" aria-labelledby="grupo-casamento">
        <div className="flex justify-between items-start gap-4 flex-wrap mb-5">
          <h2
            id="grupo-casamento"
            className="m-0 text-lg font-medium text-text"
          >
            Seu grupo
          </h2>
          <span className="text-xs text-text-sub">
            Retiradas e pagamentos indisponíveis
          </span>
        </div>
        {participantes.length ? (
          <ul className="m-0 p-0 list-none">
            {participantes.map((participante) => (
              <ParticipanteRow
                key={participante.id}
                participante={participante}
              />
            ))}
          </ul>
        ) : (
          <p className="m-0 text-sm text-text-sub">
            {planejamento
              ? "Nenhum participante incluído neste planejamento."
              : "Não há uma lista de participantes disponível para consulta."}
          </p>
        )}
        <p className="mt-5 mb-0 pt-5 border-t border-border-soft text-xs text-text-sub">
          Após a contratação, esta área poderá acompanhar os trajes, as provas e
          as retiradas de cada integrante.
        </p>
      </section>
    </div>
  );
}
