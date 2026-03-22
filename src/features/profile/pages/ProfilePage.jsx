import { useAuth } from '../../../features/auth/store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Shield, Building2, CheckCircle, XCircle, Edit, Key, ArrowLeft } from 'lucide-react';
import { PERMISSIONS, getUpaBySlug } from '../../../shared/utils/permissions';
import Navbar from '../../../shared/components/layout/Navbar';
import { useFeedback } from '../../../shared/context/FeedbackContext';
import '../../../styles/Profile.css';

const Profile = () => {
  const { user } = useAuth();
  const { showToast } = useFeedback();

  const notifyWip = () => {
    showToast({
      title: 'Funcionalidade em desenvolvimento',
      description: 'Em breve esse recurso estará disponível.',
      type: 'info'
    });
  };
  const navigate = useNavigate();

  if (!user) return null;

  const userPermissions = PERMISSIONS[user.role] || {};
  const userUpa = user.upa_id ? getUpaBySlug(user.upa_id) : null;

  const permissionsList = [
    { key: 'canAccessAllUpas', label: 'Acesso a todas UPAs', icon: Building2 },
    { key: 'canManageUsers', label: 'Gerenciar usuários', icon: User },
    { key: 'canManageUpas', label: 'Gerenciar UPAs', icon: Building2 },
    { key: 'canViewDashboard', label: 'Ver Dashboard', icon: Shield },
    { key: 'canAccessRecepcao', label: 'Acessar Recepção', icon: User },
    { key: 'canAccessGuiche', label: 'Acessar Guichê', icon: User },
    { key: 'canAccessAdmin', label: 'Painel Admin', icon: Shield },
    { key: 'canAccessSuperAdmin', label: 'Super Admin', icon: Shield }
  ];

  return (
    <>
      <Navbar title="Meu Perfil" subtitle="Informações da conta" />
      <div className="profile-container">
        <button onClick={() => navigate('/painel-controle')} className="back-button">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h1>{user.name}</h1>
          <div className="profile-role">{userPermissions.label || user.role}</div>
        </div>

        <div className="profile-sections">
          {/* Informações Pessoais */}
          <div className="card profile-section">
            <h2>
              <User size={20} />
              Informações Pessoais
            </h2>
            <div className="profile-info-grid">
              <div className="profile-info-item">
                <span className="profile-info-label">Nome Completo</span>
                <div className="profile-info-value">{user.name}</div>
              </div>
              <div className="profile-info-item">
                <span className="profile-info-label">Email</span>
                <div className="profile-info-value">
                  <Mail size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                  {user.email}
                </div>
              </div>
              {userUpa && (
                <div className="profile-info-item">
                  <span className="profile-info-label">Unidade</span>
                  <div className="profile-info-value">
                    <Building2 size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                    {userUpa.name}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Permissões */}
          <div className="card profile-section">
            <h2>
              <Shield size={20} />
              Permissões e Acessos
            </h2>
            <div className="permissions-list">
              {permissionsList.map((perm) => {
                const hasPermission = userPermissions[perm.key];
                return (
                  <div
                    key={perm.key}
                    className={`permission-item ${hasPermission ? 'active' : 'inactive'}`}
                  >
                    {hasPermission ? (
                      <CheckCircle size={20} className="permission-icon" />
                    ) : (
                      <XCircle size={20} className="permission-icon" />
                    )}
                    <span>{perm.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ações */}
          <div className="card profile-section">
            <h2>Ações</h2>
            <div className="actions-section">
              <button className="btn btn-primary" onClick={notifyWip}>
                <Edit size={18} />
                Editar Perfil
              </button>
              <button className="btn btn-secondary" onClick={notifyWip}>
                <Key size={18} />
                Alterar Senha
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;

