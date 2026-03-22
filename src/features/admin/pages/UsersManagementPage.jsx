import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Filter, Search, ShieldCheck, ShieldOff, UserPlus, Users } from 'lucide-react';
import { useAuth } from '../../auth/store/AuthContext';
import { getAccessibleUpas, hasPermission, UPAS } from '../../../shared/utils/permissions';
import Navbar from '../../../shared/components/layout/Navbar';
import { adminService } from '../services/adminService';
import '../../../styles/UsersManagement.css';

const ROLE_LABELS = {
  super_admin: 'Super Admin',
  admin_master: 'Direção',
  admin_upa: 'Admin UPA',
  recepcionista: 'Recepcionista',
  atendente: 'Atendente'
};

const STATUS_LABELS = {
  active: 'Ativo',
  inactive: 'Inativo'
};

const MOCK_USERS = [
  { id: '1', name: 'Super', email: 'super@admin.com', role: 'super_admin', upa_id: 'jangurussu', status: 'active' },
  { id: '2', name: 'Diretora', email: 'diretora@instituto.com', role: 'admin_master', upa_id: 'edson-queiroz', status: 'active' },
  { id: '3', name: 'Admin Jangurussu', email: 'admin-jangurussu@upa.com', role: 'admin_upa', upa_id: 'jangurussu', status: 'active' },
  { id: '4', name: 'Recep Jangurussu', email: 'recepcao-jangurussu@upa.com', role: 'recepcionista', upa_id: 'jangurussu', status: 'active' },
  { id: '5', name: 'Atendente Itaperi', email: 'atendente-itaperi@upa.com', role: 'atendente', upa_id: 'itaperi', status: 'inactive' },
  { id: '6', name: 'Admin Edson Queiroz', email: 'admin-edson-queiroz@upa.com', role: 'admin_upa', upa_id: 'edson-queiroz', status: 'active' }
];

const resolveAccessibleUpas = (user) => {
  if (!user) return [];

  if (Array.isArray(user.related_upa_ids) && user.related_upa_ids.length > 0) {
    return Object.values(UPAS).filter((upa) => user.related_upa_ids.includes(upa.id));
  }

  if (Array.isArray(user.upa_ids) && user.upa_ids.length > 0) {
    return Object.values(UPAS).filter((upa) => user.upa_ids.includes(upa.id));
  }

  return getAccessibleUpas(user);
};

const normalizeUser = (user) => {
  const upaId = user.upa_id || user.upaId || user.unidade_id || user?.upa?.id || null;
  const status = user.status || (user.active === false ? 'inactive' : 'active');
  return {
    id: user.id || user._id || user.uuid || user.email,
    name: user.name || user.nome || 'Usuário',
    email: user.email || user.login || '---',
    role: user.role || user.perfil || 'recepcionista',
    upa_id: upaId,
    status
  };
};

const UsersManagementPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accessibleUpas, setAccessibleUpas] = useState([]);
  const [selectedUpa, setSelectedUpa] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const upas = resolveAccessibleUpas(user);
    setAccessibleUpas(upas);

    if (hasPermission(user, 'canAccessAllUpas')) {
      setSelectedUpa('all');
      return;
    }

    if (user?.upa_id) {
      setSelectedUpa(user.upa_id);
      return;
    }

    if (upas.length > 0) {
      setSelectedUpa(upas[0].id);
    }
  }, [user]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let data = [];

      if (selectedUpa === 'all') {
        const requests = accessibleUpas.map((upa) => adminService.getUsers(upa.id));
        const results = await Promise.all(requests);
        data = results.flatMap((result) => (Array.isArray(result) ? result : result?.users || []));
      } else if (selectedUpa) {
        const result = await adminService.getUsers(selectedUpa);
        data = Array.isArray(result) ? result : result?.users || [];
      }

      setUsers(data.length > 0 ? data : MOCK_USERS);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setUsers(MOCK_USERS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedUpa) return;
    fetchUsers();
  }, [selectedUpa, accessibleUpas.length]);

  const allUpas = useMemo(() => Object.values(UPAS), []);

  const normalizedUsers = useMemo(() => users.map(normalizeUser), [users]);

  const filteredUsers = useMemo(() => {
    const term = search.trim().toLowerCase();

    return normalizedUsers.filter((u) => {
      if (selectedUpa !== 'all' && selectedUpa && u.upa_id !== selectedUpa) return false;
      if (roleFilter !== 'all' && u.role !== roleFilter) return false;
      if (statusFilter !== 'all' && u.status !== statusFilter) return false;

      if (!term) return true;
      return (
        u.name.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term)
      );
    });
  }, [normalizedUsers, search, roleFilter, statusFilter, selectedUpa]);

  const totalUsers = filteredUsers.length;
  const activeUsers = filteredUsers.filter((u) => u.status === 'active').length;
  const inactiveUsers = filteredUsers.filter((u) => u.status === 'inactive').length;
  const adminUsers = filteredUsers.filter((u) => ['super_admin', 'admin_master', 'admin_upa'].includes(u.role)).length;

  return (
    <>
      <Navbar title="Gestão de Usuários" subtitle="Controle de acesso por unidade" />
      <div className="users-container">
        <button onClick={() => navigate('/painel-controle')} className="back-button">
          <ArrowLeft size={20} />
          Voltar
        </button>

        <div className="users-header">
          <div>
            <h1>Gestão de Usuários</h1>
            <p>
              {hasPermission(user, 'canAccessAllUpas')
                ? 'Visão consolidada de todas as unidades vinculadas.'
                : 'Usuários restritos à sua unidade.'}
            </p>
            {selectedUpa && selectedUpa !== 'all' && (
              <div className="users-flag">
                {allUpas.find((upa) => upa.id === selectedUpa)?.name || 'Unidade atual'}
              </div>
            )}
          </div>

          <div className="users-actions">
            <button className="btn btn-secondary">
              <Filter size={18} />
              Exportar
            </button>
            <button className="btn btn-primary">
              <UserPlus size={18} />
              Novo Usuário
            </button>
          </div>
        </div>

        <div className="card users-filters">
          <div className="input-group">
            <label htmlFor="search">Buscar</label>
            <div className="users-input-icon">
              <Search size={18} />
              <input
                id="search"
                className="input"
                placeholder="Nome ou e-mail"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {hasPermission(user, 'canAccessAllUpas') && accessibleUpas.length > 1 && (
            <div className="input-group">
              <label htmlFor="upa">Unidade</label>
              <select
                id="upa"
                className="input"
                value={selectedUpa}
                onChange={(e) => setSelectedUpa(e.target.value)}
              >
                <option value="all">Todas as unidades</option>
                {accessibleUpas.map((upa) => (
                  <option key={upa.id} value={upa.id}>{upa.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="input-group">
            <label htmlFor="role">Perfil</label>
            <select
              id="role"
              className="input"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              {Object.keys(ROLE_LABELS).map((role) => (
                <option key={role} value={role}>{ROLE_LABELS[role]}</option>
              ))}
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              className="input"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="active">Ativo</option>
              <option value="inactive">Inativo</option>
            </select>
          </div>
        </div>

        <div className="users-stats">
          <div className="card stat-card">
            <div className="stat-icon indigo">
              <Users size={20} />
            </div>
            <div>
              <span>Total</span>
              <strong>{totalUsers}</strong>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon emerald">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span>Ativos</span>
              <strong>{activeUsers}</strong>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon rose">
              <ShieldOff size={20} />
            </div>
            <div>
              <span>Inativos</span>
              <strong>{inactiveUsers}</strong>
            </div>
          </div>
          <div className="card stat-card">
            <div className="stat-icon amber">
              <Users size={20} />
            </div>
            <div>
              <span>Admins</span>
              <strong>{adminUsers}</strong>
            </div>
          </div>
        </div>

        <div className="card users-table-card">
          {loading ? (
            <div className="users-loading">
              <div className="loading-spinner" />
              <span>Carregando usuários...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="users-empty">
              <h3>Nenhum usuário encontrado</h3>
              <p>Tente ajustar os filtros ou o termo de busca.</p>
            </div>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>Usuário</th>
                  <th>Perfil</th>
                  <th>Unidade</th>
                  <th>Status</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="user-cell">
                        <div className="user-avatar">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`pill pill-${u.role}`}>
                        {ROLE_LABELS[u.role] || u.role}
                      </span>
                    </td>
                    <td>
                      {allUpas.find((upa) => upa.id === u.upa_id)?.name || '---'}
                    </td>
                    <td>
                      <span className={`pill status-${u.status}`}>
                        {STATUS_LABELS[u.status] || u.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-secondary btn-sm">Editar</button>
                        <button className="btn btn-secondary btn-sm">Detalhes</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default UsersManagementPage;

