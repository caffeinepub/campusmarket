import { Card, CardContent } from '@/components/ui/card';
import { Heart, ShoppingCart, MessageSquare, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EngagementMetricsCardsProps {
  timeRange: string;
}

export function EngagementMetricsCards({ timeRange }: EngagementMetricsCardsProps) {
  // Generate mock engagement data
  const metrics = generateMockEngagementData(timeRange);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <MetricCard
        icon={Heart}
        label="Saves"
        value={metrics.saves}
        trend={metrics.savesTrend}
        iconColor="text-destructive"
        iconBg="bg-destructive/10"
      />
      <MetricCard
        icon={ShoppingCart}
        label="Cart Adds"
        value={metrics.cartAdds}
        trend={metrics.cartAddsTrend}
        iconColor="text-primary"
        iconBg="bg-primary/10"
      />
      <MetricCard
        icon={MessageSquare}
        label="Chat Initiations"
        value={metrics.chatInitiations}
        trend={metrics.chatInitiationsTrend}
        iconColor="text-accent"
        iconBg="bg-accent/10"
      />
    </div>
  );
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  trend: number;
  iconColor: string;
  iconBg: string;
}

function MetricCard({ icon: Icon, label, value, trend, iconColor, iconBg }: MetricCardProps) {
  const isPositive = trend >= 0;

  return (
    <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value.toLocaleString()}</p>
            <div className="flex items-center gap-1 text-xs">
              <TrendingUp
                className={cn(
                  'h-3 w-3',
                  isPositive ? 'text-success' : 'text-destructive rotate-180'
                )}
              />
              <span className={cn(isPositive ? 'text-success' : 'text-destructive')}>
                {isPositive ? '+' : ''}{trend}%
              </span>
              <span className="text-muted-foreground">vs last period</span>
            </div>
          </div>
          <div className={cn('rounded-full p-3', iconBg)}>
            <Icon className={cn('h-5 w-5', iconColor)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function generateMockEngagementData(timeRange: string) {
  const multiplier = parseInt(timeRange) / 7;
  
  return {
    saves: Math.floor((Math.random() * 100 + 50) * multiplier),
    savesTrend: Math.floor(Math.random() * 30) - 5,
    cartAdds: Math.floor((Math.random() * 80 + 40) * multiplier),
    cartAddsTrend: Math.floor(Math.random() * 25) - 3,
    chatInitiations: Math.floor((Math.random() * 60 + 30) * multiplier),
    chatInitiationsTrend: Math.floor(Math.random() * 20) - 2,
  };
}
