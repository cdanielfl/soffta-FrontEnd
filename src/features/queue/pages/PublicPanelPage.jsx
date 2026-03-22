import { useState, useEffect } from 'react';
import { Bell, Clock, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTheme } from '../../../shared/context/ThemeContext';
import { useNavigate, useParams } from 'react-router-dom';
import { getUpaBySlug } from '../../../shared/constants/upas';
import '../../../styles/PublicPanel.css';

const PublicPanel = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { upaSlug } = useParams();

  // Try to resolve the UPA by slug, fallback if none
  const resolvedUpa = getUpaBySlug(upaSlug);
  const unidade = resolvedUpa ? resolvedUpa.name : 'Painel de Atendimento';

  const [historico, setHistorico] = useState([]);
  const [lastChamada, setLastChamada] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simular chamada (em produção, usar WebSocket)
  const simularChamada = () => {
    const novaChamada = {
      id: Date.now(),
      nome_paciente: 'João Silva',
      tipo_atendimento: 'Padrão',
      guiche: Math.floor(Math.random() * 5) + 1, // Random guiche for realism
      hora_chamada: new Date().toISOString(),
      unidade: unidade
    };

    setLastChamada(novaChamada);
    setHistorico(prev => [novaChamada, ...prev.filter(h => h.id !== novaChamada.id)].slice(0, 6));
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 5000);

    // Anunciar paciente
    if ('speechSynthesis' in window) {
      const msg = new SpeechSynthesisUtterance();
      msg.text = `Paciente ${novaChamada.nome_paciente}, dirigir-se ao guichê ${novaChamada.guiche}`;
      msg.lang = 'pt-BR';
      msg.rate = 0.85;
      window.speechSynthesis.speak(msg);
    }
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <div style={{ position: 'absolute', left: 0 }}>
          <button onClick={() => navigate('/painel-controle')} className="back-button">
            <ArrowLeft size={20} />
            Voltar
          </button>
        </div>
        <div className="panel-brand">
          <div className="panel-icon">
            <Bell size={32} />
          </div>
          <div>
            <h1>{unidade.toUpperCase()}</h1>
            <p>Painel de Chamada em Tempo Real</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme} 
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '0.75rem',
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s',
              color: 'var(--text-primary)'
            }}
            title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <div className="panel-time">
            <div className="time-display">{format(currentTime, 'HH:mm')}</div>
            <div className="date-display">
              {format(currentTime, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </div>
          </div>
        </div>
      </div>

      <div className="panel-content">
        <div className="main-display">
          <div className={`call-area ${isAnimating ? 'animating' : ''}`}>
            <AnimatePresence mode="wait">
              {lastChamada ? (
                <motion.div
                  key={lastChamada.id + (isAnimating ? 'anim' : 'static')}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.1, opacity: 0 }}
                  className="current-call"
                >
                  <div className={`call-type-badge badge-${lastChamada.tipo_atendimento.toLowerCase()}`}>
                    {lastChamada.tipo_atendimento}
                  </div>
                  <div className="call-name">{lastChamada.nome_paciente.toUpperCase()}</div>
                  <div className="call-guiche">
                    <div className="divider" />
                    <div className="guiche-number">GUICHÊ {lastChamada.guiche}</div>
                    <div className="divider" />
                  </div>
                </motion.div>
              ) : (
                <div className="waiting-call">
                  <Bell size={128} className="waiting-icon" />
                  <p>Aguardando Chamada</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="history-panel">
          <h3>
            <Clock size={24} />
            Últimas Chamadas
          </h3>
          <div className="history-list">
            {historico.slice(1).map((h, i) => (
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                key={h.id}
                className="history-item"
              >
                <div className="history-info">
                  <div className="history-name">{h.nome_paciente.toUpperCase()}</div>
                  <div className="history-type">{h.tipo_atendimento}</div>
                </div>
                <div className="history-details">
                  <div className="history-guiche">G{h.guiche}</div>
                  <div className="history-time">
                    {format(new Date(h.hora_chamada), 'HH:mm')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Botão para simular chamada (remover em produção) */}
      <button
        onClick={simularChamada}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '1rem 2rem',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        Simular Chamada
      </button>
    </div>
  );
};

export default PublicPanel;
