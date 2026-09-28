import { Link } from 'react-router-dom';
import { fmtDate } from '../../shared/lib/format.js';

export default function ProximasMovimentacoes({ eventos, hoje }) {
  return <section aria-labelledby="agenda-heading">
    <div className="flex justify-between items-center flex-wrap gap-3">
      <h2 id="agenda-heading" className="dashboard-heading">Próximas movimentações</h2>
      <Link to="/sistema/anuario" className="dashboard-text-link">Ver agenda</Link>
    </div>
    {eventos.length === 0 ? <div className="mt-5 py-6">
      <p className="m-0 text-sm text-text">Nenhuma retirada ou devolução prevista.</p>
      <p className="mt-2 mb-0 text-sm text-text-sub">As locações em aberto aparecem aqui conforme as datas cadastradas.</p>
    </div> : <ol className="m-0 mt-4 p-0 list-none">
      {eventos.map(evento => <li key={evento.transId + '-' + evento.movimento} className="grid grid-cols-agenda-preview gap-5 py-4 border-b border-border-soft last:border-0">
        <time dateTime={evento.data} className="text-sm text-text-sub tabular-nums">{evento.data === hoje ? 'Hoje' : fmtDate(evento.data)}<span className="block mt-1 text-xs">{evento.movimento}</span></time>
        <div className="min-w-0"><p className="m-0 text-sm font-medium text-text break-words">{evento.titulo}</p><p className="mt-1 mb-0 text-xs text-text-sub">{evento.nPecas} {evento.nPecas === 1 ? 'peça' : 'peças'} / {evento.tipo === 'padronizada' ? 'pacote de casamento' : 'locação avulsa'}</p></div>
      </li>)}
    </ol>}
  </section>;
}
