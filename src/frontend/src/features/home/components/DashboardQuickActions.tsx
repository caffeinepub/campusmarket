import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent } from '@/components/ui/card';
import { PlusCircle, Search, TrendingUp, BarChart3 } from 'lucide-react';
import { ROUTES } from '../../../app/routes';

const actions = [
  { id: 'sell', label: 'Sell Item', icon: PlusCircle, path: ROUTES.sell, color: 'text-accent' },
  { id: 'search', label: 'Search', icon: Search, path: ROUTES.search, color: 'text-primary' },
  { id: 'trending', label: 'Trending', icon: TrendingUp, path: ROUTES.search, color: 'text-warning' },
  { id: 'insights', label: 'Insights', icon: BarChart3, path: ROUTES.insights, color: 'text-success' },
];

export function DashboardQuickActions() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Card
            key={action.id}
            className="cursor-pointer border-border/40 bg-card shadow-xs motion-safe:transition-all motion-safe:hover:shadow-soft motion-safe:hover:-translate-y-0.5 active:scale-95 overflow-hidden"
            onClick={() => navigate({ to: action.path })}
          >
            <CardContent className="p-4 flex flex-col items-center gap-2">
              <div className={`p-3 rounded-xl bg-muted/50 ${action.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-2xs font-medium text-center leading-tight">{action.label}</span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
