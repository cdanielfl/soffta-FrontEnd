import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Reception from './pages/Reception'
import Counter from './pages/Counter'
import PublicPanel from './pages/PublicPanel'
import AdminDashboard from './pages/AdminDashboard'
import Profile from './pages/Profile'
import Customization from './pages/Customization'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/painel" element={<PublicPanel />} />
        
        {/* Rotas Protegidas */}
        <Route path="/painel-controle" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/personalizacao" element={<PrivateRoute requiredPermission="canAccessAdmin"><Customization /></PrivateRoute>} />
        
        <Route 
          path="/recepcao" 
          element={
            <PrivateRoute requiredPermission="canAccessRecepcao">
              <Reception />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/guiche" 
          element={
            <PrivateRoute requiredPermission="canAccessGuiche">
              <Counter />
            </PrivateRoute>
          } 
        />
        
        <Route 
          path="/administrador" 
          element={
            <PrivateRoute requiredPermission="canAccessAdmin">
              <AdminDashboard />
            </PrivateRoute>
          } 
        />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
