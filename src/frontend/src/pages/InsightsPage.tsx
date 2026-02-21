import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetInsightsAnalytics } from '../api/insights';
import { TrendingUp, Package, DollarSign, Activity } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

type TimeRange = '7' | '30' | '90';

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const { data: analytics, isLoading } = useGetInsightsAnalytics(timeRange);

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Marketplace Insights</h1>
          <p className="text-sm text-muted-foreground">Analytics and trends for your campus marketplace</p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Time Range:</span>
          <Select value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Analytics Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Most Popular Category */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-primary" />
                Most Popular Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.mostPopularCategory ? (
                <div>
                  <p className="text-2xl font-bold">{analytics.mostPopularCategory}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Most viewed in the past {timeRange} days
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Most Traded Category */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-5 w-5 text-primary" />
                Most Traded Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.mostTradedCategory ? (
                <div>
                  <p className="text-2xl font-bold">{analytics.mostTradedCategory.category}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {Number(analytics.mostTradedCategory.sales)} sales
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Top Items */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Activity className="h-5 w-5 text-primary" />
                Top Selling Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analytics?.mostTradedCategory?.topItems && analytics.mostTradedCategory.topItems.length > 0 ? (
                <div className="space-y-2">
                  {analytics.mostTradedCategory.topItems.map(([name, count], idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="truncate">{name}</span>
                      <span className="font-semibold">{Number(count)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No data available</p>
              )}
            </CardContent>
          </Card>

          {/* Placeholder for future metrics */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <DollarSign className="h-5 w-5 text-primary" />
                Average Price Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Coming soon</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Empty State Message */}
      {!isLoading && !analytics?.mostPopularCategory && !analytics?.mostTradedCategory && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold mb-2">No insights available yet</p>
            <p className="text-sm text-muted-foreground">
              Analytics will appear as marketplace activity grows
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
