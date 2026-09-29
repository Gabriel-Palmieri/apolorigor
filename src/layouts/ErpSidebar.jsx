import { Link, NavLink } from "react-router-dom";
import { ERP_NAV as NAV } from "../app/navigation.js";
import { cn } from "../shared/lib/cn.js";

export default function ErpSidebar({ page, novos, onNavigate }) {
  return (
    <aside className="erp-sidebar w-56 shrink-0 bg-bg-elevated text-text border-r border-border-soft flex flex-col">
      <div className="px-6 pt-7 pb-8">
        <Link
          to="/sistema/dashboard"
          onClick={onNavigate}
          className="font-display text-2xl text-text no-underline"
        >
          Apollo Rigor
        </Link>
        <p className="m-0 mt-2 text-xs text-text-sub">Gestão do ateliê</p>
      </div>
      <nav aria-label="Navegação do sistema" className="flex-1 px-3 pb-6">
        {NAV.map(({ key, label }) => (
          <NavLink
            key={key}
            to={"/sistema/" + key}
            onClick={onNavigate}
            aria-current={page === key ? "page" : undefined}
            className={cn(
              "flex items-center justify-between gap-3 px-4 py-3 mb-1 min-h-11 rounded-control no-underline text-sm font-medium",
              page === key
                ? "bg-gold-strong text-button-ink"
                : "text-text hover:bg-bg",
            )}
          >
            <span>{label}</span>
            {key === "pedidos" && novos > 0 && (
              <span
                className="text-xs tabular-nums"
                aria-label={novos + " pedidos novos"}
              >
                {novos}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="px-6 py-5">
        <Link
          to="/"
          className="inline-flex items-center min-h-11 text-sm text-text-sub underline underline-offset-4"
        >
          Ver o site do cliente
        </Link>
      </div>
    </aside>
  );
}
