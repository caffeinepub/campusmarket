import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useSearchListings, useGetListings } from '../api/listings';
import { ListingCard } from '../features/listings/components/ListingCard';
import { useNavigate } from '@tanstack/react-router';
import { ROUTES } from '../app/routes';
import { toast } from 'sonner';
import { useOptimisticToggleSave } from '../features/listings/hooks/useOptimisticToggleSave';
import { RecentSearchesPanel } from '../features/search/components/RecentSearchesPanel';
import { AutosuggestDropdown } from '../features/search/components/AutosuggestDropdown';
import { SearchFiltersBar } from '../features/search/components/SearchFiltersBar';
import { CategoryBrowseChips } from '../features/search/components/CategoryBrowseChips';
import { TrendingSection } from '../features/discovery/components/TrendingSection';
import { RecommendedSection } from '../features/discovery/components/RecommendedSection';
import { addRecentSearch } from '../store/persistence/recentSearches';
import { getAutosuggest } from '../features/search/autosuggest/getSuggestions';
import { applySearchFilters, type SearchFilters } from '../features/search/searchFiltering';
import type { Listing } from '../backend';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({ sort: 'relevance' });
  const navigate = useNavigate();

  const { data: searchResults, isLoading, error } = useSearchListings(debouncedTerm);
  const { data: allListings } = useGetListings();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
      if (searchTerm.trim()) {
        addRecentSearch(searchTerm.trim());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (error) {
      toast.error('Search failed', {
        description: 'Please try again',
      });
    }
  }, [error]);

  const suggestions = searchTerm.length > 0 ? getAutosuggest(searchTerm, allListings || []) : [];

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setDebouncedTerm(suggestion);
    addRecentSearch(suggestion);
    setIsFocused(false);
  };

  const handleCategorySelect = (category: string) => {
    setFilters({ ...filters, category });
    // If no search term, show all listings filtered by category
    if (!searchTerm) {
      setDebouncedTerm(' '); // Trigger search with space to get all listings
    }
  };

  const showResults = debouncedTerm.length > 0;
  const showSuggestions = isFocused && searchTerm.length > 0 && suggestions.length > 0;
  const showEmptyState = !showResults;

  // Apply filters to search results or all listings when browsing by category
  const baseResults = searchResults || (filters.category ? allListings : []);
  const filteredResults = baseResults ? applySearchFilters(baseResults, filters) : [];

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Search Input */}
      <div className="relative mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            className="pl-12 pr-12 h-12 text-base rounded-xl border-border/50 bg-muted/30 focus:bg-background motion-safe:transition-all"
            autoFocus
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Autosuggest Dropdown */}
        <AutosuggestDropdown
          suggestions={suggestions}
          onSelect={handleSuggestionSelect}
          isOpen={showSuggestions}
          onClose={() => setIsFocused(false)}
        />
      </div>

      {/* Empty State: Discovery Sections */}
      {showEmptyState && (
        <div className="space-y-8">
          {/* Category Browse */}
          <CategoryBrowseChips onCategorySelect={handleCategorySelect} />

          {/* Trending Section */}
          <TrendingSection />

          {/* Recommended Section */}
          <RecommendedSection />

          {/* Recent Searches */}
          <RecentSearchesPanel onSelectSearch={setSearchTerm} />
        </div>
      )}

      {/* Search Results */}
      {showResults && (
        <div>
          {/* Filters Bar */}
          <SearchFiltersBar filters={filters} onFiltersChange={setFilters} />

          <h2 className="mb-6 text-lg font-semibold">
            {filteredResults && filteredResults.length > 0
              ? `${filteredResults.length} result${filteredResults.length === 1 ? '' : 's'}${debouncedTerm.trim() ? ` for "${debouncedTerm}"` : ''}`
              : `No results${debouncedTerm.trim() ? ` for "${debouncedTerm}"` : ''}`}
          </h2>

          {filteredResults && filteredResults.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {filteredResults.map((listing, index) => (
                <ListingCardWithSave
                  key={listing.id}
                  listing={listing}
                  index={index}
                  onClick={() => navigate({ to: ROUTES.listing(listing.id) })}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground">Try searching for something else or adjust your filters</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ListingCardWithSave({
  listing,
  index,
  onClick,
}: {
  listing: Listing;
  index: number;
  onClick: () => void;
}) {
  const { isSaved, toggleSave, isLoading } = useOptimisticToggleSave(listing.id);

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
    >
      <ListingCard
        listing={listing}
        onClick={onClick}
        onSave={toggleSave}
        isSaved={isSaved}
        isSaving={isLoading}
      />
    </div>
  );
}
