import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { siteDestination } from '../app/navigation.js';
import { ThemeToggle } from '../shared/ui/ThemeToggle.jsx';
import { useSessao } from '../features/conta/session.js';
import { cn } from '../shared/lib/cn.js';

export default function SiteNav({ view }) {
  const menuRef = useRef(null);
  const sessao = useSessao();
  const cliente = sessao?.tipo === 'cliente' ? sessao : null;
  const links = [{ key: 'colecao', label: 'Coleção' }, { key: 'provador', label: 'Provador' }, { key: 'pacote', label: 'Casamentos' }, { key: 'como-funciona', label: 'Como funciona' }];
  useEffect(() => {
    const close = event => { if (event.key === 'Escape') { menuRef.current?.removeAttribute('open'); menuRef.current?.querySelector('summary')?.focus(); } };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, []);
  return <header className="site-header sticky top-0 z-40 bg-bg border-b border-border-soft">
    <a href="#main-content" className="site-skip-link">Ir para o conteúdo</a>
    <div className="max-w-site mx-auto px-gutter h-20 flex items-center justify-between gap-5 site-nav-row">
      <Link to="/" className="site-brand" aria-label="Apollo Rigor, página inicial">
        <span className="block font-display text-3xl desktop:text-4xl text-text leading-none tracking-tight">Apollo Rigor</span>
        <span className="block text-xs text-text-sub mt-2">Ateliê de cerimônia</span>
      </Link>
      <nav className="flex items-center gap-5 site-primary-nav" aria-label="Navegação principal">
        <div className="flex gap-7 site-nav-links">
          {links.map(link => <Link key={link.key} to={siteDestination(link.key)} aria-current={view === link.key ? 'page' : undefined} className={cn('site-nav-link', view === link.key && 'text-gold-text underline underline-offset-8')}>{link.label}</Link>)}
        </div>
        <details className="site-mobile-menu" ref={menuRef}>
          <summary><span className="site-menu-icon" aria-hidden="true"><span /><span /></span>Menu</summary>
          <nav aria-label="Menu do site" className="site-mobile-links">
            {[...links, { key: cliente ? 'conta' : 'entrar', label: cliente ? 'Minha conta' : 'Entrar' }].map(link => <Link key={link.key} to={siteDestination(link.key)} onClick={() => menuRef.current?.removeAttribute('open')}>{link.label}</Link>)}
          </nav>
        </details>
        <Link to={cliente ? '/conta/pedidos' : '/entrar'} className="site-account-link site-nav-link border-l border-border pl-5">{cliente ? cliente.nome.split(' ')[0] : 'Entrar'}</Link>
        <ThemeToggle variant="minimal" />
      </nav>
    </div>
  </header>;
}
