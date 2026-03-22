import { Badge } from '../../../shared/components/ui/Badge';
import { CheckCircle, XCircle } from 'lucide-react';

const PermissionsList = ({ permissions }) => {
  const permissionLabels = {
    canAccessAllUpas: 'Acesso a todas as UPAs',
    canManageUsers: 'Gerenciar usuários',
    canManageUpas: 'Gerenciar UPAs',
    canViewDashboard: 'Ver dashboard',
    canAccessRecepcao: 'Acesso à recepção',
    canAccessGuiche: 'Acesso ao guichê',
    canAccessAdmin: 'Acesso administrativo',
    canAccessSuperAdmin: 'Super admin'
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Permissões</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Object.entries(permissions).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            {value ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : (
              <XCircle size={16} className="text-red-500" />
            )}
            <span className="text-sm">{permissionLabels[key] || key}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermissionsList;
