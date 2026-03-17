import { useState, useEffect } from 'react';
import { Users, ArrowRight, CheckCircle, XCircle, Bell, Activity, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../features/auth/store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAccessibleUpas } from '../../../shared/utils/permissions';
import api from '../../../shared/lib/api';
import Navbar from '../../../shared/components/layout/Navbar';
import { useFeedback } from '../../../shared/context/FeedbackContext';
import '../../../styles/Counter.css';

const Counter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);
  const [queueCount, setQueueCount] = useState(0);
  const [guicheId] = useState(1);
  const [unidade, setUnidade] = useState('');
  const { showToast } = useFeedback();

  useEffect(() => {
    // Definir unidade do usuário
    const accessibleUpas = getAccessibleUpas(user);
    if (user?.upa_id && accessibleUpas.length > 0) {
      const userUpa = accessibleUpas.find(upa => upa.id === user.upa_id);
      if (userUpa) {
        setUnidade(userUpa.name);
      }
    } else if (accessibleUpas.length > 0) {
      setUnidade(accessibleUpas[0].name);
    }
  }, [user]);

  useEffect(() => {
    if (unidade) {
      updateQueue();
      const interval = setInterval(updateQueue, 5000);
      return () => clearInterval(interval);
    }
  }, [unidade]);

  const updateQueue = async () => {
    try {
      const response = await api.get(`/atendimentos/${unidade}`);
      setQueueCount(response.data.length);
    } catch (error) {
      console.error('Erro ao atualizar fila:', error);
    }
  };

  const chamarProxima = async () => {
    try {
      const response = await api.post('/atendimentos/chamar', {
        unidade,
        guiche: guicheId
      });
      setCurrent(response.data);
      updateQueue();
    } catch (error) {
      showToast({
        title: 'Nenhum paciente na fila',
        description: 'Aguarde novos cadastros e tente novamente.',
        type: 'warning'
      });
    }
  };

  const updateStatus = async (status) => {
    if (!current) return;
    
    try {
      await api.post(`/atendimentos/${current.id}/status`, { status });
      setCurrent(null);
      updateQueue();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const repetirChamada = () => {
    if (current) {
      // Emitir evento de chamada novamente
      console.log('Repetindo chamada:', current);
    }
  };

  return (
    <>
      <Navbar title={`Guichê ${guicheId}`} subtitle={`${unidade} - Atendimento`} />
      <div className="counter-container">
      <button onClick={() => navigate('/painel-controle')} className="back-button">
        <ArrowLeft size={20} />
        Voltar
      </button>
      <div className="counter-header">
        <div className="counter-info">
          <div className="counter-badge">{guicheId}</div>
          <div>
            <h1>Guichê {guicheId}</h1>
            <p>{unidade}</p>
          </div>
        </div>
        <div className="status-online">
          <div className="status-dot" />
          Online
        </div>
      </div>

      <div className="counter-grid">
        <div className="card counter-main">
          {current ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="patient-display"
            >
              <div className={`patient-type-badge badge-${current.tipo_atendimento.toLowerCase()}`}>
                {current.tipo_atendimento}
              </div>
              <div className="patient-name">{current.nome_paciente}</div>
              
              <div className="action-buttons">
                <button
                  onClick={() => updateStatus('finalizado')}
                  className="btn btn-success"
                >
                  <CheckCircle size={20} />
                  Finalizar
                </button>
                <button
                  onClick={() => updateStatus('cancelado')}
                  className="btn btn-danger"
                >
                  <XCircle size={20} />
                  Cancelar
                </button>
              </div>
              
              <button onClick={repetirChamada} className="btn btn-secondary btn-repeat">
                <Bell size={18} />
                Repetir Chamada
              </button>
            </motion.div>
          ) : (
            <div className="waiting-state">
              <div className="waiting-icon">
                <Users size={48} />
              </div>
              <h3>Aguardando Chamada</h3>
              <p>Próximo da fila será chamado conforme prioridade</p>
              <button onClick={chamarProxima} className="btn btn-primary btn-call">
                <ArrowRight size={24} />
                CHAMAR PRÓXIMO PACIENTE
              </button>
            </div>
          )}
        </div>

        <div className="counter-sidebar">
          <div className="card queue-card">
            <div className="queue-label">Fila de Espera</div>
            <div className="queue-count">{queueCount}</div>
            <div className="queue-text">Pacientes aguardando</div>
          </div>

          <div className="card info-card">
            <h4>
              <Activity size={18} />
              Status da Unidade
            </h4>
            <div className="info-list">
              <div className="info-row">
                <span className="info-label">Unidade</span>
                <span className="info-value">{unidade}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Guichê</span>
                <span className="info-value">{guicheId}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Status</span>
                <span className="info-value" style={{ color: '#10b981' }}>Ativo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Counter;
