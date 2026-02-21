import type { SellerGroup } from './splitBySeller';

interface CheckoutData {
  sellerGroups: SellerGroup[];
  grandTotal: number;
}

const CHECKOUT_DATA_KEY = 'checkout_data';

export function setCheckoutData(data: CheckoutData): void {
  try {
    sessionStorage.setItem(CHECKOUT_DATA_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to store checkout data:', e);
  }
}

export function getCheckoutData(): CheckoutData | null {
  try {
    const data = sessionStorage.getItem(CHECKOUT_DATA_KEY);
    if (!data) return null;
    return JSON.parse(data);
  } catch (e) {
    console.error('Failed to retrieve checkout data:', e);
    return null;
  }
}

export function clearCheckoutData(): void {
  try {
    sessionStorage.removeItem(CHECKOUT_DATA_KEY);
  } catch (e) {
    console.error('Failed to clear checkout data:', e);
  }
}
