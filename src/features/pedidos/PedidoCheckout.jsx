import { ResumoLinha } from "./ResumoLinha.jsx";
import { Section, Wrap } from "../../shared/ui/estrutura/EstruturaConteudo.jsx";
import { H2, Lead } from "../../shared/ui/estrutura/Typography.jsx";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Field, Input, TextArea } from "../../shared/ui/formularios/Form.jsx";
import { onImgError } from "../../shared/lib/images.js";
import { cn } from "../../shared/lib/cn.js";
import { money } from "../../shared/lib/format.js";
import { fmtDate } from "../../shared/lib/format.js";
import { TIPO_LABEL } from "../../domain/pedidos.js";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
export default function PedidoCheckout({ form, erros, busy, set, enviar, r, go }) {
  return (
    <Section className="pt-10 desktop:pt-16">
      <Wrap>
        <H2 className="mt-3.5 mb-2">Confirme os dados e envie.</H2>
        <p className="mt-3 mb-4 text-sm text-text-sub">{TIPO_LABEL[r.tipo]}</p>
        <Lead className="mb-9">
          O ateliê confirma disponibilidade e valores antes de qualquer
          cobrança.
        </Lead>

        {erros.geral && <Alert>{erros.geral}</Alert>}
        <div
          className={cn(
            "grid grid-cols-1 desktop:grid-cols-summary gap-rhythm items-start",
            "pedido-grid",
          )}
        >
          {/* formulário */}
          <div>
            <p className="mt-0 mx-0 mb-4 text-caption tracking-widest uppercase text-gold-text font-mono font-semibold">
              Seus dados
            </p>
            <Field label="Nome completo" error={erros.nome}>
              <Input
                value={form.nome}
                onChange={set("nome")}
                placeholder="Como está no documento"
              />
            </Field>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3.5">
              <Field label="E-mail" error={erros.email}>
                <Input
                  type="email"
                  readOnly
                  value={form.email}
                  onChange={set("email")}
                  placeholder="voce@email.com"
                />
              </Field>
              <Field label="Telefone / WhatsApp" error={erros.tel}>
                <Input
                  value={form.tel}
                  onChange={set("tel")}
                  placeholder="(11) 90000-0000"
                />
              </Field>
            </div>
            <Field label="CPF" error={erros.documento} hint="Opcional agora — necessário na retirada.">
              <Input
                value={form.documento}
                onChange={set("documento")}
                placeholder="000.000.000-00"
              />
            </Field>
            <Field
              label="Observações"
              hint="Ajustes conhecidos, cor de referência, ocasião."
            >
              <TextArea
                value={form.observacoes}
                onChange={set("observacoes")}
                placeholder="Ex.: casamento no dia 14, prefiro lapela fina, já sei que preciso encurtar a barra."
              />
            </Field>

            <div className="flex gap-3 flex-wrap mt-2">
              <Button disabled={busy} onClick={enviar}>{busy ? "Enviando…" : "Enviar pedido"}</Button>
              <Button variant="ghost" onClick={() => go("colecao")}>
                Trocar de traje
              </Button>
            </div>
          </div>

          {/* resumo do item */}
          <aside className="border border-border bg-card">
            <div className="flex gap-3.5 p-4">
              {r.foto && (
                <div className="w-18 h-24 shrink-0 overflow-hidden border border-border">
                  <img
                    src={r.foto}
                    alt={r.produtoNome}
                    onError={onImgError}
                    className="w-full h-full object-cover block"
                  />
                </div>
              )}
              <div className="min-w-0">
                <p className="m-0 font-display text-base font-medium text-text">
                  {r.produtoNome}
                </p>
                <p className="mt-1 mx-0 mb-0 text-xs text-text-sub">
                  {r.cor} · tam. {r.tam}
                </p>
                <p className="mt-1 mx-0 mb-0 text-caption text-text-muted font-mono uppercase tracking-widest">
                  {TIPO_LABEL[r.tipo]}
                </p>
              </div>
            </div>
            <dl className="m-0 pt-0 px-4 pb-1.5 text-xs">
              {r.retirada && (
                <ResumoLinha k="Retirada" v={fmtDate(r.retirada)} />
              )}
              {r.devolucao && (
                <ResumoLinha k="Devolução" v={fmtDate(r.devolucao)} />
              )}
              <ResumoLinha
                k={
                  r.tipo === "locacao_avulsa"
                    ? "Aluguel estimado"
                    : "Valor estimado"
                }
                v={money(r.valorEstimado)}
                strong
              />
            </dl>
            <p className="m-0 pt-3 px-4 pb-4 text-caption text-text-muted border-t border-t-border">
              Valores sujeitos à confirmação do ateliê.
            </p>
          </aside>
        </div>
      </Wrap>
    </Section>
  );
}
