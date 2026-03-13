import { Navigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/store/AuthContext';
import { hasPermission } from '../../utils/permissions';

const PrivateRoute = ({ children, requireAdmin = false, requiredPermission = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/entrar" replace />;
  }

  // Verificar permissão específica se fornecida
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/painel-controle" replace />;
  }

  if (requireAdmin && user?.role !== 'admin') {
    return <Navigate to="/painel-controle" replace />;
  }

  return children;
};

export default PrivateRoute;
