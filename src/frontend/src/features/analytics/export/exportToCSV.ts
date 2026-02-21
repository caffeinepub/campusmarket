import type { InsightsAnalytics } from '../../../backend';

export function exportAnalyticsToCSV(analytics: InsightsAnalytics, timeRange: string) {
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `analytics-${timestamp}.csv`;

  // Build CSV content
  const rows: string[] = [];
  
  // Header
  rows.push('Campus Marketplace Analytics Report');
  rows.push(`Time Range: Last ${timeRange} days`);
  rows.push(`Generated: ${new Date().toLocaleString()}`);
  rows.push('');

  // Most Popular Category
  rows.push('Most Popular Category');
  rows.push('Category');
  rows.push(analytics.mostPopularCategory || 'N/A');
  rows.push('');

  // Most Traded Category
  if (analytics.mostTradedCategory) {
    rows.push('Most Traded Category');
    rows.push('Category,Sales');
    rows.push(`${analytics.mostTradedCategory.category},${analytics.mostTradedCategory.sales}`);
    rows.push('');

    // Top Items
    if (analytics.mostTradedCategory.topItems && analytics.mostTradedCategory.topItems.length > 0) {
      rows.push('Top Selling Items');
      rows.push('Item Name,Sales Count');
      analytics.mostTradedCategory.topItems.forEach(([name, count]) => {
        rows.push(`"${name}",${count}`);
      });
      rows.push('');
    }
  }

  // Create CSV blob and download
  const csvContent = rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
