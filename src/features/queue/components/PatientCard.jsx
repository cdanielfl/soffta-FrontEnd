import { Card } from '../../../shared/components/ui/Card';
import { Badge } from '../../../shared/components/ui/Badge';

const PatientCard = ({ patient }) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold">{patient.name}</h3>
          <p className="text-sm text-gray-600">CPF: {patient.cpf}</p>
          <p className="text-sm text-gray-600">Telefone: {patient.phone}</p>
        </div>
        <Badge variant={patient.priority === 3 ? 'destructive' : patient.priority === 2 ? 'secondary' : 'default'}>
          {patient.priority === 3 ? 'Urgência' : patient.priority === 2 ? 'Prioritário' : 'Padrão'}
        </Badge>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Chegada: {new Date(patient.arrivalTime).toLocaleTimeString()}
      </div>
    </Card>
  );
};

export default PatientCard;