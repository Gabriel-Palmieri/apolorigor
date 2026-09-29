import { usePerfilForm } from "./usePerfilForm.js";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { Field, Input } from "../../shared/ui/formularios/Form.jsx";
import { Alert } from "../../shared/ui/feedback/Feedback.jsx";
export function EditarPerfil({ sessao }) {
  const { form, erros, salvo, set, sujo, salvar, busy } = usePerfilForm({
    sessao,
  });
  return (
    <form
      onSubmit={salvar}
      className="max-w-lg border border-border bg-card p-6 desktop:p-8"
      aria-busy={busy}
    >
      <h3 className="mt-0 text-lg font-medium">Dados da conta</h3>
      {erros.geral && <Alert>{erros.geral}</Alert>}
      <Field label="Nome completo" error={erros.nome}>
        <Input
          required
          minLength={2}
          maxLength={100}
          value={form.nome}
          onChange={set("nome")}
          autoComplete="name"
        />
      </Field>
      <Field
        label="E-mail"
        hint="O e-mail desta conta não pode ser alterado por aqui."
      >
        <Input readOnly type="email" value={form.email} autoComplete="email" />
      </Field>
      <Field label="Telefone / WhatsApp" error={erros.tel}>
        <Input
          minLength={8}
          maxLength={25}
          value={form.tel}
          onChange={set("tel")}
          autoComplete="tel"
        />
      </Field>
      <Field label="CPF ou CNPJ" error={erros.documento}>
        <Input
          value={form.documento}
          onChange={set("documento")}
          inputMode="numeric"
        />
      </Field>
      <Button type="submit" disabled={!sujo || busy}>
        {busy ? "Salvando…" : "Salvar alterações"}
      </Button>
      {salvo && !sujo && (
        <p role="status" className="text-sm text-gold-text">
          Dados atualizados.
        </p>
      )}
    </form>
  );
}
