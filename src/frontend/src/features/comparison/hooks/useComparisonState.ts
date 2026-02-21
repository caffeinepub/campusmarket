import { useState, useEffect } from 'react';

const COMPARISON_STORAGE_KEY = 'comparison_listings';
const MAX_COMPARISON_ITEMS = 3;

export function useComparisonState() {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    try {
      const stored = sessionStorage.getItem(COMPARISON_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    sessionStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(selectedIds));
  }, [selectedIds]);

  const addListing = (listingId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(listingId)) return prev;
      if (prev.length >= MAX_COMPARISON_ITEMS) return prev;
      return [...prev, listingId];
    });
  };

  const removeListing = (listingId: string) => {
    setSelectedIds((prev) => prev.filter((id) => id !== listingId));
  };

  const toggleListing = (listingId: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(listingId)) {
        return prev.filter((id) => id !== listingId);
      }
      if (prev.length >= MAX_COMPARISON_ITEMS) {
        return prev;
      }
      return [...prev, listingId];
    });
  };

  const clearComparison = () => {
    setSelectedIds([]);
  };

  const isSelected = (listingId: string) => selectedIds.includes(listingId);
  const canAddMore = selectedIds.length < MAX_COMPARISON_ITEMS;
  const isCompareMode = selectedIds.length >= 2;

  return {
    selectedIds,
    addListing,
    removeListing,
    toggleListing,
    clearComparison,
    isSelected,
    canAddMore,
    isCompareMode,
    count: selectedIds.length,
  };
}
