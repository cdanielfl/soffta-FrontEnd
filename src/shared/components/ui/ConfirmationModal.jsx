import { X } from 'lucide-react';

const ConfirmationModal = ({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel
}) => {
  if (!open) return null;

  return (
    <div className="confirmation-backdrop" role="dialog" aria-modal="true" onClick={onCancel}>
      <div className="confirmation-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="confirmation-close" aria-label="Fechar" onClick={onCancel}>
          <X size={16} />
        </button>
        <h3>{title}</h3>
        {description && <p>{description}</p>}
        <div className="confirmation-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button type="button" className="btn btn-primary" onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

