import { useState } from "react";
import { useRequest } from "../../data/useRequest.js";
import { productFromApi } from "../../data/adapters.js";
import SeletorPaginado from "../listas/SeletorPaginado.jsx";
import { useDisponibilidade } from "./useDisponibilidade.js";
import { Field, Select, Input } from "../../shared/ui/formularios/Form.jsx";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
export default function ConsultaDisponibilidade({ date }) {
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [endDate, setEndDate] = useState(date);
  const detail = useRequest(productId ? "/products/" + encodeURIComponent(productId) : null, false);
  const product = detail.data ? productFromApi(detail.data) : null;
  const end = endDate >= date ? endDate : date;
  const result = useDisponibilidade(productId, variantId, date, end);
  return (
    <section className="mt-6 border-t border-border pt-6">
      <h3 className="text-base font-medium">Consultar disponibilidade</h3>
      <div className="grid tablet:grid-cols-3 gap-3">
        <SeletorPaginado endpoint="/products/page" auth={false} label="Modelo" searchLabel="Filtrar trajes" required={false} value={productId} selectedLabel={product?.nome} onChange={id => { setProductId(id); setVariantId(""); }} />
        {detail.error && <Alert>{detail.error.message} <button type="button" onClick={detail.retry}>Tentar novamente</button></Alert>}
        <Field label="Tamanho">
          <Select
            value={variantId}
            onChange={(e) => setVariantId(e.target.value)}
          >
            <option value="">Selecione</option>
            {product?.variantes.map((v) => (
              <option key={v.id} value={v.id}>
                {v.tam}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Até">
          <Input
            type="date"
            value={end}
            min={date}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Field>
      </div>
      {result.loading && (
        <p role="status" className="text-text-sub">
          Consultando reservas…
        </p>
      )}
      {result.error && <Alert>{result.error}</Alert>}
      {result.data && (
        <p role="status" className="text-gold-text">
          {result.data.available} peça(s) disponível(is) ·{" "}
          {result.data.reserved} reservada(s) no período.
        </p>
      )}
    </section>
  );
}
