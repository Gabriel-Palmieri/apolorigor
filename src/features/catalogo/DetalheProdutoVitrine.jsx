import { Field, ChipGroup, Input } from "../../shared/ui/formularios/Form.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { onImgError } from "../../shared/lib/images.js";
import { Dialog } from "../../shared/ui/dialogos/Dialog.jsx";
import { useMemo, useState } from "react";
import { tamanhosDe } from "../../domain/vitrine.js";
import { money } from "../../shared/lib/format.js";
import { useDisponibilidade } from "./useDisponibilidade.js";
import {
  todayISO as hoje,
  addDays as maisDias,
} from "../../shared/lib/dates.js";

// Detalhe do modelo + opções do pedido (modalidade, tamanho, datas).
// Ao continuar, devolve o rascunho para o fluxo de checkout — não cria nada ainda.
export default function DetalheProdutoVitrine({
  produto,
  onClose,
  onContinuar,
}) {
  const [modalidade, setModalidade] = useState("locacao_avulsa");
  const [tam, setTam] = useState("");
  const [retirada, setRetirada] = useState(maisDias(hoje(), 7));
  const [devolucao, setDevolucao] = useState(maisDias(hoje(), 10));
  const [erro, setErro] = useState("");
  const aluguel = modalidade === "locacao_avulsa";
  const valor = aluguel ? produto.aluguel : produto.venda;
  const variante = produto.variantes.find((v) => v.tam === tam);
  const disponibilidade = useDisponibilidade(
    produto.id,
    variante?.id,
    retirada,
    devolucao,
    aluguel,
  );
  const tamanhos = useMemo(
    () =>
      tamanhosDe(produto).map((t) => ({
        value: t,
        label: t,
      })),
    [produto],
  );
  const continuar = () => {
    if (!tam) return setErro("Escolha um tamanho de referência.");
    if (aluguel) {
      if (!disponibilidade.data || disponibilidade.data.available < 1)
        return setErro(
          "Confira a disponibilidade ou escolha outras datas e tamanho.",
        );
      if (!retirada || !devolucao)
        return setErro("Informe as datas de retirada e devolução.");
      if (retirada < hoje())
        return setErro("A retirada deve ocorrer hoje ou depois.");
      if (devolucao < retirada)
        return setErro(
          "A devolução deve ocorrer no mesmo dia ou depois da retirada.",
        );
    }
    onContinuar({
      tipo: modalidade,
      produtoId: produto.id,
      produtoNome: produto.nome,
      foto: produto.foto,
      cor: produto.cor,
      tam,
      retirada: aluguel ? retirada : null,
      devolucao: aluguel ? devolucao : null,
      valorEstimado: valor,
    });
  };
  return (
    <Dialog
      label={produto.nome}
      onClose={onClose}
      className="produto-dialog apollo-scale-in"
    >
      <div
        className="w-full max-w-4xl bg-card grid grid-cols-1 desktop:grid-cols-product"
        data-produto-modal
      >
        <div className="min-h-80 bg-bg-elevated">
          <img
            src={produto.foto}
            alt={produto.nome}
            onError={onImgError}
            className="w-full h-full object-cover block min-h-80"
          />
        </div>

        <div className="p-rhythm">
          <div className="flex justify-between items-start gap-3">
            <span className="text-sm text-text-sub">
              {produto.categoria} · {produto.linha}
            </span>
            <button
              onClick={onClose}
              aria-label="Fechar"
              className="flex items-center justify-center w-11 h-11 bg-transparent border-0 text-text-sub cursor-pointer hover:bg-bg-elevated"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="m6 6 12 12M6 18 18 6" />
              </svg>
            </button>
          </div>
          <h2 className="font-display text-3xl font-medium text-text mt-3.5 mx-0 mb-1 tracking-tight">
            {produto.nome}
          </h2>
          <p className="m-0 text-compact text-text-sub">
            {produto.cor} · {produto.tecido} · coleção {produto.colecao}
          </p>

          <div className="mt-5 mx-0 mb-0">
            <Field label="Modalidade">
              <ChipGroup
                value={modalidade}
                onChange={setModalidade}
                columns={2}
                options={[
                  {
                    value: "locacao_avulsa",
                    label: "Alugar",
                    sub: money(produto.aluguel),
                  },
                  {
                    value: "venda",
                    label: "Comprar",
                    sub: money(produto.venda),
                  },
                ]}
              />
            </Field>

            <Field
              label="Tamanho de referência"
              hint="A equipe confirma a disponibilidade e ajusta na prova."
            >
              <ChipGroup value={tam} onChange={setTam} options={tamanhos} />
            </Field>

            {aluguel && (
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3">
                <Field label="Retirada">
                  <Input
                    type="date"
                    value={retirada}
                    min={hoje()}
                    onChange={(e) => setRetirada(e.target.value)}
                  />
                </Field>
                <Field label="Devolução">
                  <Input
                    type="date"
                    value={devolucao}
                    min={retirada}
                    onChange={(e) => setDevolucao(e.target.value)}
                  />
                </Field>
              </div>
            )}

            {erro && (
              <p className="mt-0 mx-0 mb-3.5 text-xs text-red-fg">{erro}</p>
            )}

            <div className="flex items-baseline justify-between py-3.5 px-0 border-t border-t-border mt-1">
              <span className="text-caption tracking-widest uppercase text-text-sub font-mono">
                {aluguel ? "Aluguel estimado" : "Valor estimado"}
              </span>
              <span className="font-mono text-lg font-semibold text-gold-text">
                {money(valor)}
              </span>
            </div>

            {disponibilidade.loading && (
              <p role="status" className="text-sm text-text-sub">
                Consultando disponibilidade…
              </p>
            )}
            {disponibilidade.error && (
              <p role="alert" className="text-sm text-text-sub">
                {disponibilidade.error}
              </p>
            )}
            {disponibilidade.data && (
              <p role="status" className="text-sm text-gold-text">
                {disponibilidade.data.available} peça(s) disponível(is) neste
                período.
              </p>
            )}
            <Button
              className="w-full"
              disabled={
                aluguel &&
                (!disponibilidade.data ||
                  disponibilidade.loading ||
                  disponibilidade.data.available < 1)
              }
              onClick={continuar}
            >
              Continuar para o pedido
            </Button>
            <p className="mt-2.5 mx-0 mb-0 text-caption text-text-muted text-center">
              O pedido é enviado ao ateliê para confirmação. Nada é cobrado
              agora.
            </p>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
