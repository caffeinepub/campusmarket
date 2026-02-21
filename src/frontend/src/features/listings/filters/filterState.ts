import { useState, useCallback } from 'react';
import { ProductCondition } from '../../../backend';

export interface LocationFilters {
  dorms: string[];
  buildings: string[];
  zones: string[];
}

export interface ListingFilters {
  categories: string[];
  priceMin?: number;
  priceMax?: number;
  conditions: ProductCondition[];
  campusLocations: LocationFilters;
}

export function useListingFilters() {
  const [filters, setFilters] = useState<ListingFilters>({
    categories: [],
    conditions: [],
    campusLocations: {
      dorms: [],
      buildings: [],
      zones: [],
    },
  });

  const updateFilter = useCallback(<K extends keyof ListingFilters>(
    key: K,
    value: ListingFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleCategory = useCallback((category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category],
    }));
  }, []);

  const toggleCondition = useCallback((condition: ProductCondition) => {
    setFilters(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition],
    }));
  }, []);

  const toggleLocation = useCallback((type: keyof LocationFilters, location: string) => {
    setFilters(prev => ({
      ...prev,
      campusLocations: {
        ...prev.campusLocations,
        [type]: prev.campusLocations[type].includes(location)
          ? prev.campusLocations[type].filter(l => l !== location)
          : [...prev.campusLocations[type], location],
      },
    }));
  }, []);

  const reset = useCallback(() => {
    setFilters({
      categories: [],
      conditions: [],
      campusLocations: {
        dorms: [],
        buildings: [],
        zones: [],
      },
    });
  }, []);

  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.conditions.length > 0 ||
    filters.priceMin !== undefined ||
    filters.priceMax !== undefined ||
    filters.campusLocations.dorms.length > 0 ||
    filters.campusLocations.buildings.length > 0 ||
    filters.campusLocations.zones.length > 0;

  return {
    filters,
    updateFilter,
    toggleCategory,
    toggleCondition,
    toggleLocation,
    reset,
    hasActiveFilters,
  };
}
