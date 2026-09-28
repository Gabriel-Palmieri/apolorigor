import { Card } from "../../shared/ui/Surfaces.jsx";
import { Modal } from "../../shared/ui/Modal.jsx";
import { cn } from "../../shared/lib/cn.js";
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import VisaoGeral, { packageNavClasses } from './PacoteVisaoGeral.jsx';
import PacoteDetalhe from './PacoteDetalhe.jsx';
import LocacaoPadronizada from './LocacaoPadronizada.jsx';
export default function PacotesPadronizados({
  produtos,
  trans,
  setTrans,
  ajustes,
  setAjustes,
  registrarPadronizada
}) {
  const [params, setParams] = useSearchParams();
  const selecionadoId = Number(params.get('pacote')) || null;
  const view = selecionadoId ? 'selecionado' : 'geral';
  const setSelecionadoId = id => setParams(current => {
    const next = new URLSearchParams(current);
    next.set('pacote', String(id));
    return next;
  });
  const setView = value => {
    if (value === 'geral') setParams({
      aba: 'pacotes'
    });
  };
  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const pacotes = trans.filter(t => t.tipo === 'locacao_padronizada');
  const selecionado = pacotes.find(t => t.id === selecionadoId);
  const abrirPacote = id => {
    setSelecionadoId(id);
    setView('selecionado');
  };
  return <div className={cn("flex gap-5", "pacotes-layout")}>
      <div className="w-44 shrink-0">
        <p className="text-micro text-text-muted font-bold tracking-widest mt-1 mx-0 mb-2.5">PADRONIZAÇÕES</p>
        <button onClick={() => setView('geral')} className={packageNavClasses(view === 'geral')}>⌂ Visão geral</button>
        <button onClick={() => selecionado && setView('selecionado')} disabled={!selecionado} className={cn("", packageNavClasses(view === 'selecionado'), selecionado ? "opacity-100" : "opacity-40", selecionado ? "cursor-pointer" : "cursor-not-allowed")}>
          □ Pacote selecionado
        </button>
      </div>

      <div className="flex-1 min-w-0">
        {view === 'geral' && <VisaoGeral pacotes={pacotes} produtos={produtos} busca={busca} setBusca={setBusca} onAbrirPacote={abrirPacote} onNovoPacote={() => setModalAberto(true)} />}
        {view === 'selecionado' && (selecionado ? <PacoteDetalhe t={selecionado} produtos={produtos} trans={trans} setTrans={setTrans} ajustes={ajustes} setAjustes={setAjustes} onVoltar={() => setView('geral')} /> : <Card><p className="text-text-sub text-compact m-0">Nenhum pacote selecionado ainda. Volte para "Visão geral" e escolha um pacote na lista.</p></Card>)}
      </div>

      {modalAberto && <Modal title="Cadastrar pacote" onClose={() => setModalAberto(false)} width={860}>
          <LocacaoPadronizada produtos={produtos} trans={trans} ajustes={ajustes} registrarPadronizada={f => {
        const ok = registrarPadronizada(f);
        if (ok) setModalAberto(false);
        return ok;
      }} />
        </Modal>}
    </div>;
}
