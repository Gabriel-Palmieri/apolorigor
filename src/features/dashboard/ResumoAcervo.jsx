import { Link } from 'react-router-dom';
import { fmt } from '../../shared/lib/format.js';

export default function ResumoAcervo({ acervo, valorRegistrado }) {
  const valores = [
    ['Peças em acervo', acervo.total], ['Disponíveis', acervo.disponivel],
    ['Alugadas', acervo.alugado], ['Em ajuste', acervo.ajuste],
    ['Ocupação', (acervo.total ? Math.round(acervo.alugado / acervo.total * 100) : 0) + '%'],
    ['Valor registrado', 'R$ ' + fmt(valorRegistrado)],
  ];
  return <details className="dashboard-summary">
    <summary className="cursor-pointer py-5 text-sm font-medium text-text">Acervo e valores</summary>
    <div className="pb-6">
      <dl className="m-0 grid grid-cols-2 desktop:grid-cols-3 gap-x-8 gap-y-6">
        {valores.map(([label, value]) => <div key={label}><dt className="text-xs text-text-sub">{label}</dt><dd className="dashboard-number m-0 mt-2 text-lg">{value}</dd></div>)}
      </dl>
      <div className="flex items-center flex-wrap gap-x-6 gap-y-2 mt-6">
        <Link to="/sistema/estoque" className="dashboard-text-link">Consultar estoque</Link>
        <Link to="/sistema/locacoes" className="dashboard-text-link">Ver histórico de transações</Link>
      </div>
      <p className="mt-3 mb-0 text-xs text-text-sub">Valor total das vendas e locações cadastradas, sem conciliação de pagamentos.</p>
    </div>
  </details>;
}
