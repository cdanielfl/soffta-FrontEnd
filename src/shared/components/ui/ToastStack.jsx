import { X } from 'lucide-react';

const toastTypeClasses = {
  success: 'toast-success',
  info: 'toast-info',
  warning: 'toast-warning',
  error: 'toast-error'
};

const ToastStack = ({ toasts, onRemove }) => {
  if (!toasts.length) return null;

  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toastTypeClasses[toast.type] || ''}`}>
          <div>
            <strong>{toast.title}</strong>
            {toast.description && <p>{toast.description}</p>}
          </div>
          <button
            type="button"
            className="toast-close"
            aria-label="Fechar notificação"
            onClick={() => onRemove(toast.id)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastStack;

