import { useState, useEffect } from 'react';
import { Users, CheckCircle, XCircle, Clock, Activity, ArrowLeft } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAccessibleUpas, hasPermission } from '../utils/permissions';
import api from '../services/api';
import Navbar from '../components/Navbar';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedUpa, setSelectedUpa] = useState(null);
  const [accessibleUpas, setAccessibleUpas] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    finalizados: 0,
    cancelados: 0,
    aguardando: 0,
    tempoMedioEspera: 0,
    tempoMedioAtendimento: 0,
    porUnidade: [],
    porHora: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar UPAs acessíveis
    const upas = getAccessibleUpas(user);
    setAccessibleUpas(upas);
    
    // Se usuário tem UPA específica, selecionar automaticamente
    if (user?.upa_id && upas.length > 0) {
      const userUpa = upas.find(upa => upa.id === user.upa_id);
      setSelectedUpa(userUpa || upas[0]);
    } else if (upas.length > 0) {
      setSelectedUpa(upas[0]);
    }
  }, [user]);

  useEffect(() => {
    if (selectedUpa) {
      fetchStats();
    }
  }, [selectedUpa]);

  const fetchStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      // Dados mockados para demonstração
      setStats({
        total: 156,
        finalizados: 98,
        cancelados: 12,
        aguardando: 46,
        tempoMedioEspera: 342,
        tempoMedioAtendimento: 480,
        porUnidade: [
          { unidade: 'UPA Centro', count: 65 },
          { unidade: 'UPA Norte', count: 48 },
          { unidade: 'UPA Sul', count: 43 }
        ],
        porHora: [
          { hora: '08h', count: 12 },
          { hora: '09h', count: 18 },
          { hora: '10h', count: 24 },
          { hora: '11h', count: 28 },
          { hora: '12h', count: 22 },
          { hora: '13h', count: 16 },
          { hora: '14h', count: 20 },
          { hora: '15h', count: 16 }
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'];

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <div className="loading-spinner" />
      </div>
    );
  }

  return (
    <>
      <Navbar title="Dashboard Administrativo" subtitle="Métricas e Estatísticas" />
      <div className="admin-container">
      <button onClick={() => navigate('/painel-controle')} className="back-button">
        <ArrowLeft size={20} />
        Voltar
      </button>
      <div className="admin-header">
        <div>
          <h1>Dashboard Administrativo</h1>
          <p>Métricas de desempenho e fluxo de atendimento</p>
          {selectedUpa && (
            <div style={{ marginTop: '0.5rem' }}>
              <span style={{ 
                background: 'var(--primary)', 
                color: 'white', 
                padding: '0.25rem 0.75rem', 
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '600'
              }}>
                {selectedUpa.name}
              </span>
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {hasPermission(user, 'canAccessAllUpas') && accessibleUpas.length > 1 && (
            <select 
              value={selectedUpa?.id || ''}
              onChange={(e) => {
                const upa = accessibleUpas.find(u => u.id === e.target.value);
                setSelectedUpa(upa);
              }}
              className="input"
              style={{ width: 'auto', minWidth: '200px' }}
            >
              {accessibleUpas.map(upa => (
                <option key={upa.id} value={upa.id}>{upa.name}</option>
              ))}
            </select>
          )}
          <button onClick={fetchStats} className="btn btn-secondary">
            <Activity size={18} />
            Atualizar Dados
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon indigo">
              <Users size={24} />
            </div>
            <span className="stat-label">Hoje</span>
          </div>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-description">Total Atendimentos</div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon emerald">
              <CheckCircle size={24} />
            </div>
            <span className="stat-label">Hoje</span>
          </div>
          <div className="stat-value">{stats.finalizados}</div>
          <div className="stat-description">Finalizados</div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon rose">
              <XCircle size={24} />
            </div>
            <span className="stat-label">Hoje</span>
          </div>
          <div className="stat-value">{stats.cancelados}</div>
          <div className="stat-description">Cancelados</div>
        </div>

        <div className="card stat-card">
          <div className="stat-header">
            <div className="stat-icon amber">
              <Clock size={24} />
            </div>
            <span className="stat-label">Agora</span>
          </div>
          <div className="stat-value">{stats.aguardando}</div>
          <div className="stat-description">Aguardando</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Eficiência de Atendimento */}
        <div className="card chart-card">
          <h3>Eficiência de Atendimento</h3>
          <div className="time-stats">
            <div className="time-stat">
              <div className="time-stat-label">Tempo Médio de Espera</div>
              <div className="time-stat-value">
                {Math.floor(stats.tempoMedioEspera / 60)}m {stats.tempoMedioEspera % 60}s
              </div>
            </div>
            <div className="time-stat">
              <div className="time-stat-label">Tempo Médio de Atendimento</div>
              <div className="time-stat-value emerald">
                {Math.floor(stats.tempoMedioAtendimento / 60)}m {stats.tempoMedioAtendimento % 60}s
              </div>
            </div>
          </div>

          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.porHora}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="hora" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12 }} 
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366f1"
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="chart-footer">Distribuição de atendimentos por hora do dia</p>
        </div>

        {/* Distribuição por Unidade */}
        <div className="card chart-card">
          <h3>Distribuição por Unidade</h3>
          <div className="distribution-grid">
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.porUnidade}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="unidade"
                  >
                    {stats.porUnidade.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="distribution-list">
              {stats.porUnidade.map((u, i) => (
                <div key={u.unidade} className="distribution-item">
                  <div className="distribution-info">
                    <div
                      className="distribution-dot"
                      style={{ backgroundColor: COLORS[i % COLORS.length] }}
                    />
                    <span className="distribution-name">{u.unidade}</span>
                  </div>
                  <span className="distribution-value">{u.count}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="guiche-section">
            <h4>Atendimentos por Guichê</h4>
            <div className="chart-wrapper" style={{ height: '200px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { name: 'Guichê 1', count: Math.round(stats.finalizados * 0.55) },
                    { name: 'Guichê 2', count: Math.round(stats.finalizados * 0.45) }
                  ]}
                >
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default AdminDashboard;
