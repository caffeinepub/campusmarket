import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ViewCountsChartProps {
  timeRange: string;
}

interface ChartDataPoint {
  date: string;
  totalViews: number;
  uniqueVisitors: number;
}

export function ViewCountsChart({ timeRange }: ViewCountsChartProps) {
  // Generate mock data based on time range
  const data = generateMockViewData(timeRange);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'hsl(var(--card))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          iconType="circle"
        />
        <Bar dataKey="totalViews" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Total Views" />
        <Bar dataKey="uniqueVisitors" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Unique Visitors" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function generateMockViewData(timeRange: string): ChartDataPoint[] {
  const days = parseInt(timeRange);
  const data: ChartDataPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Generate realistic mock data
    const uniqueVisitors = Math.floor(Math.random() * 50) + 20;
    const totalViews = uniqueVisitors + Math.floor(Math.random() * 30);
    
    data.push({
      date: dateStr,
      totalViews,
      uniqueVisitors,
    });
  }

  return data;
}
