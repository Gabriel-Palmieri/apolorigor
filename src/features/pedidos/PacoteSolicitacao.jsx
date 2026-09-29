import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import {
  Field,
  Input,
  Select,
  TextArea,
} from "../../shared/ui/formularios/Form.jsx";
import { money } from "../../shared/lib/format.js";
import { todayISO } from "../../shared/lib/dates.js";
import { usePacoteForm } from "./usePacoteForm.js";
import IntegranteModal from "../casamento/IntegranteModal.jsx";
import ParticipanteRow from "../casamento/ParticipanteRow.jsx";
import PreviaPortalCasamento from "../casamento/PreviaPortalCasamento.jsx";
import CategoriaCard from "../casamento/CategoriaCard.jsx";

export default function PacoteSolicitacao({ contato, gestao = false }) {
  const planejamento = usePacoteForm(contato);
  const {
    form,
    set,
    modelos,
    modelo,
    referencia,
    participantes,
    salvarParticipante,
    removerParticipante,
  } = planejamento;
  const [editor, setEditor] = useState(null);
  const [portalAberto, setPortalAberto] = useState(false);
  return (
    <>
      <p className="mt-0 mb-8 text-sm text-text-sub" role="status">
        A contratação de pacotes para grupos ainda não está disponível por aqui.
        Este planejamento permanece somente nesta tela e é descartado ao sair.
        Nenhum pedido será enviado ou traje reservado.
      </p>
      <form
        className="casamento-planejamento"
        onSubmit={(event) => event.preventDefault()}
      >
        <div>
          <section className="mb-9" aria-labelledby="planejamento-evento">
            <h3 id="planejamento-evento">O evento</h3>
            <Field label="Nome dos noivos">
              <Input
                maxLength={150}
                value={form.noivos}
                onChange={set("noivos")}
                placeholder="Nomes do casal"
              />
            </Field>
            <div className="grid tablet:grid-cols-2 gap-4">
              <Field label="Data do evento">
                <Input
                  type="date"
                  min={todayISO()}
                  value={form.dataEvento}
                  onChange={set("dataEvento")}
                />
              </Field>
              <Field
                label="Quantidade prevista de trajes"
                hint="Referência para planejar o grupo, de 1 a 30."
              >
                <Input
                  type="number"
                  min={1}
                  max={30}
                  step={1}
                  value={form.nIntegrantes}
                  onChange={set("nIntegrantes")}
                />
              </Field>
            </div>
            <Field
              label="Modelo base"
              hint={
                modelos.length
                  ? "Referência da coleção. Não representa reserva ou disponibilidade."
                  : "Os modelos aparecem quando a coleção estiver disponível."
              }
            >
              <Select
                disabled={!modelos.length}
                value={form.modeloBase}
                onChange={set("modeloBase")}
              >
                <option value="">Escolher depois</option>
                {modelos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome} · {produto.cor}
                  </option>
                ))}
              </Select>
            </Field>
          </section>
          <section className="mb-9" aria-labelledby="planejamento-contato">
            <h3 id="planejamento-contato">Responsável pelo grupo</h3>
            <Field label="Nome do responsável">
              <Input
                value={form.contato}
                onChange={set("contato")}
                maxLength={100}
                autoComplete="name"
              />
            </Field>
            <div className="grid tablet:grid-cols-2 gap-4">
              <Field label="E-mail do responsável">
                <Input
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  autoComplete="email"
                />
              </Field>
              <Field label="Telefone do responsável">
                <Input
                  type="tel"
                  maxLength={25}
                  value={form.tel}
                  onChange={set("tel")}
                  autoComplete="tel"
                />
              </Field>
            </div>
            <Field
              label="Observações"
              hint="Cores, cerimonial, integrantes de outra cidade ou prazos."
            >
              <TextArea
                maxLength={2000}
                rows={4}
                value={form.observacoes}
                onChange={set("observacoes")}
              />
            </Field>
          </section>
          <section
            className="mb-9"
            aria-labelledby="planejamento-participantes"
          >
            <div className="flex justify-between items-start gap-4 flex-wrap mb-5">
              <h3 id="planejamento-participantes" className="mb-0">
                Participantes do planejamento
              </h3>
              <Button
                size="compact"
                variant="ghost"
                disabled={participantes.length >= 30}
                onClick={() => setEditor("new")}
              >
                Adicionar participante
              </Button>
            </div>
            {participantes.length ? (
              <ul className="m-0 p-0 list-none">
                {participantes.map((participante) => (
                  <ParticipanteRow
                    key={participante.id}
                    participante={participante}
                    onEditar={setEditor}
                    onRemover={removerParticipante}
                  />
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-sub">
                Inclua nomes e papéis para visualizar a organização do grupo.
              </p>
            )}
          </section>
          <div className="flex flex-wrap gap-3">
            <Button
              disabled
              title="A contratação de pacotes ainda não está disponível."
            >
              {gestao ? "Cadastrar pacote" : "Enviar solicitação"}
            </Button>
            <Button variant="ghost" onClick={() => setPortalAberto(true)}>
              Ver prévia do portal
            </Button>
          </div>
          <p className="mt-4 text-xs text-text-sub">
            Para uma contratação disponível agora,{" "}
            <Link
              to="/colecao"
              className="text-gold-text underline underline-offset-4"
            >
              solicite um traje individual na coleção
            </Link>
            .
          </p>
        </div>
        <aside className="casamento-planejamento-resumo">
          <h3>Referência dos trajes</h3>
          <CategoriaCard produto={modelo} />
          <dl className="my-6 text-sm">
            {[
              [
                "Aluguel por traje no catálogo",
                modelo ? money(modelo.aluguel) : "A definir",
              ],
              ["Quantidade prevista", form.nIntegrantes || "A definir"],
              [
                "Referência de valor",
                referencia !== null ? money(referencia) : "A definir",
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4 py-3 border-b border-border-soft"
              >
                <dt className="text-text-sub">{label}</dt>
                <dd className="m-0 text-right text-gold-text tabular-nums">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
          <p className="m-0 text-xs text-text-sub">
            Multiplicação do preço unitário do catálogo pela quantidade
            prevista. Não é proposta, preço de pacote ou confirmação de
            disponibilidade.
          </p>
        </aside>
      </form>
      {editor && (
        <IntegranteModal
          key={editor === "new" ? "new" : editor.id}
          participante={editor === "new" ? null : editor}
          onSalvar={salvarParticipante}
          onClose={() => setEditor(null)}
        />
      )}
      {portalAberto && (
        <PreviaPortalCasamento
          planejamento={planejamento}
          onClose={() => setPortalAberto(false)}
        />
      )}
    </>
  );
}
