import { useState } from "react";
import { useRequest } from "../../data/useRequest.js";
import { Field, Input, Select } from "../../shared/ui/formularios/Form.jsx";
import Paginacao from "../../shared/ui/estrutura/Paginacao.jsx";

export default function SeletorPaginado({
  endpoint,
  auth = true,
  label,
  searchLabel,
  value,
  selectedLabel,
  onChange,
  required = true,
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const result = useRequest(
    `${endpoint}${endpoint.includes("?") ? "&" : "?"}${new URLSearchParams({ page, limit: 20, q: search })}`,
    auth,
  );
  const items = result.data?.items || [];
  const selectedName = selected?.id === value ? selected.name : selectedLabel;
  return (
    <div>
      <Field label={searchLabel}>
        <Input
          value={search}
          maxLength={120}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
        />
      </Field>
      <Field label={label}>
        <Select
          required={required}
          value={value}
          onChange={(event) => {
            const item = items.find((row) => row.id === event.target.value);
            setSelected(item);
            onChange(event.target.value);
          }}
        >
          <option value="">Selecione</option>
          {value && !items.some((item) => item.id === value) && (
            <option value={value}>{selectedName || "Seleção atual"}</option>
          )}
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
              {item.email ? ` · ${item.email}` : ""}
            </option>
          ))}
        </Select>
      </Field>
      {result.error && (
        <button type="button" onClick={result.retry}>
          Tentar novamente
        </button>
      )}
      <Paginacao
        pagination={result.data}
        pending={result.loading}
        error={result.error?.message}
        onPage={setPage}
      />
    </div>
  );
}
