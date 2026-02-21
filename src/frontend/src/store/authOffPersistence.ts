// Refactored to delegate to new persistence modules
import { getSavedListingsAuthOff, saveListingAuthOff, unsaveListingAuthOff, isListingSavedAuthOff } from './persistence/savedListingsAuthOff';
import { getRecentSearches, addRecentSearch, deleteRecentSearch, clearRecentSearches } from './persistence/recentSearches';

// Re-export for backward compatibility
export {
  getSavedListingsAuthOff as getSavedListingsLocal,
  saveListingAuthOff as saveListingLocal,
  unsaveListingAuthOff as unsaveListingLocal,
  isListingSavedAuthOff as isListingSavedLocal,
  getRecentSearches as getRecentSearchesLocal,
  addRecentSearch as addRecentSearchLocal,
  clearRecentSearches as clearRecentSearchesLocal,
};

// New export for per-item delete
export { deleteRecentSearch as deleteRecentSearchLocal };
