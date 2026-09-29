import { useState } from "react";
import { useData } from "../../data/useData.js";
import { useDisponibilidade } from "./useDisponibilidade.js";
import { Field, Select, Input } from "../../shared/ui/formularios/Form.jsx";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
export default function ConsultaDisponibilidade({ date }) {
  const { produtos } = useData();
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [endDate, setEndDate] = useState(date);
  const product = produtos.find((p) => p.id === productId);
  const end = endDate >= date ? endDate : date;
  const result = useDisponibilidade(productId, variantId, date, end);
  return (
    <section className="mt-6 border-t border-border pt-6">
      <h3 className="text-base font-medium">Consultar disponibilidade</h3>
      <div className="grid tablet:grid-cols-3 gap-3">
        <Field label="Modelo">
          <Select
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setVariantId("");
            }}
          >
            <option value="">Selecione</option>
            {produtos
              .filter((p) => p.ativo)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
          </Select>
        </Field>
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
