import { useState, useEffect } from 'react';
import { getCartItems, addToCart, removeFromCart, clearCart, isInCart } from '../../../store/persistence/cart';

export function useCart() {
  const [cartItems, setCartItems] = useState(getCartItems());

  const refreshCart = () => {
    setCartItems(getCartItems());
  };

  useEffect(() => {
    refreshCart();

    // Listen for storage events to sync across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key?.includes('cart')) {
        refreshCart();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const add = (listingId: string) => {
    addToCart(listingId);
    refreshCart();
  };

  const remove = (listingId: string) => {
    removeFromCart(listingId);
    refreshCart();
  };

  const clear = () => {
    clearCart();
    refreshCart();
  };

  const isItemInCart = (listingId: string) => {
    return isInCart(listingId);
  };

  return {
    cartItems,
    cartCount: cartItems.length,
    add,
    remove,
    clear,
    isInCart: isItemInCart,
  };
}
