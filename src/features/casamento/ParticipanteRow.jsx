import { Button } from "../../shared/ui/botoes/Button.jsx";
export default function ParticipanteRow({ participante, onEditar, onRemover }) {
  return (
    <li className="casamento-participante">
      <div className="min-w-0">
        <p className="m-0 text-sm font-medium text-text break-words">
          {participante.nome}
        </p>
        <p className="mt-1 mb-0 text-xs text-text-sub">
          {participante.papel}
          {participante.tamanho
            ? " · Tamanho de referência " + participante.tamanho
            : ""}
        </p>
      </div>
      {onEditar ? (
        <div className="flex flex-wrap gap-2 shrink-0">
          <Button
            variant="ghost"
            size="compact"
            onClick={() => onEditar(participante)}
          >
            Editar {participante.nome}
          </Button>
          <Button
            variant="ghost"
            size="compact"
            onClick={() => onRemover(participante.id)}
          >
            Remover {participante.nome}
          </Button>
        </div>
      ) : (
        <span className="text-xs text-text-sub">Somente no planejamento</span>
      )}
    </li>
  );
}
