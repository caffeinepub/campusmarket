import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGetInsightsAnalytics } from '../api/insights';
import { TrendingUp, Package, Activity, Download, Eye, Heart, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { TimeRangeSelector } from '../features/analytics/components/TimeRangeSelector';
import { SalesTrendsChart } from '../features/analytics/components/SalesTrendsChart';
import { ViewCountsChart } from '../features/analytics/components/ViewCountsChart';
import { EngagementMetricsCards } from '../features/analytics/components/EngagementMetricsCards';
import { exportAnalyticsToCSV } from '../features/analytics/export/exportToCSV';
import { toast } from 'sonner';

type TimeRange = '7' | '30' | '90';

export default function InsightsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('30');
  const { data: analytics, isLoading } = useGetInsightsAnalytics(timeRange);

  const handleExportCSV = () => {
    if (!analytics) {
      toast.error('No data to export');
      return;
    }
    try {
      exportAnalyticsToCSV(analytics, timeRange);
      toast.success('Analytics exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 pb-24 space-y-6">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Marketplace Insights</h1>
            <p className="text-sm text-muted-foreground">Analytics and trends for your campus marketplace</p>
          </div>
          <Button onClick={handleExportCSV} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Time Range Selector */}
        <TimeRangeSelector value={timeRange} onChange={setTimeRange} />
      </header>

      {/* Engagement Metrics */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EngagementMetricsCards timeRange={timeRange} />
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales Trends Chart */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              Sales Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <SalesTrendsChart timeRange={timeRange} />
            )}
          </CardContent>
        </Card>

        {/* View Counts Chart */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Eye className="h-5 w-5 text-primary" />
              View Counts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ViewCountsChart timeRange={timeRange} />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Category Analytics */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
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
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>
      )}

      {/* Top Items */}
      {analytics?.mostTradedCategory?.topItems && analytics.mostTradedCategory.topItems.length > 0 && (
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-primary" />
              Top Selling Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analytics.mostTradedCategory.topItems.map(([name, count], idx) => (
                <div key={idx} className="flex justify-between text-sm py-2 border-b border-border/30 last:border-0">
                  <span className="truncate font-medium">{name}</span>
                  <span className="font-semibold text-primary">{Number(count)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
