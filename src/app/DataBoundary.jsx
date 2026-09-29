import { useData } from "../data/useData.js";
import { refreshData } from "../data/cache.js";
import { Button } from "../shared/ui/botoes/Button.jsx";
export function DataBoundary({ children }) {
  const data = useData();
  if (!data.initialized) {
    if (data.error) return (
      <div className="max-w-xl mx-auto px-6 py-12">
        <h2 className="m-0 text-xl font-medium text-text">Os dados estão indisponíveis no momento.</h2>
        <p role="alert" className="mt-3 mb-6 text-sm text-text-sub">{data.error}</p>
        <Button variant="ghost" disabled={data.loading} onClick={() => refreshData()}>
          {data.loading ? "Tentando novamente…" : "Tentar novamente"}
        </Button>
      </div>
    );
    return <p className="px-6 py-8 text-text-sub" role="status">Carregando dados…</p>;
  }
  return children;
}
