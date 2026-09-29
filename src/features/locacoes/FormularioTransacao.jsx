import { useState } from "react";
import { useData } from "../../data/useData.js";
import { salvarTransacao } from "../../data/transacoes.js";
import { consultarDisponibilidade } from "../../data/catalogo.js";
import { Drawer } from "../../shared/ui/dialogos/Modal.jsx";
import { Field, Input, Select } from "../../shared/ui/formularios/Form.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
export default function FormularioTransacao({
  row,
  initialType = "RENTAL",
  onClose,
}) {
  const { produtos, profiles } = useData();
  const [type, setType] = useState(row?.type || initialType);
  const [profileId, setProfileId] = useState(row?.profileId || "");
  const [productId, setProductId] = useState(row?.variant.productId || "");
  const [variantId, setVariantId] = useState(row?.variantId || "");
  const [price, setPrice] = useState(row ? String(row.priceCents / 100) : "");
  const [startDate, setStartDate] = useState(row?.startDate || "");
  const [endDate, setEndDate] = useState(row?.endDate || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const product = produtos.find((p) => p.id === productId);
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (type === "RENTAL") {
        if (endDate < startDate)
          throw new Error("A devolução não pode ser anterior à retirada.");
        // A edição do próprio rascunho não ocupa estoque; a confirmação é validada no servidor.
        const available = await consultarDisponibilidade(
          productId,
          variantId,
          startDate,
          endDate,
        );
        if (available.available < 1)
          throw new Error(
            "Não há uma peça disponível neste período. Escolha outras datas ou tamanho.",
          );
      }
      const body = {
        variantId,
        ...(price !== ""
          ? { priceCents: Math.round(Number(price) * 100) }
          : {}),
        ...(type === "RENTAL" ? { startDate, endDate } : {}),
      };
      if (!row) {
        body.profileId = profileId;
        body.type = type;
      }
      await salvarTransacao(row?.id, body);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Drawer title={row ? "Editar rascunho" : "Nova operação"} onClose={onClose}>
      <form onSubmit={submit} aria-busy={busy}>
        {error && <Alert>{error}</Alert>}
        {!row && (
          <>
            <Field label="Modalidade">
              <Select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPrice("");
                }}
              >
                <option value="RENTAL">Locação</option>
                <option value="SALE">Venda</option>
              </Select>
            </Field>
            <Field label="Cliente cadastrado">
              <Select
                required
                value={profileId}
                onChange={(e) => setProfileId(e.target.value)}
              >
                <option value="">Selecione</option>
                {profiles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} · {p.email}
                  </option>
                ))}
              </Select>
            </Field>
          </>
        )}
        <Field label="Modelo">
          <Select
            required
            value={productId}
            onChange={(e) => {
              setProductId(e.target.value);
              setVariantId("");
              setPrice("");
            }}
          >
            <option value="">Selecione</option>
            {produtos
              .filter((p) => p.ativo || p.id === row?.variant.productId)
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
          </Select>
        </Field>
        <Field label="Tamanho">
          <Select
            required
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
        {type === "RENTAL" && (
          <>
            <Field label="Retirada">
              <Input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </Field>
            <Field label="Devolução">
              <Input
                type="date"
                required
                min={startDate}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </Field>
          </>
        )}
        <Field
          label="Valor em reais"
          hint="Deixe vazio para usar o preço do catálogo."
        >
          <Input
            type="number"
            min="0"
            max="1000000"
            step="0.01"
            value={price}
            placeholder={
              product
                ? String(type === "SALE" ? product.venda : product.aluguel)
                : ""
            }
            onChange={(e) => setPrice(e.target.value)}
          />
        </Field>
        <p className="text-sm text-text-sub">
          A operação será salva em rascunho. A confirmação reserva ou dá baixa
          na peça.
        </p>
        <Button type="submit" disabled={busy}>
          {busy ? "Salvando…" : "Salvar rascunho"}
        </Button>
      </form>
    </Drawer>
  );
}
