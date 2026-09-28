import { useNavigate } from 'react-router-dom';
import { useData } from '../../data/useData.js';
import { resumoDashboard } from '../../domain/dashboard.js';
import { Button } from '../../shared/ui/Button.jsx';
import Pendencias from '../../features/dashboard/Pendencias.jsx';
import ProximasMovimentacoes from '../../features/dashboard/ProximasMovimentacoes.jsx';
import ResumoAcervo from '../../features/dashboard/ResumoAcervo.jsx';

export default function Dashboard() {
  const data = useData();
  const navigate = useNavigate();
  const agora = new Date();
  const hoje = [agora.getFullYear(), String(agora.getMonth() + 1).padStart(2, '0'), String(agora.getDate()).padStart(2, '0')].join('-');
  const { pendencias, proximos, acervo, valorRegistrado } = resumoDashboard(data, hoje);
  return <div className="max-w-6xl mx-auto">
    <div className="flex justify-between items-center flex-wrap gap-5 mb-10">
      <p className="m-0 text-sm text-text-sub"><time dateTime={hoje}>{agora.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}</time></p>
      <Button onClick={() => navigate('/sistema/locacoes?aba=avulsa')}>Nova locação</Button>
    </div>
    <div className="grid grid-cols-1 desktop:grid-cols-pair gap-10 wide:gap-16 items-start">
      <Pendencias pendencias={pendencias} />
      <ProximasMovimentacoes eventos={proximos} hoje={hoje} />
    </div>
    <ResumoAcervo acervo={acervo} valorRegistrado={valorRegistrado} />
  </div>;
}
