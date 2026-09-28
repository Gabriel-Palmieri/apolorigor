import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ErpLayout from '../layouts/ErpLayout.jsx';
import SiteLayout from '../layouts/SiteLayout.jsx';
import NotFound from '../pages/NotFound.jsx';
import { useSessao } from '../features/conta/session.js';
import { StorageStatus } from "./StorageStatus.jsx";
import { LoadingScreen } from '../shared/ui/LoadingScreen.jsx';
const Home = lazy(() => import('../pages/site/Home.jsx'));
const Colecao = lazy(() => import('../pages/site/Colecao.jsx'));
const Provador = lazy(() => import('../pages/site/Provador.jsx'));
const Pedido = lazy(() => import('../pages/site/Pedido.jsx'));
const Pacote = lazy(() => import('../pages/site/Pacote.jsx'));
const Entrar = lazy(() => import('../pages/site/Entrar.jsx'));
const Conta = lazy(() => import('../pages/site/Conta.jsx'));
const Casamento = lazy(() => import('../pages/site/Casamento.jsx'));
const Dashboard = lazy(() => import('../pages/erp/Dashboard.jsx'));
const Estoque = lazy(() => import('../pages/erp/Estoque.jsx'));
const Locacoes = lazy(() => import('../pages/erp/Locacoes.jsx'));
const Anuario = lazy(() => import('../pages/erp/Anuario.jsx'));
const Ajustes = lazy(() => import('../pages/erp/Ajustes.jsx'));
const Pedidos = lazy(() => import('../pages/erp/Pedidos.jsx'));
function ClienteRoute({
  children
}) {
  const sessao = useSessao();
  return sessao?.tipo === 'cliente' ? children : <Navigate to="/entrar" replace />;
}
export default function AppRouter() {
  return <BrowserRouter>
    <StorageStatus />
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="colecao/:produtoId?" element={<Colecao />} />
          <Route path="provador" element={<Provador />} />
          <Route path="pedido" element={<Pedido />} />
          <Route path="pacote" element={<Pacote />} />
          <Route path="entrar" element={<Entrar />} />
          <Route path="conta" element={<Navigate to="/conta/pedidos" replace />} />
          <Route path="conta/pedidos/:protocolo?" element={<ClienteRoute><Conta /></ClienteRoute>} />
          <Route path="conta/perfil" element={<ClienteRoute><Conta /></ClienteRoute>} />
          <Route path="casamento/:pacoteId?" element={<ClienteRoute><Casamento /></ClienteRoute>} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="sistema" element={<ErpLayout />}>
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
  </BrowserRouter>;
}
