import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';
import '../styles/NotFoundPage.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <AlertCircle size={80} className="not-found-icon" />
        <h1>404</h1>
        <h2>Página não encontrada</h2>
        <p>A página que você está procurando não existe ou foi movida.</p>
        <Link to="/" className="btn btn-primary">
          <Home size={20} />
          Voltar para o início
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
