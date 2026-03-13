import { useQueueStore } from '../store/queueStore';

export const useQueue = () => {
  const store = useQueueStore();
  return {
    queue: store.fila,
    addToQueue: store.addToQueue,
    callNext: store.callNext,
    updateStatus: store.updateStatus,
    historico: store.historico
  };
};