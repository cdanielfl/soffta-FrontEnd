import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CustomizationContext = createContext();

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within CustomizationProvider');
  }
  return context;
};

// Configurações padrão
const defaultConfig = {
  logo: null,
  primaryColor: '#6366f1',
  secondaryColor: '#8b5cf6',
  accentColor: '#10b981'
};

export const CustomizationProvider = ({ children }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState(defaultConfig);

  useEffect(() => {
    loadCustomization();
  }, [user]);

  const loadCustomization = () => {
    if (!user?.upa_id) {
      setConfig(defaultConfig);
      return;
    }

    // Carregar configuração salva do localStorage
    const savedConfig = localStorage.getItem(`customization_${user.upa_id}`);
    if (savedConfig) {
      const parsed = JSON.parse(savedConfig);
      setConfig(parsed);
      applyCustomization(parsed);
    } else {
      setConfig(defaultConfig);
      applyCustomization(defaultConfig);
    }
  };

  const applyCustomization = (customConfig) => {
    // Aplicar cores CSS
    document.documentElement.style.setProperty('--primary', customConfig.primaryColor);
    document.documentElement.style.setProperty('--primary-dark', adjustColor(customConfig.primaryColor, -20));
    document.documentElement.style.setProperty('--secondary', customConfig.secondaryColor);
    document.documentElement.style.setProperty('--success', customConfig.accentColor);
  };

  const updateCustomization = (newConfig) => {
    const updatedConfig = { ...config, ...newConfig };
    setConfig(updatedConfig);
    applyCustomization(updatedConfig);

    // Salvar no localStorage
    if (user?.upa_id) {
      localStorage.setItem(`customization_${user.upa_id}`, JSON.stringify(updatedConfig));
    }
  };

  const resetCustomization = () => {
    setConfig(defaultConfig);
    applyCustomization(defaultConfig);
    if (user?.upa_id) {
      localStorage.removeItem(`customization_${user.upa_id}`);
    }
  };

  // Função auxiliar para ajustar cor
  const adjustColor = (color, amount) => {
    const clamp = (val) => Math.min(Math.max(val, 0), 255);
    const num = parseInt(color.replace('#', ''), 16);
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0x00FF) + amount);
    const b = clamp((num & 0x0000FF) + amount);
    return '#' + ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');
  };

  const value = {
    config,
    updateCustomization,
    resetCustomization,
    applyCustomization
  };

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  );
};

export default CustomizationContext;
