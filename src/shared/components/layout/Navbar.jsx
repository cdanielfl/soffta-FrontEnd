import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../features/auth/store/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, User, Home, Moon, Sun } from 'lucide-react';
import '../../../styles/Navbar.css';

const Navbar = ({ title, subtitle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/entrar');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-left">
          <button onClick={() => navigate('/painel-controle')} className="btn-icon">
            <Home size={20} />
          </button>
          {title && (
            <div className="navbar-title">
              <h2>{title}</h2>
              {subtitle && <p>{subtitle}</p>}
            </div>
          )}
        </div>
        <div className="navbar-right">
          <button onClick={toggleTheme} className="btn-icon" title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => navigate('/perfil')} className="btn-icon" title="Meu Perfil">
            <User size={20} />
          </button>
          <button onClick={handleLogout} className="btn btn-secondary btn-sm">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

