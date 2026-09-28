import { Link } from 'react-router-dom';
import { ATELIE } from '../catalog/siteData.js';

export default function HomeAtelie({ go }) {
  return <footer id="atelie" className="bg-sidebar text-sidebar-text scroll-mt-24">
    <div className="max-w-site mx-auto py-12 desktop:py-20 px-gutter">
      <div className="grid desktop:grid-cols-pair gap-10 desktop:gap-20">
        <div>
          <p className="m-0 font-display text-title text-sidebar-text">A prova faz<br />toda a diferença.</p>
          <p className="mt-5 mb-0 text-sm text-sidebar-text leading-relaxed">Visite o ateliê e encontre o caimento do seu traje.</p>
        </div>
        <div className="grid phone:grid-cols-2 gap-8 text-sm">
          <div><h3 className="m-0 text-base font-medium">Nosso ateliê</h3><p className="mt-4 mb-0 leading-relaxed">{ATELIE.endereco}<br />{ATELIE.cidade}</p><p className="mt-3 mb-0 leading-relaxed">{ATELIE.horario}</p></div>
          <div><h3 className="m-0 text-base font-medium">Fale com a gente</h3><a href={'tel:' + ATELIE.tel.replace(/\D/g, '')} className="block mt-4 text-sidebar-text underline underline-offset-4">{ATELIE.tel}</a><a href={'mailto:' + ATELIE.email} className="block mt-3 text-sidebar-text underline underline-offset-4 break-words">{ATELIE.email}</a><button onClick={() => go('conta', 'pedidos')} className="mt-6 p-0 min-h-11 bg-transparent border-0 text-sidebar-text underline underline-offset-4 text-sm cursor-pointer">Meus pedidos</button></div>
        </div>
      </div>
      <div className="mt-12 desktop:mt-20 pt-6 border-t border-sidebar-text/20 flex justify-between items-end flex-wrap gap-5">
        <div><p className="m-0 font-display text-3xl">Apollo Rigor</p><p className="mt-2 mb-0 text-xs text-sidebar-text">© {new Date().getFullYear()} Apollo Rigor</p></div>
        <Link to="/sistema" className="text-sm text-sidebar-text underline underline-offset-4">Acesso da equipe</Link>
      </div>
    </div>
  </footer>;
}
