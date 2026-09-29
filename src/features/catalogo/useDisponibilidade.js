import { useEffect, useState } from "react";
import { consultarDisponibilidade } from "../../data/catalogo.js";
export function useDisponibilidade(
  productId,
  variantId,
  startDate,
  endDate,
  enabled = true,
) {
  const key = [productId, variantId, startDate, endDate].join("|");
  const valid =
    enabled &&
    productId &&
    variantId &&
    startDate &&
    endDate &&
    endDate >= startDate;
  const [result, setResult] = useState({
    key: "",
    loading: false,
    error: "",
    data: null,
  });
  useEffect(() => {
    if (!valid) return;
    const controller = new AbortController();
    let active = true;
    setResult({ key, loading: true, error: "", data: null });
    consultarDisponibilidade(
      productId,
      variantId,
      startDate,
      endDate,
      controller.signal,
    )
      .then((data) => {
        if (active) setResult({ key, loading: false, error: "", data });
      })
      .catch((error) => {
        if (active)
          setResult({ key, loading: false, error: error.message, data: null });
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [productId, variantId, startDate, endDate, key, valid]);
  if (!valid) return { loading: false, error: "", data: null };
  return result.key === key ? result : { loading: true, error: "", data: null };
}
