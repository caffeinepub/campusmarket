import { MOCK_LISTINGS } from './mockListings';
import type { Listing } from '../../../backend';

// Reduced simulated latency for sub-300ms perceived performance
const SIMULATED_LATENCY = 100;

// In-memory state for mock mode
let mockListings: Listing[] = [...MOCK_LISTINGS];
let savedListingIds: Set<string> = new Set();

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockListingsClient = {
  async getListings(): Promise<Listing[]> {
    await delay(SIMULATED_LATENCY);
    return [...mockListings];
  },

  async getListing(listingId: string): Promise<Listing | null> {
    await delay(SIMULATED_LATENCY);
    return mockListings.find((listing) => listing.id === listingId) || null;
  },

  async searchListings(searchTerm: string): Promise<Listing[]> {
    await delay(SIMULATED_LATENCY);
    const term = searchTerm.toLowerCase();
    return mockListings.filter(
      (listing) =>
        listing.title.toLowerCase().includes(term) || listing.description.toLowerCase().includes(term)
    );
  },

  async getSavedListings(): Promise<Listing[]> {
    await delay(SIMULATED_LATENCY);
    return mockListings.filter((listing) => savedListingIds.has(listing.id));
  },

  async saveListing(listingId: string): Promise<void> {
    await delay(SIMULATED_LATENCY);
    savedListingIds.add(listingId);
  },

  async unsaveListing(listingId: string): Promise<void> {
    await delay(SIMULATED_LATENCY);
    savedListingIds.delete(listingId);
  },

  async addListing(listing: Listing): Promise<void> {
    await delay(SIMULATED_LATENCY);
    mockListings = [listing, ...mockListings];
  },

  async updateListing(listingId: string, updatedListing: Listing): Promise<void> {
    await delay(SIMULATED_LATENCY);
    const index = mockListings.findIndex(l => l.id === listingId);
    if (index !== -1) {
      mockListings[index] = updatedListing;
    }
  },

  async deleteListing(listingId: string): Promise<void> {
    await delay(SIMULATED_LATENCY);
    mockListings = mockListings.filter(l => l.id !== listingId);
    savedListingIds.delete(listingId);
  },
};
