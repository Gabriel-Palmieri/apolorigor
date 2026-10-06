import { refreshData } from "../../data/cache.js";
import { useData } from "../../data/useData.js";
import { Button } from "../../shared/ui/botoes/Button.jsx";

export default function AtualizarDados() {
  const { loading } = useData();
  return (
    <Button
      variant="ghost"
      size="compact"
      disabled={loading}
      onClick={() => refreshData()}
    >
      {loading ? "Atualizando…" : "Atualizar dados"}
    </Button>
  );
}
