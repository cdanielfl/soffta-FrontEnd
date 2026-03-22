import { useState } from 'react';
import { useQueueStore } from '../store/queueStore';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';

const CallPanel = () => {
  const [currentPatient, setCurrentPatient] = useState(null);
  const { fila, callNext, updateStatus } = useQueueStore();

  const handleCallNext = () => {
    if (fila.length > 0) {
      const next = fila[0];
      setCurrentPatient(next);
      callNext();
    }
  };

  const handleFinish = () => {
    if (currentPatient) {
      updateStatus(currentPatient.id, 'finalizado');
      setCurrentPatient(null);
    }
  };

  const handleCancel = () => {
    if (currentPatient) {
      updateStatus(currentPatient.id, 'cancelado');
      setCurrentPatient(null);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-bold mb-4">Painel de Chamada</h2>
      {currentPatient ? (
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold">Paciente Atual</h3>
            <p className="text-2xl font-bold">{currentPatient.name}</p>
            <p>Guichê: {currentPatient.guiche || 'N/A'}</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleFinish} className="flex-1 bg-green-500 hover:bg-green-600">
              Finalizar
            </Button>
            <Button onClick={handleCancel} variant="destructive" className="flex-1">
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">Nenhum paciente sendo atendido</p>
          <Button onClick={handleCallNext} disabled={fila.length === 0}>
            Chamar Próximo
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CallPanel;
