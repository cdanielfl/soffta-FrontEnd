import { useState, useEffect } from 'react';
import { PlusCircle, Clock, CheckCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { useAuth } from '../../../features/auth/store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAccessibleUpas, hasPermission } from '../../../shared/utils/permissions';
import api from '../../../shared/lib/api';
import Navbar from '../../../shared/components/layout/Navbar';
import { useFeedback } from '../../../shared/context/FeedbackContext';
import '../../../styles/Reception.css';

const Reception = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Padrão');
  const [unidade, setUnidade] = useState('');
  const [lastAtendimento, setLastAtendimento] = useState(null);
  const [recentes, setRecentes] = useState([]);
  const [tipos] = useState(['Padrão', 'Prioritário', 'Urgência']);
  const [unidades, setUnidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { showToast } = useFeedback();

  useEffect(() => {
    console.log('User:', user); // Debug
    // Carregar UPAs que o usuário pode acessar
    const accessibleUpas = getAccessibleUpas(user);
    console.log('Accessible UPAs:', accessibleUpas); // Debug
    setUnidades(accessibleUpas.map(upa => upa.name));
    
    // Se usuário tem UPA específica, setar como padrão
    if (user?.upa_id) {
      const userUpa = accessibleUpas.find(upa => upa.id === user.upa_id || upa.slug === user.upa_id);
      console.log('User UPA:', userUpa); // Debug
      if (userUpa) {
        setUnidade(userUpa.name);
      }
    } else if (accessibleUpas.length > 0) {
      setUnidade(accessibleUpas[0].name);
    }
  }, [user]);

  const gerarAtendimento = async (e) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setLoading(true);
    setSuccessMessage('');

    try {
      // MODO DESENVOLVIMENTO - Simular cadastro
      const mockAtendimento = {
        id: Date.now(),
        nome_paciente: nome,
        tipo_atendimento: tipo,
        unidade: unidade,
        status: 'aguardando',
        hora_criacao: new Date().toISOString()
      };
      
      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setLastAtendimento(mockAtendimento);
      setRecentes(prev => [mockAtendimento, ...prev].slice(0, 5));
      setNome('');
      setSuccessMessage(`Paciente ${nome} cadastrado com sucesso!`);
      
      // Limpar mensagem após 3 segundos
      setTimeout(() => setSuccessMessage(''), 3000);
      
      /* COM BACKEND REAL:
      const res = await api.post('/atendimentos', {
        unidade,
        nome_paciente: nome,
        tipo_atendimento: tipo
      });
      setLastAtendimento(res.data);
      setRecentes(prev => [res.data, ...prev].slice(0, 5));
      setNome('');
      setSuccessMessage(`Paciente ${nome} cadastrado com sucesso!`);
      setTimeout(() => setSuccessMessage(''), 3000);
      */
    } catch (error) {
      console.error('Erro ao criar atendimento:', error);
      showToast({
        title: 'Erro ao cadastrar paciente',
        description: 'Tente novamente em instantes.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar title="Recepção" subtitle={`${unidade} - Cadastro de Pacientes`} />
      <div className="reception-container">
      <button onClick={() => navigate('/painel-controle')} className="back-button">
        <ArrowLeft size={20} />
        Voltar
      </button>
      <div className="reception-header">
        <div>
          <h1>Recepção - {unidade}</h1>
          <p>Cadastre o paciente para entrar na fila</p>
        </div>
        <div className="status-badge">Unidade Ativa</div>
      </div>

      <div className="card reception-card">
        <form onSubmit={gerarAtendimento} className="reception-form">
          <div className="form-section">
            {successMessage && (
              <div style={{
                padding: '1rem',
                background: '#d1fae5',
                color: '#065f46',
                borderRadius: '0.75rem',
                marginBottom: '1rem',
                fontWeight: '600',
                textAlign: 'center',
                border: '2px solid #10b981'
              }}>
                ✓ {successMessage}
              </div>
            )}
            
            <div className="form-group">
              <label>Nome do Paciente</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite o nome completo"
                className="input"
                required
              />
            </div>

            <div className="form-group">
              <label>Unidade</label>
              {hasPermission(user, 'canAccessAllUpas') ? (
                <div className="button-group">
                  {unidades.map(u => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setUnidade(u)}
                      className={`option-btn ${unidade === u ? 'active' : ''}`}
                    >
                      {u}
                      {unidade === u && <CheckCircle size={18} />}
                    </button>
                  ))}
                </div>
              ) : (
                <div style={{
                  padding: '1rem',
                  background: 'var(--bg-secondary)',
                  borderRadius: '0.75rem',
                  border: '2px solid var(--primary)',
                  fontWeight: '600',
                  color: 'var(--primary)',
                  textAlign: 'center'
                }}>
                  {unidade}
                </div>
              )}
            </div>

            <div className="form-group">
              <label>Tipo de Atendimento</label>
              <div className="button-group">
                {tipos.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className={`option-btn ${tipo === t ? 'active' : ''}`}
                  >
                    {t}
                    {tipo === t && <CheckCircle size={18} />}
                  </button>
                ))}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-large" disabled={loading || !nome.trim()}>
              {loading ? (
                <>
                  <div className="loading-spinner" style={{ borderTopColor: 'white' }} />
                  CADASTRANDO...
                </>
              ) : (
                <>
                  <PlusCircle size={24} />
                  CADASTRAR PACIENTE
                </>
              )}
            </button>
          </div>

          <div className="preview-section">
            <AnimatePresence mode="wait">
              {lastAtendimento ? (
                <motion.div
                  key={lastAtendimento.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="preview-content"
                >
                  <div className="preview-name">{lastAtendimento.nome_paciente}</div>
                  <div className={`preview-badge badge-${lastAtendimento.tipo_atendimento.toLowerCase()}`}>
                    {lastAtendimento.tipo_atendimento}
                  </div>
                  <div className="preview-label">Paciente Cadastrado</div>
                  <div className="preview-time">
                    {format(new Date(lastAtendimento.hora_criacao), 'HH:mm:ss')}
                  </div>
                </motion.div>
              ) : (
                <div className="preview-empty">
                  <PlusCircle size={64} className="preview-icon" />
                  <p>Aguardando cadastro...</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </form>
      </div>

      {recentes.length > 0 && (
        <div className="recentes-section">
          <h3>
            <Clock size={20} />
            Últimos Pacientes
          </h3>
          <div className="recentes-grid">
            {recentes.map((r, i) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={r.id}
                className="recente-card"
              >
                <div className="recente-info">
                  <div className="recente-name">{r.nome_paciente}</div>
                  <div className="recente-type">{r.tipo_atendimento}</div>
                </div>
                <div className="recente-time">
                  {format(new Date(r.hora_criacao), 'HH:mm')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Reception;

