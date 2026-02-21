import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import type { Listing } from '../../../backend';
import { getHomeFilters, setHomeFilters as persistHomeFilters } from '../../../store/persistence/homeFilters';

export interface HomeFilters {
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sort: 'recent' | 'price-low' | 'price-high';
}

export function useHomeFeedFilters() {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Partial<HomeFilters>;
  
  // Initialize from URL or persisted state
  const [filters, setFiltersState] = useState<HomeFilters>(() => {
    if (searchParams.category || searchParams.sort) {
      return {
        category: searchParams.category,
        priceMin: searchParams.priceMin,
        priceMax: searchParams.priceMax,
        sort: searchParams.sort || 'recent',
      };
    }
    return getHomeFilters();
  });

  // Sync to URL and persistence
  const setFilters = (newFilters: HomeFilters) => {
    setFiltersState(newFilters);
    persistHomeFilters(newFilters);
    
    // Use replace to update URL without adding to history
    navigate({
      to: '.',
      search: {
        category: newFilters.category,
        priceMin: newFilters.priceMin,
        priceMax: newFilters.priceMax,
        sort: newFilters.sort !== 'recent' ? newFilters.sort : undefined,
      } as any,
      replace: true,
    });
  };

  const applyFiltersToListings = (listings: Listing[]): Listing[] => {
    let filtered = [...listings];

    if (filters.category) {
      filtered = filtered.filter((l) => l.category === filters.category);
    }

    if (filters.priceMin !== undefined) {
      filtered = filtered.filter((l) => l.price >= filters.priceMin!);
    }

    if (filters.priceMax !== undefined) {
      filtered = filtered.filter((l) => l.price <= filters.priceMax!);
    }

    if (filters.sort === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (filters.sort === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else {
      filtered.sort((a, b) => Number(b.created_at - a.created_at));
    }

    return filtered;
  };

  return { filters, setFilters, applyFiltersToListings };
}
