import { useState } from "react";
import { Drawer } from "../../shared/ui/dialogos/Modal.jsx";
import { Field, Input, Select } from "../../shared/ui/formularios/Form.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
import { salvarProduto, desativarProduto } from "../../data/catalogo.js";
import { CATEGORIAS } from "../../domain/catalogo.js";
export default function FormularioProdutoGestao({ produto, onClose }) {
  const [form, setForm] = useState({
    nome: produto?.nome || "",
    categoria: produto?.categoria || "Terno",
    colecao: produto?.colecao || "",
    tecido: produto?.tecido || "",
    cor: produto?.cor || "",
    linha: produto?.linha || "",
    foto: produto?.foto || "",
    aluguel: produto?.aluguel ?? "",
    venda: produto?.venda ?? "",
  });
  const [variantes, setVariantes] = useState(
    produto?.variantes.map((v) => ({ ...v })) || [{ tam: "", qtd: 0 }],
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      if (new Set(variantes.map((v) => v.tam.trim())).size !== variantes.length)
        throw new Error("Cada tamanho deve aparecer apenas uma vez.");
      await salvarProduto({ ...form, id: produto?.id, variantes });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  async function deactivate() {
    if (
      busy ||
      !window.confirm("Desativar este modelo? O histórico será preservado.")
    )
      return;
    setBusy(true);
    setError("");
    try {
      await desativarProduto(produto.id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Drawer
      title={produto ? "Editar modelo" : "Cadastrar modelo"}
      onClose={onClose}
    >
      <form onSubmit={submit} aria-busy={busy}>
        <fieldset className="border-0 p-0 m-0 min-w-0" disabled={busy}>
          {error && <Alert>{error}</Alert>}
          <Field label="Nome">
            <Input
              required
              minLength={2}
              maxLength={120}
              value={form.nome}
              onChange={set("nome")}
            />
          </Field>
          <Field label="Categoria">
            <Select required value={form.categoria} onChange={set("categoria")}>
              {[...new Set([...CATEGORIAS, form.categoria])].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          {[
            ["colecao", "Coleção"],
            ["tecido", "Tecido"],
            ["cor", "Cor"],
            ["linha", "Linha"],
          ].map(([key, label]) => (
            <Field key={key} label={label}>
              <Input maxLength={80} value={form[key]} onChange={set(key)} />
            </Field>
          ))}
          <Field label="Foto" hint="Endereço HTTPS da imagem.">
            <Input
              type="url"
              pattern="https://.*"
              value={form.foto}
              onChange={set("foto")}
              placeholder="https://…"
            />
          </Field>
          <div className="grid tablet:grid-cols-2 gap-4">
            <Field label="Aluguel (R$)">
              <Input
                required
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                value={form.aluguel}
                onChange={set("aluguel")}
              />
            </Field>
            <Field label="Venda (R$)">
              <Input
                required
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                value={form.venda}
                onChange={set("venda")}
              />
            </Field>
          </div>
          <h3 className="font-medium text-base">Grade de tamanhos</h3>
          <p className="text-sm text-text-sub">
            Os tamanhos existentes são preservados. A quantidade não pode ficar
            abaixo das reservas.
          </p>
          {variantes.map((v, index) => (
            <div key={v.id || index} className="grid grid-cols-2 gap-3">
              <Field label={"Tamanho " + (index + 1)}>
                <Input
                  required
                  maxLength={20}
                  readOnly={Boolean(v.id)}
                  value={v.tam}
                  onChange={(e) =>
                    setVariantes((current) =>
                      current.map((item, i) =>
                        i === index ? { ...item, tam: e.target.value } : item,
                      ),
                    )
                  }
                />
              </Field>
              <Field label={"Quantidade " + (index + 1)}>
                <Input
                  required
                  type="number"
                  min="0"
                  max="100000"
                  step="1"
                  value={v.qtd}
                  onChange={(e) =>
                    setVariantes((current) =>
                      current.map((item, i) =>
                        i === index ? { ...item, qtd: e.target.value } : item,
                      ),
                    )
                  }
                />
              </Field>
            </div>
          ))}
          <Button
            variant="ghost"
            size="compact"
            disabled={variantes.length >= 50}
            onClick={() =>
              setVariantes((current) => [...current, { tam: "", qtd: 0 }])
            }
          >
            Adicionar tamanho
          </Button>
          <div className="flex flex-wrap gap-3 mt-6">
            <Button type="submit">
              {busy ? "Salvando…" : "Salvar modelo"}
            </Button>
            {produto?.ativo && (
              <Button variant="ghost" onClick={deactivate}>
                Desativar modelo
              </Button>
            )}
          </div>
        </fieldset>
      </form>
    </Drawer>
  );
}
