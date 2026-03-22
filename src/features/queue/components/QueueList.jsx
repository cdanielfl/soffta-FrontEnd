import { useQueueStore } from '../store/queueStore';
import PatientCard from './PatientCard';

const QueueList = () => {
  const queue = useQueueStore((state) => state.fila);

  return (
    <div className="space-y-2">
      {queue.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum paciente na fila</p>
      ) : (
        queue.map((patient) => (
          <PatientCard key={patient.id} patient={patient} />
        ))
      )}
    </div>
  );
};

export default QueueList;
