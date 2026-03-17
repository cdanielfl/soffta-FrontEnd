import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import ToastStack from '../components/ui/ToastStack';
import ConfirmationModal from '../components/ui/ConfirmationModal';

const FeedbackContext = createContext({
  showToast: () => {},
  requestConfirmation: () => Promise.resolve(false)
});

export const useFeedback = () => useContext(FeedbackContext);

export const FeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmation, setConfirmation] = useState(null);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ title, description, type = 'info', duration = 4000 }) => {
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
      setToasts((prev) => [...prev, { id, title, description, type }]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const requestConfirmation = useCallback(
    ({ title, description, confirmLabel = 'Confirmar', cancelLabel = 'Cancelar' }) =>
      new Promise((resolve) => {
        setConfirmation({
          title,
          description,
          confirmLabel,
          cancelLabel,
          resolve
        });
      }),
    []
  );

  const handleConfirm = useCallback(() => {
    if (!confirmation) return;
    confirmation.resolve(true);
    setConfirmation(null);
  }, [confirmation]);

  const handleCancel = useCallback(() => {
    if (!confirmation) return;
    confirmation.resolve(false);
    setConfirmation(null);
  }, [confirmation]);

  const value = useMemo(
    () => ({
      showToast,
      requestConfirmation
    }),
    [showToast, requestConfirmation]
  );

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onRemove={removeToast} />
      <ConfirmationModal
        open={Boolean(confirmation)}
        title={confirmation?.title}
        description={confirmation?.description}
        confirmLabel={confirmation?.confirmLabel}
        cancelLabel={confirmation?.cancelLabel}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </FeedbackContext.Provider>
  );
};
