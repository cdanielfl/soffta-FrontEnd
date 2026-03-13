// Tocar arquivo de áudio da campainha
export const playHospitalBell = () => {
  const audio = new Audio('/hospital-bell.mp3');
  audio.volume = 0.7;
  audio.play().catch(err => console.error('Erro ao tocar campainha:', err));
  return audio;
};

// Melhorar qualidade da voz TTS
export const speakText = (text, onEnd) => {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech Synthesis não suportado');
    return;
  }

  // Cancelar qualquer fala anterior
  window.speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance();
  msg.text = text;
  msg.lang = 'pt-BR';
  msg.rate = 0.9;      // Velocidade natural
  msg.pitch = 1.0;     // Tom natural
  msg.volume = 1.0;    // Volume máximo
  
  // Tentar usar voz brasileira de qualidade
  const voices = window.speechSynthesis.getVoices();
  const ptBRVoice = voices.find(voice => 
    voice.lang === 'pt-BR' && voice.name.includes('Google')
  ) || voices.find(voice => voice.lang === 'pt-BR');
  
  if (ptBRVoice) {
    msg.voice = ptBRVoice;
  }

  if (onEnd) {
    msg.onend = onEnd;
  }

  window.speechSynthesis.speak(msg);
};

// Anunciar paciente com campainha + voz
export const announcePatient = (nomePaciente, guiche) => {
  // 1. Tocar campainha
  const audio = playHospitalBell();
  
  // 2. Aguardar campainha terminar e falar
  audio.onended = () => {
    const text = `Paciente ${nomePaciente}, dirigir-se ao guichê ${guiche}`;
    speakText(text);
  };
  
  // Fallback caso onended não funcione (aguardar 2 segundos)
  setTimeout(() => {
    if (!audio.ended) {
      const text = `Paciente ${nomePaciente}, dirigir-se ao guichê ${guiche}`;
      speakText(text);
    }
  }, 2000);
};
