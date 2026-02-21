import { useState, useMemo } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useGetListings } from '../api/listings';
import { ListingCard } from '../features/listings/components/ListingCard';
import { ROUTES } from '../app/routes';
import { useOptimisticToggleSave } from '../features/listings/hooks/useOptimisticToggleSave';
import { SearchFiltersBar } from '../features/search/components/SearchFiltersBar';
import { CategoryNavigation } from '../features/search/components/CategoryNavigation';
import { FilterSidebar } from '../features/listings/components/FilterSidebar';
import { ActiveFilterBadges } from '../features/listings/components/ActiveFilterBadges';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ProductCondition, type Listing } from '../backend';
import { applySorting, type SortOption } from '../features/listings/filters/sortOptions';

interface ListingFilters {
  categories: string[];
  conditions: ProductCondition[];
  priceMin?: number;
  priceMax?: number;
  campusLocations: {
    dorms: string[];
    buildings: string[];
    zones: string[];
  };
}

export default function SearchPage() {
  const navigate = useNavigate();
  const searchParams = useSearch({ from: '/protected/search' }) as { q?: string; category?: string };
  const [searchQuery, setSearchQuery] = useState(searchParams.q || '');
  const [sort, setSort] = useState<SortOption>('relevance');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { data: allListings, isLoading } = useGetListings();

  const [filters, setFilters] = useState<ListingFilters>({
    categories: [],
    conditions: [],
    campusLocations: {
      dorms: [],
      buildings: [],
      zones: [],
    },
  });

  const filteredListings = useMemo(() => {
    if (!allListings) return [];

    let results = [...allListings];

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (listing) =>
          listing.title.toLowerCase().includes(query) ||
          listing.description.toLowerCase().includes(query) ||
          listing.category.toLowerCase().includes(query)
      );
    }

    // Apply category filters
    if (filters.categories.length > 0) {
      results = results.filter((listing) =>
        filters.categories.includes(listing.category)
      );
    }

    // Apply price range
    if (filters.priceMin !== undefined) {
      results = results.filter((listing) => listing.price >= filters.priceMin!);
    }
    if (filters.priceMax !== undefined) {
      results = results.filter((listing) => listing.price <= filters.priceMax!);
    }

    // Apply condition filters
    if (filters.conditions.length > 0) {
      results = results.filter((listing) =>
        filters.conditions.includes(listing.condition)
      );
    }

    // Apply campus location filters
    const allLocations = [
      ...filters.campusLocations.dorms,
      ...filters.campusLocations.buildings,
      ...filters.campusLocations.zones,
    ];
    if (allLocations.length > 0) {
      results = results.filter((listing) =>
        allLocations.some((loc) => listing.hostel.includes(loc) || listing.campus.includes(loc))
      );
    }

    // Apply sorting
    return applySorting(results, sort, searchQuery);
  }, [allListings, searchQuery, filters, sort]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: ROUTES.search, search: { q: searchQuery }, replace: true });
  };

  const handleCategorySelect = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  };

  const toggleCondition = (condition: ProductCondition) => {
    setFilters(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const toggleLocation = (type: keyof ListingFilters['campusLocations'], location: string) => {
    setFilters(prev => ({
      ...prev,
      campusLocations: {
        ...prev.campusLocations,
        [type]: prev.campusLocations[type].includes(location)
          ? prev.campusLocations[type].filter(l => l !== location)
          : [...prev.campusLocations[type], location],
      },
    }));
  };

  const handlePriceChange = (min?: number, max?: number) => {
    setFilters(prev => ({
      ...prev,
      priceMin: min,
      priceMax: max,
    }));
  };

  const resetFilters = () => {
    setFilters({
      categories: [],
      conditions: [],
      campusLocations: {
        dorms: [],
        buildings: [],
        zones: [],
      },
    });
  };

  const activeFilterLabels = useMemo(() => {
    const labels: string[] = [];
    if (filters.categories.length > 0) {
      labels.push(...filters.categories);
    }
    if (filters.conditions.length > 0) {
      labels.push(...filters.conditions.map((c) => c.replace(/([A-Z])/g, ' $1').trim()));
    }
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      labels.push(
        `₹${filters.priceMin || 0} - ₹${filters.priceMax || '∞'}`
      );
    }
    return labels;
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Search Header */}
      <div className="mb-6 space-y-4">
        <h1 className="text-3xl font-bold">Search</h1>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </form>
      </div>

      {/* Category Navigation */}
      <div className="mb-6">
        <CategoryNavigation
          activeCategory={filters.categories[0]}
          onCategorySelect={handleCategorySelect}
        />
      </div>

      {/* Filters Bar */}
      <div className="mb-6">
        <SearchFiltersBar
          sort={sort}
          onSortChange={(value) => setSort(value as SortOption)}
          activeFilters={activeFilterLabels}
          onClearFilters={resetFilters}
          onOpenFilters={() => setMobileFiltersOpen(true)}
        />
      </div>

      {/* Active Filter Badges */}
      {(filters.categories.length > 0 || filters.conditions.length > 0 || filters.priceMin !== undefined || filters.priceMax !== undefined) && (
        <div className="mb-6">
          <ActiveFilterBadges
            filters={filters}
            onRemoveCategory={toggleCategory}
            onRemoveCondition={toggleCondition}
            onRemoveLocation={toggleLocation}
            onClearPrice={() => handlePriceChange(undefined, undefined)}
            onClearAll={resetFilters}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <FilterSidebar
            filters={filters}
            onToggleCategory={toggleCategory}
            onToggleCondition={toggleCondition}
            onToggleLocation={toggleLocation}
            onPriceChange={handlePriceChange}
            onReset={resetFilters}
          />
        </aside>

        {/* Results Grid */}
        <div className="flex-1">
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Searching...' : `${filteredListings.length} results found`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <ListingCard key={i} skeleton />
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No listings found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredListings.map((listing) => (
                <ListingCardWithSave key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <SheetContent side="left" className="w-full sm:w-96">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <FilterSidebar
              filters={filters}
              onToggleCategory={toggleCategory}
              onToggleCondition={toggleCondition}
              onToggleLocation={toggleLocation}
              onPriceChange={handlePriceChange}
              onReset={resetFilters}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
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
