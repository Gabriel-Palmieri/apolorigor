import { usePerfilForm } from "./usePerfilForm.js";
import { Button } from "../../shared/ui/Button.jsx";
import { Field, Input } from "../../shared/ui/Form.jsx";
function EditarPerfil({ sessao }) {
  const {
    base,
    form,
    setForm,
    erros,
    setErros,
    salvo,
    setSalvo,
    set,
    sujo,
    salvar,
  } = usePerfilForm({
    sessao,
  });
  return (
    <form onSubmit={salvar} className="border border-border bg-card max-w-lg">
      <div className="p-6 desktop:p-8">
        <p className="m-0 font-display text-lg font-medium text-text">
          Dados da conta
        </p>
        <p className="mt-2 mx-0 mb-5 text-compact text-text-sub leading-relaxed max-w-measure">
          Usados para preencher seus pedidos e para o ateliê entrar em contato.
          O papel no casamento ({sessao.papel}) é definido pelo ateliê.
        </p>

        <Field label="Nome completo" error={erros.nome}>
          <Input
            value={form.nome}
            onChange={set("nome")}
            autoComplete="name"
            placeholder="Como está no documento"
          />
        </Field>
        <Field label="E-mail" error={erros.email}>
          <Input
            type="email"
            value={form.email}
            onChange={set("email")}
            autoComplete="email"
            placeholder="voce@email.com"
          />
        </Field>
        <div className="grid grid-cols-1 tablet:grid-cols-2 gap-3.5">
          <Field label="Telefone / WhatsApp" error={erros.tel}>
            <Input
              value={form.tel}
              onChange={set("tel")}
              placeholder="(11) 90000-0000"
            />
          </Field>
          <Field label="CPF" hint="Opcional — necessário na retirada.">
            <Input
              value={form.documento}
              onChange={set("documento")}
              placeholder="000.000.000-00"
            />
          </Field>
        </div>

        <div className="flex gap-3 items-center flex-wrap mt-1.5">
          <Button type="submit" disabled={!sujo}>
            Salvar alterações
          </Button>
          {sujo && (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setForm(base);
                setErros({});
                setSalvo(false);
              }}
            >
              Descartar
            </Button>
          )}
          {salvo && !sujo && (
            <span className="text-xs font-semibold text-green-fg font-mono">
              ✓ Dados atualizados
            </span>
          )}
        </div>
      </div>
    </form>
  );
}

// Aba "Pedidos": lista o pacote padronizado (se houver) + os pedidos avulsos.
// Clicar no pacote leva à página do casamento (fora do perfil); clicar num
// avulso abre o rastreio embutido aqui.
export { EditarPerfil };
