import { cn } from "../shared/lib/cn.js";
import { useState } from "react";
import { useMediaQuery } from "../shared/lib/useMediaQuery.js";
import { Outlet, useLocation } from "react-router-dom";
import { ERP_NAV as NAV } from "../app/navigation.js";
import ErpSidebar from "./ErpSidebar.jsx";
import { ThemeToggle } from "../shared/ui/ThemeToggle.jsx";
import { ManagementSurfaceProvider } from '../shared/ui/ManagementSurface.jsx';
import { useContagemNovos } from "../features/pedidos/store.js";
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
    <div className={cn("flex h-screen bg-bg text-text font-sans", "erp-shell management-surface")}>
      {/* ── Sidebar ── */}
      <details
        className="erp-navigation"
        open={desktop || menuOpen}
        onToggle={(event) => {
          if (!desktop) setMenuOpen(event.currentTarget.open);
        }}
      >
        <summary>Menu do sistema</summary>
        <ErpSidebar
          page={page}
          novos={novos}
          onNavigate={() => setMenuOpen(false)}
        />
      </details>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="erp-header flex items-center justify-between gap-5 px-8 py-5 shrink-0 border-b border-border-soft">
          <h1 className="m-0 text-2xl font-sans font-medium text-text">{nav.label}</h1>
          <ThemeToggle variant="minimal" />
        </header>

        <main
          id="main-content"
          className={cn("flex-1 py-8 px-8 overflow-y-auto", "erp-main")}
        >
          <Outlet />
        </main>
      </div>
    </div>
    </ManagementSurfaceProvider>
  );
}
