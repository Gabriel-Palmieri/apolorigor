import { Section, Wrap } from "../../layouts/Content.jsx";
import { H2, Lead } from "../../shared/ui/Typography.jsx";
import { Button } from "../../shared/ui/Button.jsx";
import { Field, Input } from "../../shared/ui/Form.jsx";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { PERFIS, entrarComoCliente } from "../../features/conta/session.js";
// Tela de acesso da vitrine. Ambiente de demonstração: os campos são reais mas
// não autenticam nada — qualquer um dos botões entra direto no destino certo.
// Administrador → sistema interno; cliente → área do cliente.
export default function Entrar() {
  const { go } = useOutletContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  useEffect(() => {
    window.scrollTo({
      top: 0,
    });
  }, []);
  const entrarAdmin = () => {
    navigate(PERFIS.admin.destino);
  };
  const entrarCliente = () => {
    entrarComoCliente();
    go("conta");
  };
  return (
    <Section className="pt-10 desktop:pt-16">
      <Wrap narrow className="max-w-lg">
        <H2 className="mt-0">Entrar</H2>
        <Lead className="mt-4">
          Acesse o painel do ateliê ou a sua área de cliente.
        </Lead>

        <div className="bg-bg-elevated mt-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              entrarCliente();
            }}
            className="p-6 desktop:p-8"
          >
            <Field label="E-mail">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                autoComplete="email"
              />
            </Field>

            <Field label="Senha" className="mb-3">
              <div className="relative">
                <Input
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="pr-16"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  className="absolute top-0 right-0 h-full py-0 px-3 bg-transparent border-0 cursor-pointer font-sans text-xs text-text-sub"
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </Field>

            <div className="flex justify-between items-center gap-3 mt-0 mx-0 mb-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-text-sub">
                <input
                  type="checkbox"
                  checked={lembrar}
                  onChange={(e) => setLembrar(e.target.checked)}
                  className="accent-gold w-3.5 h-3.5"
                />
                Manter conectado
              </label>
              <a
                href="/entrar"
                onClick={(e) => e.preventDefault()}
                className="text-xs text-gold-text underline underline-offset-4"
              >
                Esqueceu a senha?
              </a>
            </div>

            <div className="grid gap-2.5">
              <Button type="submit">Entrar como cliente</Button>
              <Button type="button" variant="ghost" onClick={entrarAdmin}>
                Entrar como administrador
              </Button>
            </div>

          </form>
        </div>

        <p className="mt-5 text-xs text-text-sub">
          Ainda não tem pedido?{" "}
          <button
            onClick={() => go("colecao")}
            className="bg-transparent border-0 p-0 cursor-pointer text-gold-text font-sans text-xs"
          >
            Ver a coleção
          </button>
        </p>
      </Wrap>
    </Section>
  );
}
