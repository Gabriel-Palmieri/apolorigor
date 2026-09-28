import { ResumoLinha } from './ResumoLinha.jsx';
import { todayISO } from '../../shared/lib/dates.js';
import { Section, Wrap } from "../../layouts/Content.jsx";
import { H2, Lead } from "../../shared/ui/Typography.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Field, Input, TextArea, Select } from "../../shared/ui/Form.jsx";
import { cn } from "../../shared/lib/cn.js";
import { money } from '../../features/catalog/siteData.js';
// modelos que fazem sentido como base de um pacote (ternos)
export default function PacoteSolicitacao({
  form,
  erros,
  set,
  enviar,
  modelo,
  estimativa,
  MODELOS_BASE,
  go
}) {
  return <Section className="pt-10 desktop:pt-16">
      <Wrap>
        <H2 className="mt-3.5 mb-2">Abra a solicitação do grupo.</H2>
        <Lead className="mb-9">
          Com esses dados o ateliê monta o pacote, define o prazo de comparecimento e
          libera cada integrante para retirar o traje no próprio nome.
        </Lead>

        <div className={cn("grid grid-cols-1 desktop:grid-cols-summary gap-rhythm items-start", "pedido-grid")}>
          <div>
            <p className="mt-0 mx-0 mb-4 text-caption tracking-widest uppercase text-gold-text font-mono font-semibold">O evento</p>
            <Field label="Nome dos noivos" error={erros.noivos}>
              <Input value={form.noivos} onChange={set('noivos')} placeholder="Ex.: Marcos Silva & Ana Andrade" />
            </Field>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3.5">
              <Field label="Data do evento" error={erros.dataEvento}>
                <Input type="date" value={form.dataEvento} min={todayISO()} onChange={set('dataEvento')} />
              </Field>
              <Field label="Integrantes (trajes)" error={erros.nIntegrantes} hint="Noivo, padrinhos, pais, pajens.">
                <Input type="number" min={1} max={30} value={form.nIntegrantes} onChange={set('nIntegrantes')} />
              </Field>
            </div>
            <Field label="Modelo base" hint="Opcional — dá para decidir na prova.">
              <Select value={form.modeloBase} onChange={set('modeloBase')} placeholder="Escolher depois" options={MODELOS_BASE.map(m => ({
              value: m.id,
              label: `${m.nome} · ${m.cor} · ${money(m.aluguel)}`
            }))} />
            </Field>

            <p className="mt-6 mx-0 mb-4 text-caption tracking-widest uppercase text-gold-text font-mono font-semibold">Responsável pelo pacote</p>
            <Field label="Nome" error={erros.contato}>
              <Input value={form.contato} onChange={set('contato')} placeholder="Quem organiza os trajes" />
            </Field>
            <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3.5">
              <Field label="E-mail" error={erros.email}>
                <Input type="email" value={form.email} onChange={set('email')} placeholder="voce@email.com" />
              </Field>
              <Field label="Telefone / WhatsApp" error={erros.tel}>
                <Input value={form.tel} onChange={set('tel')} placeholder="(11) 90000-0000" />
              </Field>
            </div>
            <Field label="Observações" hint="Cores, cerimonial, integrantes de outra cidade, prazos.">
              <TextArea value={form.observacoes} onChange={set('observacoes')} placeholder="Ex.: 2 padrinhos moram fora e só chegam na semana do casamento." />
            </Field>

            <div className="flex gap-3 flex-wrap mt-2">
              <Button onClick={enviar}>Enviar solicitação</Button>
              <Button variant="ghost" onClick={() => go('colecao')}>Ver modelos primeiro</Button>
            </div>
          </div>

          <aside className="border border-border bg-card">
            <div className="p-4">
              <p className="m-0 font-display text-base font-medium text-text">Estimativa do pacote</p>
              <p className="mt-1 mx-0 mb-0 text-xs text-text-sub">{form.nIntegrantes || 0} trajes{modelo ? ` · ${modelo.nome}` : ' · modelo a definir'}</p>
            </div>
            <dl className="m-0 pt-0 px-4 pb-1.5 text-xs">
              <ResumoLinha k="Aluguel / traje" v={modelo ? money(modelo.aluguel) : '—'} />
              <ResumoLinha k="Integrantes" v={String(form.nIntegrantes || 0)} />
              <ResumoLinha k="Total estimado" v={estimativa ? money(estimativa) : '—'} strong />
            </dl>
            <p className="m-0 pt-3 px-4 pb-4 text-caption text-text-muted border-t border-t-border">
              Estimativa sem ajustes individuais. O ateliê fecha o valor por integrante.
            </p>
          </aside>
        </div>
      </Wrap>
    </Section>;
}
