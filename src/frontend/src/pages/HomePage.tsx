import { memo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { PullToRefreshContainer } from '../app/interactions/pullToRefresh/PullToRefreshContainer';
import { DashboardQuickActions } from '../features/home/components/DashboardQuickActions';
import { DashboardStatsRow } from '../features/home/components/DashboardStatsRow';
import { SavedItemsStrip } from '../features/home/components/SavedItemsStrip';
import { MarqueeAnnouncements } from '../features/home/components/MarqueeAnnouncements';
import { TrendingSection } from '../features/discovery/components/TrendingSection';
import { RecommendedSection } from '../features/discovery/components/RecommendedSection';
import { PersonalizedListingsPreview } from '../features/home/components/PersonalizedListingsPreview';
import { DashboardWidgetsGrid } from '../features/home/components/DashboardWidgetsGrid';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../api/queries';

export default function HomePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.listings.list() });
  };

  return (
    <PullToRefreshContainer onRefresh={handleRefresh}>
      <div className="container mx-auto px-4 py-6 pb-24 space-y-8">
        {/* Dashboard Header */}
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Discover</h1>
          <p className="text-sm text-muted-foreground">Your campus marketplace</p>
        </header>

        {/* Stats Row */}
        <DashboardStatsRow />

        {/* Quick Actions */}
        <DashboardQuickActions />

        {/* Marquee Announcements */}
        <MarqueeAnnouncements />

        {/* Interactive Widgets Grid */}
        <DashboardWidgetsGrid />

        {/* Saved Items Strip */}
        <SavedItemsStrip />

        {/* Personalized Listings Preview */}
        <PersonalizedListingsPreview />

        {/* Trending Section */}
        <TrendingSection />

        {/* Recommended Section */}
        <RecommendedSection />
      </div>
    </PullToRefreshContainer>
  );
}
