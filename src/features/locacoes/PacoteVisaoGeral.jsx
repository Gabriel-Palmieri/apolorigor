import { useEffect, useState } from "react";
import { Button } from "../../shared/ui/botoes/Button.jsx";
import { listarPacotes } from "../../data/pacotes.js";
import { fmtDate } from "../../shared/lib/format.js";
export default function PacoteVisaoGeral({ onPlanejar }) {
  const [pacotes, setPacotes] = useState([]);
  const [erro, setErro] = useState("");
  useEffect(() => {
    let ativo = true;
    listarPacotes().then((rows) => { if (ativo) setPacotes(rows); }).catch((error) => { if (ativo) setErro(error.message); });
    return () => { ativo = false; };
  }, []);
  return <section>
    <div className="flex justify-between items-start flex-wrap gap-4 mb-8">
      <div><h2 className="m-0 text-xl font-medium text-text">Pacotes padronizados</h2>
        <p className="mt-3 mb-0 text-sm text-text-sub">Organização dos trajes, participantes e acompanhamento de casamentos.</p>
      </div>
      <Button onClick={onPlanejar}>Cadastrar pacote</Button>
    </div>
    <div className="border-y border-border py-8">
      <h3 className="m-0 text-lg font-medium text-text">Solicitações de pacote</h3>
      <p className="mt-3 mb-6 text-sm text-text-sub max-w-2xl">Pedidos enviados pelo site, com dados do evento e participantes. Eles ainda não representam reserva, contrato ou pagamento.</p>
      {erro && <p role="alert" className="text-sm">{erro}</p>}
      {pacotes.length ? <ul className="m-0 p-0 list-none divide-y divide-border">{pacotes.map((pkg) => <li key={pkg.id} className="py-5"><h4 className="m-0 font-medium">{pkg.coupleNames}</h4><p className="mt-2 mb-0 text-sm text-text-sub">{pkg.contactName} · {pkg.contactEmail} · {pkg.expectedMembers} trajes · {pkg.eventDate ? fmtDate(pkg.eventDate) : "Data a definir"}</p><p className="mt-2 mb-0 text-xs text-text-sub">{pkg.participants.length} participantes cadastrados · {pkg.status === "REQUESTED" ? "Solicitado" : pkg.status}</p>{pkg.notes && <p className="mt-2 mb-0 text-sm">{pkg.notes}</p>}</li>)}</ul> : !erro && <p className="text-sm text-text-sub">Nenhuma solicitação de pacote recebida ainda.</p>}
    </div>
    <div className="mt-8 grid tablet:grid-cols-3 gap-6">
      {[["Padronização", "Referência do traje e organização por papel no casamento."], ["Participantes", "Nomes e tamanhos de referência para planejar o grupo."], ["Portal do casamento", "Prévia visual das informações que o casal poderá acompanhar."]].map(([title, detail]) =>
        <section key={title}><h3 className="mt-0 mb-3 text-sm font-medium text-text">{title}</h3><p className="m-0 text-sm text-text-sub">{detail}</p></section>
      )}
    </div>
  </section>;
}
