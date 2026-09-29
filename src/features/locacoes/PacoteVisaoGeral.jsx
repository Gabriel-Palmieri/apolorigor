import { Button } from "../../shared/ui/botoes/Button.jsx";
export default function PacoteVisaoGeral({ onPlanejar }) {
  return <section>
    <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
      <div><h2 className="m-0 text-xl font-medium text-text">Pacotes padronizados</h2>
        <p className="mt-3 mb-0 text-sm text-text-sub">Organização dos trajes, participantes e acompanhamento de casamentos.</p>
      </div>
      <Button disabled title="A contratação de pacotes ainda não está disponível.">Cadastrar pacote</Button>
    </div>
    <div className="border-y border-border py-8">
      <h3 className="m-0 text-lg font-medium text-text">Pacotes indisponíveis para consulta</h3>
      <p className="mt-3 mb-6 text-sm text-text-sub max-w-2xl">Esta área preserva a estrutura do atendimento em grupo. Cadastros, contratos, participantes e retiradas de pacotes ainda não podem ser consultados ou gravados.</p>
      <Button variant="ghost" onClick={onPlanejar}>Preparar planejamento do grupo</Button>
    </div>
    <div className="mt-8 grid tablet:grid-cols-3 gap-6">
      {[["Padronização", "Referência do traje e organização por papel no casamento."], ["Participantes", "Nomes e tamanhos de referência para planejar o grupo."], ["Portal do casamento", "Prévia visual das informações que o casal poderá acompanhar."]].map(([title, detail]) =>
        <section key={title}><h3 className="mt-0 mb-3 text-sm font-medium text-text">{title}</h3><p className="m-0 text-sm text-text-sub">{detail}</p></section>
      )}
    </div>
  </section>;
}
