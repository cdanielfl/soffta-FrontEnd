import { useState, useEffect } from 'react';
import { Users, ArrowRight, CheckCircle, XCircle, Bell, Activity, ArrowLeft, CornerUpLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../../features/auth/store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAccessibleUpas } from '../../../shared/utils/permissions';
import { announcePatient } from '../../../shared/utils/audioUtils';
import api from '../../../shared/lib/api';
import Navbar from '../../../shared/components/layout/Navbar';
import { useFeedback } from '../../../shared/context/FeedbackContext';
import '../../../styles/Counter.css';

const MOCK_WAITING_LIST = [
  {
    id: 'fila-1',
    nome_paciente: 'Ana Souza',
    tipo_atendimento: 'Prioritário',
    tempo_espera: '02 min'
  },
  {
    id: 'fila-2',
    nome_paciente: 'Carlos Mendes',
    tipo_atendimento: 'Padrão',
    tempo_espera: '06 min'
  },
  {
    id: 'fila-3',
    nome_paciente: 'Larissa Gomes',
    tipo_atendimento: 'Urgência',
    tempo_espera: '01 min'
  },
  {
    id: 'fila-4',
    nome_paciente: 'Marcos Viana',
    tipo_atendimento: 'Padrão',
    tempo_espera: '08 min'
  },
  {
    id: 'fila-5',
    nome_paciente: 'Patrícia Lima',
    tipo_atendimento: 'Prioritário',
    tempo_espera: '04 min'
  }
];

