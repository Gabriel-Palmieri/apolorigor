import { Badge, Chip } from "../../shared/ui/Feedback.jsx";
import { SectionTitle } from "../../shared/ui/Typography.jsx";
import { Input, Select } from "../../shared/ui/Form.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Drawer } from "../../shared/ui/Modal.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useState, useRef } from "react";
import { C } from "../../shared/ui/palette.js";
import { STATUS_MAP } from "../../shared/ui/status.js";
import { fmt } from "../../shared/lib/format.js";
import {
  CATEGORIAS,
  COLECOES,
  TECIDOS,
  LINHAS,
  TAM_OPTIONS,
} from "../../domain/catalog.js";
import {
  statusProduto,
  statusVariante,
  contagemProduto,
  contagemVariante,
} from "../../domain/rules.js";
import { PLACEHOLDER } from "../../shared/lib/images.js";
import { StockBreakdown } from "./EstoqueResumo.jsx";
function ImageUpload({ value, onChange }) {
  const fileRef = useRef(null);
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => onChange(ev.target.result);
    reader.readAsDataURL(file);
  };
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        onClick={() => fileRef.current.click()}
        title="Clique para trocar a foto"
        className={cn(
          "w-24 h-32 rounded-card overflow-hidden cursor-pointer shrink-0",
          cn("border border-dashed", value ? "border-gold" : "border-border"),
        )}
      >
        <img
          src={value || PLACEHOLDER}
          alt="preview"
          className="w-full h-full object-cover block"
        />
      </div>
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        className="py-1 px-2.5 bg-transparent font-sans text-gold-text border border-gold-dim rounded-card text-caption cursor-pointer w-full"
      >
        Escolher foto
      </button>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="py-1 px-2.5 bg-transparent font-sans text-text-sub border border-border rounded-card text-micro cursor-pointer w-full"
        >
          Remover
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
function GradeEditor({ variantes, setVariantes }) {
  const [novoTam, setNovoTam] = useState("");
  const addTam = () => {
    if (!novoTam || variantes.some((v) => v.tam === novoTam)) return;
    setVariantes((prev) => [
      ...prev,
      {
        tam: novoTam,
        qtd: 0,
      },
    ]);
    setNovoTam("");
  };
  const setQtd = (tam, qtd) =>
    setVariantes((prev) =>
      prev.map((v) =>
        v.tam === tam
          ? {
              ...v,
              qtd: Math.max(0, qtd),
            }
          : v,
      ),
    );
  const removeTam = (tam) =>
    setVariantes((prev) => prev.filter((v) => v.tam !== tam));
  return (
    <div>
      <div className="flex flex-col gap-2 mb-3">
        {variantes.map((v) => (
          <div
            key={v.tam}
            className="flex items-center justify-between py-2 px-3 bg-bg-elevated border border-border-soft rounded-card"
          >
            <span className="text-compact font-bold text-text min-w-12">
              {v.tam}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQtd(v.tam, v.qtd - 1)}
                className="w-6 h-6 rounded-card border border-border bg-transparent text-text cursor-pointer text-sm font-sans leading-none"
              >
                −
              </button>
              <input
                type="number"
                value={v.qtd}
                onChange={(e) => setQtd(v.tam, Number(e.target.value) || 0)}
                className="w-12 text-center py-1 px-1 bg-input-bg border border-border rounded-card text-text text-compact font-sans"
              />
              <button
                type="button"
                onClick={() => setQtd(v.tam, v.qtd + 1)}
                className="w-6 h-6 rounded-card border border-border bg-transparent text-text cursor-pointer text-sm font-sans leading-none"
              >
                +
              </button>
              <button
                type="button"
                onClick={() => removeTam(v.tam)}
                className="w-6 h-6 rounded-card border border-border bg-transparent text-text cursor-pointer text-sm font-sans leading-none text-red-fg ml-1.5"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
        {variantes.length === 0 && (
          <p className="text-xs text-text-muted m-0">
            Nenhum tamanho cadastrado ainda.
          </p>
        )}
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <Select
            label="Adicionar tamanho à grade"
            value={novoTam}
            onChange={(e) => setNovoTam(e.target.value)}
            options={[...TAM_OPTIONS, "Único"].filter(
              (t) => !variantes.some((v) => v.tam === t),
            )}
          />
        </div>
        <div className="mb-3">
          <Button onClick={addTam} size="compact" variant="ghost">
            + Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
}
function ProdutoDrawer({ produto, trans, ajustes, onClose, onSave, onDelete }) {
  const isNew = !produto?.id;
  const [f, setF] = useState({
    nome: produto?.nome || "",
    categoria: produto?.categoria || "Terno",
    colecao: produto?.colecao || COLECOES[0],
    tecido: produto?.tecido || TECIDOS[0],
    cor: produto?.cor || "",
    linha: produto?.linha || "Padronizada",
    aluguel: String(produto?.aluguel ?? ""),
    venda: String(produto?.venda ?? ""),
    foto: produto?.foto || "",
  });
  const [variantes, setVariantes] = useState(
    produto?.variantes
      ? produto.variantes.map((v) => ({
          ...v,
        }))
      : [],
  );
  const [editando, setEditando] = useState(isNew);
  const counts = produto ? contagemProduto(produto, trans, ajustes) : null;
  const salvar = () => {
    if (!f.nome || !f.cor) return;
    onSave({
      ...(produto || {}),
      ...f,
      aluguel: Number(f.aluguel) || 0,
      venda: Number(f.venda) || 0,
      variantes,
    });
    if (!isNew) setEditando(false);
    else onClose();
  };
  return (
    <Drawer
      title={isNew ? "Cadastrar Novo Modelo" : produto.nome}
      subtitle={
        isNew
          ? "Módulo 1 — cadastro e catálogo"
          : `${produto.categoria} · ${produto.colecao}`
      }
      onClose={onClose}
    >
      {!editando && !isNew && (
        <div className="mb-5">
          <div className="flex gap-4 mb-4">
            <img
              src={produto.foto || PLACEHOLDER}
              alt={produto.nome}
              className="w-24 h-32 object-cover rounded-card border border-border"
            />
            <div className="flex-1">
              <div className="flex gap-1.5 mb-2 flex-wrap">
                <Chip
                  color={
                    produto.linha === "Premium"
                      ? C.gold
                      : "var(--status-grey-fg)"
                  }
                >
                  {produto.linha}
                </Chip>
                <Badge
                  label={statusProduto(produto, trans, ajustes)}
                  map={STATUS_MAP}
                />
              </div>
              <p className="mt-0 mx-0 mb-0.5 text-compact text-text-sub">
                {produto.cor} · {produto.tecido}
              </p>
              <div className="flex gap-4 mt-2.5">
                <div>
                  <p className="mt-0 mx-0 mb-0.5 text-micro text-text-sub font-bold tracking-wide">
                    ALUGUEL
                  </p>
                  <p className="m-0 text-base text-gold-text font-bold">
                    R$ {fmt(produto.aluguel)}
                  </p>
                </div>
                <div>
                  <p className="mt-0 mx-0 mb-0.5 text-micro text-text-sub font-bold tracking-wide">
                    VENDA
                  </p>
                  <p className="m-0 text-base text-gold-text font-bold">
                    R$ {fmt(produto.venda)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <StockBreakdown counts={counts} />

          <SectionTitle className="mt-5 mx-0 mb-3">
            GRADE DE TAMANHOS — ESTOQUE EM TEMPO REAL
          </SectionTitle>
          <div className="flex flex-col gap-2">
            {produto.variantes.map((v) => {
              const c = contagemVariante(produto, v.tam, trans, ajustes);
              const st = statusVariante(produto, v.tam, trans, ajustes);
              return (
                <div
                  key={v.tam}
                  className="flex items-center justify-between py-2.5 px-3 bg-bg-elevated border border-border-soft rounded-card"
                >
                  <span className="text-compact font-bold text-text min-w-11">
                    {v.tam}
                  </span>
                  <span className="text-xs text-text-sub flex-1 text-center">
                    <b className="text-text">{c.total}</b> total ·{" "}
                    <b className="text-green-fg">{c.disponivel}</b> livre ·{" "}
                    <b className="text-orange-fg">{c.alugado}</b> alugada
                    {c.ajuste > 0 && (
                      <>
                        {" "}
                        · <b className="text-yellow-fg">{c.ajuste}</b> ajuste
                      </>
                    )}
                  </span>
                  <Badge label={st} map={STATUS_MAP} />
                </div>
              );
            })}
          </div>

          <div className="flex gap-2 mt-5">
            <Button onClick={() => setEditando(true)} size="compact">
              Editar Modelo
            </Button>
            <Button
              color="var(--status-red-fg)"
              onClick={() => onDelete(produto.id)}
              size="compact"
              variant="ghost"
            >
              Excluir
            </Button>
          </div>
        </div>
      )}

      {(editando || isNew) && (
        <div>
          <div className="flex gap-4 mb-1.5 items-start">
            <ImageUpload
              value={f.foto}
              onChange={(v) =>
                setF((x) => ({
                  ...x,
                  foto: v,
                }))
              }
            />
            <div className="flex-1">
              <Input
                label="Modelo / Nome"
                value={f.nome}
                onChange={(e) =>
                  setF((x) => ({
                    ...x,
                    nome: e.target.value,
                  }))
                }
                placeholder="Ex: Terno Oxford Slim"
              />
              <Input
                label="Cor"
                value={f.cor}
                onChange={(e) =>
                  setF((x) => ({
                    ...x,
                    cor: e.target.value,
                  }))
                }
                placeholder="Ex: Azul Marinho"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-y-0 gap-x-3">
            <Select
              label="Categoria"
              value={f.categoria}
              onChange={(e) =>
                setF((x) => ({
                  ...x,
                  categoria: e.target.value,
                }))
              }
              options={CATEGORIAS}
            />
            <Select
              label="Linha"
              value={f.linha}
              onChange={(e) =>
                setF((x) => ({
                  ...x,
                  linha: e.target.value,
                }))
              }
              options={LINHAS}
            />
            <Select
              label="Coleção"
              value={f.colecao}
              onChange={(e) =>
                setF((x) => ({
                  ...x,
                  colecao: e.target.value,
                }))
              }
              options={COLECOES}
            />
            <Select
              label="Tipo de Tecido"
              value={f.tecido}
              onChange={(e) =>
                setF((x) => ({
                  ...x,
                  tecido: e.target.value,
                }))
              }
              options={TECIDOS}
            />
            <Input
              label="Valor Aluguel (R$)"
              type="number"
              value={f.aluguel}
              onChange={(e) =>
                setF((x) => ({
                  ...x,
                  aluguel: e.target.value,
                }))
              }
              placeholder="0,00"
            />
            <Input
              label="Valor Venda (R$)"
              type="number"
              value={f.venda}
              onChange={(e) =>
                setF((x) => ({
                  ...x,
                  venda: e.target.value,
                }))
              }
              placeholder="0,00"
            />
          </div>

          <SectionTitle className="mt-4 mx-0 mb-2.5">
            GRADE DE TAMANHOS DO MODELO
          </SectionTitle>
          <p className="text-caption text-text-muted mt-0 mx-0 mb-3 leading-normal">
            Cada tamanho é uma variante deste mesmo modelo — não crie um
            cadastro novo por tamanho, apenas ajuste a quantidade de cada linha
            da grade.
          </p>
          <GradeEditor variantes={variantes} setVariantes={setVariantes} />

          <div className="flex gap-2 mt-5">
            <Button onClick={salvar} size="compact">
              {isNew ? "Cadastrar Modelo" : "Salvar Alterações"}
            </Button>
            <Button
              onClick={() => (isNew ? onClose() : setEditando(false))}
              size="compact"
              variant="ghost"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
export default ProdutoDrawer;
