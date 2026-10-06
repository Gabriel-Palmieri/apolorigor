import { useSearchParams } from "react-router-dom";
import { useData } from "../../data/useData.js";

export function useListaPaginada(
  resource,
  pageParam = "pagina",
  searchParam = "busca",
) {
  const [params, setParams] = useSearchParams();
  const { resources } = useData();
  const status = resources[resource];
  function filter(key, value) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current);
        if (value) next.set(key, value);
        else next.delete(key);
        next.delete(pageParam);
        return next;
      },
      { replace: key === "busca" },
    );
  }
  function changePage(page) {
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.set(pageParam, String(page));
      return next;
    });
  }
  return {
    params,
    filter,
    changePage,
    searchParam,
    pagination: status.pagination,
    pending: status.loading,
    error: status.error,
    changingPage: status.requestedKey !== status.queryKey,
  };
}
