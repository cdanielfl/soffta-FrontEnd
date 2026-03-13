import { Routes, Route } from 'react-router-dom'
import PrivateRoute from '../shared/components/layout/PrivateRoute'
import Login from '../features/auth/pages/Login'
import Register from '../features/auth/pages/Register'
import Dashboard from '../app/Dashboard'
import ReceptionPage from '../features/queue/pages/ReceptionPage'
import CounterPage from '../features/queue/pages/CounterPage'
import PublicPanelPage from '../features/queue/pages/PublicPanelPage'
import AdminDashboardPage from '../features/admin/pages/AdminDashboardPage'
import ProfilePage from '../features/profile/pages/ProfilePage'
import CustomizationPage from '../features/customization/pages/CustomizationPage'
import NotFoundPage from '../app/NotFoundPage'

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/entrar" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route path="/painel" element={<PublicPanelPage />} />

      {/* Rotas Protegidas */}
      <Route path="/painel-controle" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/perfil" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/personalizacao" element={<PrivateRoute requiredPermission="canAccessAdmin"><CustomizationPage /></PrivateRoute>} />

      <Route
        path="/recepcao"
        element={
          <PrivateRoute requiredPermission="canAccessRecepcao">
            <ReceptionPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/guiche"
        element={
          <PrivateRoute requiredPermission="canAccessGuiche">
            <CounterPage />
          </PrivateRoute>
        }
      />

      <Route
        path="/administrador"
        element={
          <PrivateRoute requiredPermission="canAccessAdmin">
            <AdminDashboardPage />
          </PrivateRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}