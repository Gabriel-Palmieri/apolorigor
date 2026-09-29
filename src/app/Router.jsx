import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import ErpLayout from "../layouts/ErpLayout.jsx";
import SiteLayout from "../layouts/SiteLayout.jsx";
import NotFound from "../pages/NotFound.jsx";
import { useSessao, useEstadoSessao } from "../features/conta/sessao.js";
import { ConnectionStatus } from "./ConnectionStatus.jsx";
import { ApiConnection } from "./ApiConnection.jsx";
import { LoadingScreen } from "../shared/ui/feedback/LoadingScreen.jsx";
import { DataBoundary } from "./DataBoundary.jsx";
const Home = lazy(() => import("../pages/site/Home.jsx"));
const Colecao = lazy(() => import("../pages/site/Colecao.jsx"));
const Provador = lazy(() => import("../pages/site/Provador.jsx"));
const Pedido = lazy(() => import("../pages/site/Pedido.jsx"));
const Pacote = lazy(() => import("../pages/site/Pacote.jsx"));
const Entrar = lazy(() => import("../pages/site/Entrar.jsx"));
const Conta = lazy(() => import("../pages/site/Conta.jsx"));
const Casamento = lazy(() => import("../pages/site/Casamento.jsx"));
const Dashboard = lazy(() => import("../pages/erp/Dashboard.jsx"));
const Estoque = lazy(() => import("../pages/erp/Estoque.jsx"));
const Locacoes = lazy(() => import("../pages/erp/Locacoes.jsx"));
const Anuario = lazy(() => import("../pages/erp/Anuario.jsx"));
const Ajustes = lazy(() => import("../pages/erp/Ajustes.jsx"));
const Pedidos = lazy(() => import("../pages/erp/Pedidos.jsx"));
const AuthCallback = lazy(() => import("../pages/site/AuthCallback.jsx"));
function ClienteRoute({ children, tipo = "cliente" }) {
  const sessao = useSessao();
  const status = useEstadoSessao();
  const location = useLocation();
  if (status.restoring) return <LoadingScreen />;
  if (sessao && !status.verified)
    return (
      <p role="status" className="p-8 text-text-sub">
        Não foi possível validar seu acesso. Tente novamente na mensagem de
        conexão.
      </p>
    );
  if (sessao && sessao.tipo !== tipo)
    return (
      <Navigate
        to={sessao.tipo === "admin" ? "/sistema" : "/conta/pedidos"}
        replace
      />
    );
  return sessao?.tipo === tipo ? (
    children
  ) : (
    <Navigate
      to={
        "/entrar?next=" +
        encodeURIComponent(location.pathname + location.search)
      }
      replace
    />
  );
}
export default function AppRouter() {
  return (
    <BrowserRouter>
      <ApiConnection />
      <ConnectionStatus />
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<Home />} />
            <Route
              path="colecao/:produtoId?"
              element={
                <DataBoundary>
                  <Colecao />
                </DataBoundary>
              }
            />
            <Route
              path="provador"
              element={
                <DataBoundary>
                  <Provador />
                </DataBoundary>
              }
            />
            <Route
              path="pedido"
              element={
                <ClienteRoute>
                  <DataBoundary>
                    <Pedido />
                  </DataBoundary>
                </ClienteRoute>
              }
            />
            <Route path="pacote" element={<Pacote />} />
            <Route path="entrar" element={<Entrar />} />
            <Route path="auth/callback" element={<AuthCallback />} />
            <Route path="auth/reset-password" element={<AuthCallback />} />
            <Route
              path="conta"
              element={<Navigate to="/conta/pedidos" replace />}
            />
            <Route
              path="conta/pedidos/:protocolo?"
              element={
                <ClienteRoute>
                  <DataBoundary>
                    <Conta />
                  </DataBoundary>
                </ClienteRoute>
              }
            />
            <Route
              path="conta/perfil"
              element={
                <ClienteRoute>
                  <DataBoundary>
                    <Conta />
                  </DataBoundary>
                </ClienteRoute>
              }
            />
            <Route
              path="casamento/:pacoteId?"
              element={
                <ClienteRoute>
                  <Casamento />
                </ClienteRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route
            path="sistema"
            element={
              <ClienteRoute tipo="admin">
                <ErpLayout />
              </ClienteRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pedidos" element={<Pedidos />} />
            <Route path="estoque" element={<Estoque />} />
            <Route path="locacoes" element={<Locacoes />} />
            <Route path="anuario" element={<Anuario />} />
            <Route path="ajustes" element={<Ajustes />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
