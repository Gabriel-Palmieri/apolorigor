import { cn } from "../shared/lib/cn.js";
import { useState } from "react";
import { useMediaQuery } from "../shared/lib/useMediaQuery.js";
import { Outlet, useLocation } from "react-router-dom";
import { DataBoundary } from "../app/DataBoundary.jsx";
import BotaoSair from "../features/conta/BotaoSair.jsx";
import { ERP_NAV as NAV } from "../app/navigation.js";
import ErpSidebar from "./ErpSidebar.jsx";
import { ThemeToggle } from "../shared/ui/tema/ThemeToggle.jsx";
import { ManagementSurfaceProvider } from "../shared/ui/tema/ManagementSurface.jsx";
import { useContagemNovos } from "../features/pedidos/usePedidos.js";
export default function ErpLayout() {
  const desktop = useMediaQuery("(min-width: 901px)");
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const page = location.pathname.split("/")[2];
  const novos = useContagemNovos();
  const nav = NAV.find((n) => n.key === page) || {
    label: "Página não encontrada",
    sub: "Endereço indisponível",
  };
  return (
    <ManagementSurfaceProvider>
      <div
        className={cn(
          "flex h-screen bg-bg text-text font-sans",
          "erp-shell management-surface",
        )}
      >
        {/* ── Sidebar ── */}
        <details
          className="erp-navigation"
          open={desktop || menuOpen}
          onToggle={(event) => {
            if (!desktop) setMenuOpen(event.currentTarget.open);
          }}
        >
          <summary className="erp-menu-toggle">
            <span className="erp-menu-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                {menuOpen ? <path d="m6 6 12 12M6 18 18 6" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </span>
            <span className="erp-menu-label">Menu do sistema</span>
            <span className="erp-menu-action">
              {menuOpen ? "Fechar" : "Abrir"}
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 7.5 5 5 5-5" />
              </svg>
            </span>
          </summary>
          <ErpSidebar
            page={page}
            novos={novos}
            onNavigate={() => setMenuOpen(false)}
          />
        </details>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="erp-header flex items-center justify-between gap-5 px-8 py-5 shrink-0 border-b border-border-soft">
            <h1 className="m-0 text-2xl font-sans font-medium text-text">
              {nav.label}
            </h1>
            <div className="flex items-center gap-3">
              <BotaoSair />
              <ThemeToggle variant="minimal" />
            </div>
          </header>

          <main
            id="main-content"
            className={cn("flex-1 py-8 px-8 overflow-y-auto", "erp-main")}
          >
            <DataBoundary>
              <Outlet />
            </DataBoundary>
          </main>
        </div>
      </div>
    </ManagementSurfaceProvider>
  );
}
