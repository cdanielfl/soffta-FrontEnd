export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const TOKEN_KEY = 'accessToken';
export const REFRESH_TOKEN_KEY = 'refreshToken';

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/entrar',
  REGISTER: '/cadastro',
  DASHBOARD: '/painel-controle',
  RECEPTION: '/recepcao',
  COUNTER: '/guiche',
  PANEL: '/painel',
  ADMIN: '/administrador',
  PROFILE: '/perfil',
  SETTINGS: '/configuracoes'
};

