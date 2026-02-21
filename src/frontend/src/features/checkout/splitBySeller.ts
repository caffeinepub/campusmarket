import type { Listing } from '../../backend';
import type { Principal } from '@dfinity/principal';

export interface SellerGroup {
  seller: Principal;
  listings: Listing[];
  subtotal: number;
}

export interface CheckoutSplit {
  sellerGroups: SellerGroup[];
  grandTotal: number;
}

/**
 * Groups cart listings by seller and computes per-seller subtotals.
 * This is the extension point for future payment routing/splitting.
 */
export function groupCartBySeller(cartListings: Listing[]): CheckoutSplit {
  const sellerMap = new Map<string, SellerGroup>();

  for (const listing of cartListings) {
    const sellerKey = listing.seller.toString();
    
    if (!sellerMap.has(sellerKey)) {
      sellerMap.set(sellerKey, {
        seller: listing.seller,
        listings: [],
        subtotal: 0,
      });
    }

    const group = sellerMap.get(sellerKey)!;
    group.listings.push(listing);
    group.subtotal += listing.price;
  }

  const sellerGroups = Array.from(sellerMap.values());
  const grandTotal = sellerGroups.reduce((sum, group) => sum + group.subtotal, 0);

  return { sellerGroups, grandTotal };
}

/**
 * Extension point for payment routing.
 * When payment integration is added, this function will handle
 * splitting payments to multiple sellers.
 */
export interface PaymentRoute {
  seller: Principal;
  amount: number;
  // Future: add payment method, transaction ID, etc.
}

export function computePaymentRoutes(split: CheckoutSplit): PaymentRoute[] {
  return split.sellerGroups.map(group => ({
    seller: group.seller,
    amount: group.subtotal,
  }));
}
