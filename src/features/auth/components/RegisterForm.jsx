import { useState } from 'react';
import { useAuth } from '../store/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../shared/components/ui/Button';
import { Input } from '../../../shared/components/ui/Input';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError('Senhas não coincidem');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/entrar');
    } catch (err) {
      setError('Erro no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        placeholder="Nome"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <Input
        name="password"
        type="password"
        placeholder="Senha"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <Input
        name="confirmPassword"
        type="password"
        placeholder="Confirmar Senha"
        value={formData.confirmPassword}
        onChange={handleChange}
        required
      />
      {error && <p className="text-red-500">{error}</p>}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Cadastrando...' : 'Cadastrar'}
      </Button>
    </form>
  );
};

export default RegisterForm;
