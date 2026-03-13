import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, LogIn } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/painel-controle');
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">
            <LogIn size={32} />
          </div>
          <h1>Bem-vindo de volta</h1>
          <p>Entre com suas credenciais para continuar</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-wrapper">
              <User size={20} className="input-icon" />
              <input
                id="email"
                type="email"
                className="input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock size={20} className="input-icon" />
              <input
                id="password"
                type="password"
                className="input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <div className="loading-spinner" /> : 'Entrar'}
          </button>

          <div className="login-footer">
            <p>
              Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
          </div>

          {/* MODO DESENVOLVIMENTO - Remover em produção */}
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '0.5rem', fontSize: '0.75rem' }}>
            <strong>Modo Desenvolvimento - Exemplos de login:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li><strong>super@admin.com</strong> - Super Admin (acesso total)</li>
              <li><strong>diretora@instituto.com</strong> - Admin Master (todas UPAs)</li>
              <li><strong>admin-jangurussu@upa.com</strong> - Admin UPA Jangurussu</li>
              <li><strong>admin-edson-queiroz@upa.com</strong> - Admin UPA Edson Queiroz</li>
              <li><strong>recepcao-jangurussu@upa.com</strong> - Recepcionista Jangurussu</li>
              <li><strong>atendente-itaperi@upa.com</strong> - Atendente Itaperi</li>
            </ul>
            <p style={{ marginTop: '0.5rem', color: '#64748b' }}>Senha: qualquer uma</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
