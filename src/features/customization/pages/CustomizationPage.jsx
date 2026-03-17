import { useState } from 'react';
import { Palette, Image, Save, RotateCcw, ArrowLeft } from 'lucide-react';
import { useCustomization } from '../store/CustomizationContext';
import { useAuth } from '../../../features/auth/store/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../shared/components/layout/Navbar';
import { useFeedback } from '../../../shared/context/FeedbackContext';
import '../../../styles/Customization.css';

const Customization = () => {
  const { config, updateCustomization, resetCustomization } = useCustomization();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tempConfig, setTempConfig] = useState(config);
  const [logoPreview, setLogoPreview] = useState(config.logo);
  const { showToast, requestConfirmation } = useFeedback();

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setTempConfig({ ...tempConfig, logo: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (colorType, value) => {
    setTempConfig({ ...tempConfig, [colorType]: value });
  };

  const handleSave = () => {
    updateCustomization(tempConfig);
    showToast({
      title: 'Personalização salva',
      description: 'As alterações foram aplicadas.',
      type: 'success'
    });
  };

  const handleReset = async () => {
    const confirmed = await requestConfirmation({
      title: 'Restaurar configurações',
      description: 'Deseja voltar para os valores padrão de personalização?',
      confirmLabel: 'Restaurar',
      cancelLabel: 'Cancelar'
    });

    if (!confirmed) return;

    resetCustomization();
    setTempConfig({
      logo: null,
      primaryColor: '#6366f1',
      secondaryColor: '#8b5cf6',
      accentColor: '#10b981'
    });
    setLogoPreview(null);

    showToast({
      title: 'Configurações restauradas',
      description: 'Os valores padrão foram aplicados.',
      type: 'info'
    });
  };

  return (
    <>
      <Navbar title="Personalização" subtitle="Configure a identidade visual da sua UPA" />
      <div className="customization-container">
        <button onClick={() => navigate('/painel-controle')} className="back-button">
          <ArrowLeft size={20} />
          Voltar
        </button>
        <div className="customization-header">
          <h1>Personalização White Label</h1>
          <p>Customize a aparência do sistema com a identidade da sua unidade</p>
        </div>

        <div className="customization-sections">
          {/* Logo */}
          <div className="card customization-section">
            <h2>
              <Image size={20} />
              Logo da Unidade
            </h2>
            <div className="logo-upload-area">
              <div className="logo-preview">
                {logoPreview ? (
                  <img src={logoPreview} alt="Logo" />
                ) : (
                  <div className="logo-placeholder">
                    <Image size={48} style={{ opacity: 0.3 }} />
                    <p>Nenhuma logo carregada</p>
                  </div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                style={{ display: 'none' }}
                id="logo-upload"
              />
              <label htmlFor="logo-upload" className="btn btn-primary">
                <Image size={18} />
                Carregar Logo
              </label>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Formatos aceitos: PNG, JPG, SVG (máx. 2MB)
              </p>
            </div>
          </div>

          {/* Cores */}
          <div className="card customization-section">
            <h2>
              <Palette size={20} />
              Paleta de Cores
            </h2>
            <div className="color-grid">
              <div className="color-item">
                <label className="color-label">Cor Primária</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={tempConfig.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={tempConfig.primaryColor}
                    onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                    className="color-text-input"
                    placeholder="#6366f1"
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Usada em botões principais e destaques
                </p>
              </div>

              <div className="color-item">
                <label className="color-label">Cor Secundária</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={tempConfig.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={tempConfig.secondaryColor}
                    onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                    className="color-text-input"
                    placeholder="#8b5cf6"
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Usada em elementos secundários
                </p>
              </div>

              <div className="color-item">
                <label className="color-label">Cor de Destaque</label>
                <div className="color-input-wrapper">
                  <input
                    type="color"
                    value={tempConfig.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="color-picker"
                  />
                  <input
                    type="text"
                    value={tempConfig.accentColor}
                    onChange={(e) => handleColorChange('accentColor', e.target.value)}
                    className="color-text-input"
                    placeholder="#10b981"
                  />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Usada em mensagens de sucesso e confirmações
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="card customization-section">
            <div className="preview-section">
              <h3>Pré-visualização</h3>
              <div className="preview-buttons">
                <button 
                  className="btn btn-primary"
                  style={{ background: tempConfig.primaryColor, borderColor: tempConfig.primaryColor }}
                >
                  Botão Primário
                </button>
                <button 
                  className="btn btn-secondary"
                  style={{ background: tempConfig.secondaryColor, borderColor: tempConfig.secondaryColor, color: 'white' }}
                >
                  Botão Secundário
                </button>
                <button 
                  className="btn btn-success"
                  style={{ background: tempConfig.accentColor, borderColor: tempConfig.accentColor }}
                >
                  Botão de Sucesso
                </button>
              </div>
            </div>
          </div>

          {/* Ações */}
          <div className="actions-footer">
            <button onClick={handleReset} className="btn btn-secondary">
              <RotateCcw size={18} />
              Restaurar Padrão
            </button>
            <button onClick={handleSave} className="btn btn-primary">
              <Save size={18} />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Customization;
