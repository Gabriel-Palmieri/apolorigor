import { Button } from "../botoes/Button.jsx";

export default function Paginacao({ pagination, pending, error, onPage, label = "Paginação da lista" }) {
  if (!pagination) return null;
  const { page, pages, total } = pagination;
  return (
    <nav
      aria-label={label}
      className="flex items-center justify-between flex-wrap gap-3 py-5"
    >
      <p role="status" aria-live="polite" className="m-0 text-sm text-text-sub">
        {pending
          ? "Atualizando lista…"
          : error
            ? "Não foi possível atualizar esta página."
            : `Página ${page} de ${pages} · ${total} registro(s)`}
      </p>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="compact"
          disabled={pending || page <= 1}
          onClick={() => onPage(page - 1)}
        >
          Anterior
        </Button>
        <Button
          variant="ghost"
          size="compact"
          disabled={pending || page >= pages}
          onClick={() => onPage(page + 1)}
        >
          Próxima
        </Button>
      </div>
    </nav>
  );
}
