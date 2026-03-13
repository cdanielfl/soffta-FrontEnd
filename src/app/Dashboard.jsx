import { useAuth } from '../features/auth/store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../shared/context/ThemeContext';
import { LogOut, User, LayoutDashboard, Users, Stethoscope, Monitor, BarChart3, Moon, Sun, Palette } from 'lucide-react';
import { hasPermission } from '../shared/utils/permissions';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/entrar');
  };

  const modules = [
    {
      title: 'Recepção',
      description: 'Cadastrar pacientes na fila',
      icon: Users,
      path: '/recepcao',
      color: '#6366f1',
      permission: 'canAccessRecepcao'
    },
    {
      title: 'Guichê',
      description: 'Atender pacientes',
      icon: Stethoscope,
      path: '/guiche',
      color: '#10b981',
      permission: 'canAccessGuiche'
    },
    {
      title: 'Painel TV',
      description: 'Visualizar chamadas',
      icon: Monitor,
      path: '/painel',
      color: '#f59e0b',
      permission: null // Pública
    },
    {
      title: 'Administrador',
      description: 'Dashboard e estatísticas',
      icon: BarChart3,
      path: '/administrador',
      color: '#8b5cf6',
      permission: 'canAccessAdmin'
    },
    {
      title: 'Perfil',
      description: 'Meus dados e configurações',
      icon: User,
      path: '/perfil',
      color: '#06b6d4',
      permission: null // Todos podem acessar
    },
    {
      title: 'Personalização',
      description: 'Logo e cores da UPA',
      icon: Palette,
      path: '/personalizacao',
      color: '#ec4899',
      permission: 'canAccessAdmin'
    }
  ];

  // Filtrar módulos baseado nas permissões do usuário
  const accessibleModules = modules.filter(module => {
    if (!module.permission) return true; // Módulos sem permissão são acessíveis a todos
    return hasPermission(user, module.permission);
  });

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-brand">
            <LayoutDashboard size={24} />
            <span>Soffta SGF</span>
          </div>
          <div className="nav-actions">
            <button onClick={toggleTheme} className="btn-icon" title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'} style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.5rem',
              background: 'var(--bg-secondary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'var(--text-secondary)'
            }}>
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={() => navigate('/perfil')} className="btn-icon" title="Meu Perfil" style={{
              width: '40px',
              height: '40px',
              borderRadius: '0.5rem',
              background: 'var(--bg-secondary)',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'var(--text-secondary)'
            }}>
              <User size={20} />
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              <LogOut size={18} />
              Sair
            </button>
          </div>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Bem-vindo, {user?.name}!</h1>
            <p>Selecione um módulo para começar</p>
          </div>

          <div className="modules-grid">
            {accessibleModules.map((module) => (
              <div
                key={module.path}
                className="module-card card"
                onClick={() => navigate(module.path)}
                style={{ cursor: 'pointer' }}
              >
                <div className="module-icon" style={{ background: `${module.color}20`, color: module.color }}>
                  <module.icon size={32} />
                </div>
                <h3>{module.title}</h3>
                <p>{module.description}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
