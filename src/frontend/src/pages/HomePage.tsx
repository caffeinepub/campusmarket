import { useGetListings } from '../api/listings';
import { ListingCard } from '../features/listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { useOptimisticToggleSave } from '../features/listings/hooks/useOptimisticToggleSave';
import { DashboardStatsRow } from '../features/home/components/DashboardStatsRow';
import { DashboardQuickActions } from '../features/home/components/DashboardQuickActions';
import { MarqueeAnnouncements } from '../features/home/components/MarqueeAnnouncements';
import { CategoryGridMobile } from '../features/search/components/CategoryGridMobile';
import { CategoryNavigation } from '../features/search/components/CategoryNavigation';
import { TrendingSection } from '../features/discovery/components/TrendingSection';
import { RecommendedSection } from '../features/discovery/components/RecommendedSection';
import { PersonalizedListingsPreview } from '../features/home/components/PersonalizedListingsPreview';
import { RecentlyViewedStrip } from '../features/discovery/components/RecentlyViewedStrip';
import { FeaturedSection } from '../features/discovery/components/FeaturedSection';
import { PullToRefreshContainer } from '../app/interactions/pullToRefresh/PullToRefreshContainer';
import type { Listing } from '../backend';

export default function HomePage() {
  const { data: listings, isLoading, refetch } = useGetListings();
  const navigate = useNavigate();

  const handleCategorySelect = (category: string) => {
    navigate({ to: ROUTES.search, search: { category } });
  };

  const handleRefresh = async () => {
    await refetch();
  };

  return (
    <PullToRefreshContainer onRefresh={handleRefresh}>
      <div className="container mx-auto px-4 py-6 pb-24 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Discover</h1>
          <p className="text-muted-foreground">Find great deals on campus</p>
        </div>

        {/* Stats Row */}
        <DashboardStatsRow />

        {/* Quick Actions */}
        <DashboardQuickActions />

        {/* Announcements */}
        <MarqueeAnnouncements />

        {/* Featured Listings */}
        <FeaturedSection />

        {/* Category Grid (Mobile) */}
        <div className="md:hidden">
          <CategoryGridMobile onCategorySelect={handleCategorySelect} />
        </div>

        {/* Category Navigation (Desktop) */}
        <div className="hidden md:block">
          <CategoryNavigation onCategorySelect={handleCategorySelect} />
        </div>

        {/* Personalized Listings Preview */}
        <PersonalizedListingsPreview />

        {/* Recently Viewed */}
        <RecentlyViewedStrip />

        {/* Trending Section */}
        <TrendingSection />

        {/* Recommended Section */}
        <RecommendedSection />

        {/* All Listings */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">All Listings</h2>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <ListingCard key={i} skeleton />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {listings?.map((listing) => (
                <ListingCardWithSave key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      </div>
    </PullToRefreshContainer>
  );
}

function ListingCardWithSave({ listing }: { listing: Listing }) {
  const navigate = useNavigate();
  const { isSaved, toggleSave, isLoading } = useOptimisticToggleSave(listing.id);

  return (
    <ListingCard
      listing={listing}
      isSaved={isSaved}
      isSaving={isLoading}
      onSave={toggleSave}
      onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
    />
  );
}
