import { mockListings } from './mockListings';
import type { Listing } from '../../../backend';

let inMemoryListings = [...mockListings];
let inMemorySavedListings: Set<string> = new Set();

export const mockListingsClient = {
  getListings: async (): Promise<Listing[]> => {
    return [...inMemoryListings];
  },

  searchListings: async (searchTerm: string): Promise<Listing[]> => {
    const term = searchTerm.toLowerCase();
    return inMemoryListings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(term) ||
        listing.description.toLowerCase().includes(term)
    );
  },

  getListing: async (id: string): Promise<Listing | null> => {
    return inMemoryListings.find((l) => l.id === id) || null;
  },

  addListing: async (listing: Listing): Promise<void> => {
    inMemoryListings.push(listing);
  },

  updateListing: async (id: string, updatedListing: Listing): Promise<void> => {
    const index = inMemoryListings.findIndex((l) => l.id === id);
    if (index !== -1) {
      inMemoryListings[index] = updatedListing;
    }
  },

  deleteListing: async (id: string): Promise<void> => {
    inMemoryListings = inMemoryListings.filter((l) => l.id !== id);
  },

  saveListing: async (id: string): Promise<void> => {
    inMemorySavedListings.add(id);
  },

  unsaveListing: async (id: string): Promise<void> => {
    inMemorySavedListings.delete(id);
  },

  getSavedListings: async (): Promise<Listing[]> => {
    return inMemoryListings.filter((l) => inMemorySavedListings.has(l.id));
  },

  getListingsBySeller: async (seller: string): Promise<Listing[]> => {
    return inMemoryListings.filter((l) => l.seller.toString() === seller);
  },
};
