import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        // MODO DESENVOLVIMENTO - Verifica se tem usuário mockado
        const mockUser = localStorage.getItem('user');
        if (mockUser && token.includes('mock-token')) {
          setUser(JSON.parse(mockUser));
          setIsAuthenticated(true);
          setLoading(false);
          return;
        }
        
        // Autenticação real com backend
        const userData = await authService.getMe();
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    // MODO DESENVOLVIMENTO
    if (!import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL.includes('localhost')) {
      // Simular diferentes tipos de usuários
      let mockUser;
      
      if (email.includes('super')) {
        mockUser = {
          id: '1',
          name: 'Super',
          email: email,
          role: 'super_admin',
          upa_id: null
        };
      } else if (email.includes('master') || email.includes('diretora')) {
        mockUser = {
          id: '2',
          name: 'Diretora',
          email: email,
          role: 'admin_master',
          upa_id: null
        };
      } else if (email.includes('admin')) {
        // Admin de UPA específica (extrair do email)
        let upaName = email.split('@')[0].split('-').slice(1).join('-') || 'jangurussu';
        // Normalizar nome da UPA
        if (upaName.includes('edson')) upaName = 'edson-queiroz';
        if (upaName.includes('queiroz')) upaName = 'edson-queiroz';
        
        mockUser = {
          id: '3',
          name: 'Admin',
          email: email,
          role: 'admin_upa',
          upa_id: upaName
        };
      } else if (email.includes('recepcao')) {
        let upaName = email.split('@')[0].split('-').slice(1).join('-') || 'jangurussu';
        // Normalizar nome da UPA
        if (upaName.includes('edson')) upaName = 'edson-queiroz';
        if (upaName.includes('queiroz')) upaName = 'edson-queiroz';
        
        mockUser = {
          id: '4',
          name: 'Recepcionista',
          email: email,
          role: 'recepcionista',
          upa_id: upaName
        };
      } else {
        // Atendente por padrão
        let upaName = email.split('@')[0].split('-').slice(1).join('-') || 'jangurussu';
        // Normalizar nome da UPA
        if (upaName.includes('edson')) upaName = 'edson-queiroz';
        if (upaName.includes('queiroz')) upaName = 'edson-queiroz';
        
        mockUser = {
          id: '5',
          name: 'Atendente',
          email: email,
          role: 'atendente',
          upa_id: upaName
        };
      }
      
      localStorage.setItem('accessToken', 'mock-token-' + Date.now());
      localStorage.setItem('refreshToken', 'mock-refresh-' + Date.now());
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthenticated(true);
      return { user: mockUser };
    }
    
    // Login real
    const data = await authService.login(email, password);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken && !refreshToken.includes('mock-refresh')) {
        await authService.logout();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
