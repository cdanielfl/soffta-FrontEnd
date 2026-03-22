import { Card } from '../../../shared/components/ui/Card';

const StatsCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
          {trend && (
            <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% vs ontem
            </p>
          )}
        </div>
        {Icon && <Icon size={24} className="text-gray-400" />}
      </div>
    </Card>
  );
};

export default StatsCard;
