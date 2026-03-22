/**
 * Formata data para formato brasileiro
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('pt-BR');
};

/**
 * Formata data e hora para formato brasileiro
 */
export const formatDateTime = (date) => {
  return new Date(date).toLocaleString('pt-BR');
};

/**
 * Valida email
 */
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Trunca texto com reticências
 */
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Formata moeda para Real brasileiro
 */
export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Gera cor aleatória
 */
export const randomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

/**
 * Capitaliza primeira letra
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