const Counter = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [current, setCurrent] = useState(null);
  const [queueCount, setQueueCount] = useState(MOCK_WAITING_LIST.length);
  const [guicheId] = useState(1);
  const [unidade, setUnidade] = useState('');
  const [waitingList, setWaitingList] = useState(MOCK_WAITING_LIST);
  const [selectedPatient, setSelectedPatient] = useState(null);
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
      const fila = Array.isArray(response.data) ? response.data : [];
      const filaLength = fila.length > 0 ? fila.length : waitingList.length;
      setQueueCount(filaLength);
      if (fila.length) {
        setWaitingList(fila.slice(0, 5));
        setSelectedPatient(null);
      }
    } catch (error) {
      console.error('Erro ao atualizar fila:', error);
      setQueueCount(waitingList.length);
    }
  };
  const callSelectedPatient = () => {
    if (!selectedPatient) return null;

    const payload = {
      ...selectedPatient,
      guiche: guicheId,
      unidade
    };

    setWaitingList(prev => prev.filter(patient => patient.id !== selectedPatient.id));
    setSelectedPatient(null);
    setQueueCount(prev => Math.max(prev - 1, 0));
    setCurrent(payload);
    announcePatient(payload.nome_paciente, guicheId);
    showToast({
      title: 'Paciente escolhido chamado',
      description: `${payload.nome_paciente} deve se dirigir ao guichê ${guicheId}.`,
      type: 'info'
    });

    return payload;
  };

  const callMockPatient = () => {
    if (!waitingList.length) {
      showToast({
        title: 'Fila vazia',
        description: 'Não há pacientes na lista simulada no momento.',
        type: 'warning'
      });
      return null;
    }

    const [nextPatient, ...rest] = waitingList;
    setWaitingList(rest);
    setQueueCount(rest.length);
    setSelectedPatient(null);

    const payload = {
      ...nextPatient,
      guiche: guicheId,
      unidade
    };

    setCurrent(payload);
    announcePatient(payload.nome_paciente, guicheId);
    showToast({
      title: 'Paciente chamado',
      description: `${payload.nome_paciente} deve se dirigir ao guichê ${guicheId}.`,
      type: 'info'
    });

    return payload;
  };

  const chamarProxima = async () => {
    if (selectedPatient) {
      callSelectedPatient();
      return;
    }

    try {
      const response = await api.post('/atendimentos/chamar', {
        unidade,
        guiche: guicheId
      });
      setCurrent(response.data);
      updateQueue();
    } catch (error) {
      console.error('Erro ao chamar paciente:', error);
      showToast({
        title: 'Erro ao chamar paciente',
        description: 'Verifique a conexão e tente novamente.',
        type: 'error'
      });
      if (selectedPatient) {
        callSelectedPatient();
        return;
      }
      callMockPatient();
    }
  };

  const retornarParaFila = async () => {
    if (!current) {
      showToast({
        title: 'Nenhum paciente chamado',
        description: 'Chame um paciente antes de devolver para a fila.',
        type: 'warning'
      });
      return;
    }

    const payload = {
      ...current,
      status: 'aguardando',
      hora_criacao: new Date().toISOString()
    };

    try {
      await api.post(`/atendimentos/${current.id}/status`, { status: 'aguardando' });
    } catch (error) {
      console.error('Erro ao retornar paciente para fila:', error);
    }

    setQueueCount((prev) => Math.max(prev - 1, 0));
    showToast({
      title: 'Paciente voltou para a fila',
      description: `${payload.nome_paciente} foi colocado novamente na lista.`,
      type: 'info'
    });
    setCurrent(null);
    updateQueue();
  };

  const applyLocalStatus = (status) => {
    if (!current) return;
    const patientName = current.nome_paciente || 'Paciente';
    const statusLabel = status === 'finalizado' ? 'finalizado' : 'cancelado';

    showToast({
      title: status === 'finalizado' ? 'Atendimento finalizado' : 'Atendimento cancelado',
      description: `${patientName} foi ${statusLabel}.`,
      type: status === 'finalizado' ? 'success' : 'error'
    });

    setCurrent(null);
    setQueueCount((prev) => Math.max(prev - 1, 0));
    updateQueue();
  };

  const updateStatus = async (status) => {
    if (!current) return;

    try {
      await api.post(`/atendimentos/${current.id}/status`, { status });
      applyLocalStatus(status);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      applyLocalStatus(status);
    }
  };

  const repetirChamada = () => {
    if (!current) {
      showToast({
        title: 'Nenhum paciente em atendimento',
        description: 'Chame o próximo paciente antes de repetir a chamada.',
        type: 'warning'
      });
      return;
    }

    const guicheNumber = current.guiche ?? guicheId;
    announcePatient(current.nome_paciente, guicheNumber);
    showToast({
      title: 'Chamada repetida',
      description: `${current.nome_paciente} foi avisado novamente no guichê ${guicheNumber}.`,
      type: 'info'
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '—';
    const parsed = new Date(timestamp);
    if (Number.isNaN(parsed.getTime())) return '—';
    return parsed.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const renderWaitingTime = (item) => item.tempo_espera || formatTimestamp(item.hora_criacao);

  const toggleSelectPatient = (patient) => {
    setSelectedPatient((prev) => (prev?.id === patient.id ? null : patient));
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
              
              <button
                onClick={retornarParaFila}
                className="btn btn-return"
              >
                <CornerUpLeft size={18} />
                Voltar para fila
              </button>
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
          <div className="card waiting-list-card">
            <div className="waiting-header">
              <div>
                <div className="waiting-label">Lista de Espera Simulada</div>
                <div className="waiting-subtitle">
                  {waitingList.length} pacientes
                </div>
              </div>
              <span className="waiting-note">Visão rápida</span>
            </div>
            <div className="waiting-list">
              {waitingList.map((patient) => (
                <div
                  key={patient.id}
                  className={`waiting-item ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleSelectPatient(patient)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') toggleSelectPatient(patient);
                  }}
                >
                  <div>
                    <div className="waiting-name">{patient.nome_paciente}</div>
                    <div className="waiting-type">{patient.tipo_atendimento}</div>
                  </div>
                  <div className="waiting-time">{renderWaitingTime(patient)}</div>
                </div>
              ))}
            </div>
            <p className="waiting-hint">
              {selectedPatient
                ? `${selectedPatient.nome_paciente} selecionado. Clique em “Chamar Próximo Paciente” para confirmá-lo.`
                : 'Toque no nome para selecionar um paciente específico; botão “Chamar próximo” usará o primeiro da fila por padrão.'}
            </p>
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

