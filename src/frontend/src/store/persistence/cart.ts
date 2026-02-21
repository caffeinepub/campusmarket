// Cart persistence with versioned localStorage
import { STORAGE_KEYS } from './storageKeys';

export interface CartItem {
  listingId: string;
  addedAt: number;
}

const MAX_CART_ITEMS = 50;

export function getCartItems(): CartItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return [];
    const items: CartItem[] = JSON.parse(data);
    return items.slice(0, MAX_CART_ITEMS);
  } catch (e) {
    console.error('Failed to get cart items:', e);
    return [];
  }
}

export function addToCart(listingId: string): void {
  try {
    const items = getCartItems();
    // Dedupe by listingId
    const filtered = items.filter(item => item.listingId !== listingId);
    const updated = [{ listingId, addedAt: Date.now() }, ...filtered].slice(0, MAX_CART_ITEMS);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to add to cart:', e);
  }
}

export function removeFromCart(listingId: string): void {
  try {
    const items = getCartItems();
    const filtered = items.filter(item => item.listingId !== listingId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(filtered));
  } catch (e) {
    console.error('Failed to remove from cart:', e);
  }
}

export function clearCart(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.CART);
  } catch (e) {
    console.error('Failed to clear cart:', e);
  }
}

export function isInCart(listingId: string): boolean {
  const items = getCartItems();
  return items.some(item => item.listingId === listingId);
}
