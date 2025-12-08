import { useState, useCallback, useRef, useEffect } from 'react';

export interface CartItem {
  id: number;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
}

interface UseCartReturn {
  cart: Cart;
  isUpdating: boolean;
  updateCartItem: (productId: number, quantity: number) => Promise<boolean>;
  getItemQuantity: (productId: number) => number;
}

const EMPTY_CART: Cart = {
  items: [],
  totalPrice: 0,
  totalItems: 0,
};

/**
 * Dedicated cart management hook with optimistic updates and stale closure prevention.
 * 
 * Features:
 * - Optimistic UI updates: cart state changes immediately before API call
 * - Automatic rollback on API failure
 * - Functional state updates to prevent stale closures
 * - isUpdating flag for UI feedback
 * - useRef to avoid stale closure in getItemQuantity
 */
export function useCart(): UseCartReturn {
  const [cart, setCart] = useState<Cart>(EMPTY_CART);
  const [isUpdating, setIsUpdating] = useState(false);
  const cartRef = useRef<Cart>(cart);

  // Синхронизируем ref с актуальным состоянием
  useEffect(() => {
    cartRef.current = cart;
  }, [cart]);

  const getItemQuantity = useCallback((productId: number): number => {
    // Используем ref для доступа к актуальному состоянию корзины
    const item = cartRef.current.items.find(i => i.id === productId);
    return item?.quantity || 0;
  }, []);

  const updateCartItem = useCallback(async (productId: number, quantity: number): Promise<boolean> => {
    // Store previous cart state for rollback
    let previousCart: Cart | null = null;
    
    setIsUpdating(true);

    // Optimistic update using functional setState
    setCart(prev => {
      previousCart = prev; // Capture for rollback
      
      const existingItem = prev.items.find(i => i.id === productId);
      const currentQuantity = existingItem?.quantity || 0;
      const newQuantity = currentQuantity + quantity;

      let newItems: CartItem[];
      
      if (newQuantity <= 0) {
        // Remove item from cart
        newItems = prev.items.filter(i => i.id !== productId);
      } else if (existingItem) {
        // Update existing item
        newItems = prev.items.map(i =>
          i.id === productId ? { ...i, quantity: newQuantity } : i
        );
      } else {
        // Add new item
        newItems = [...prev.items, { id: productId, quantity: newQuantity }];
      }

      // Calculate new totals optimistically (approximate - server will provide exact values)
      const newTotalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        items: newItems,
        totalItems: newTotalItems,
        totalPrice: prev.totalPrice, // Will be updated from server response
      };
    });

    try {
      const response = await fetch('/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error(`Cart update failed: ${response.status}`);
      }

      const serverCart: Cart = await response.json();

      console.log('[useCart] Server response:', serverCart);

      // Update with accurate server data using functional update
      setCart(() => serverCart);
      
      return true;
    } catch (error) {
      console.error('Cart update error:', error);

      // Rollback to previous state using functional update
      if (previousCart) {
        setCart(previousCart);
      }

      return false;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    cart,
    isUpdating,
    updateCartItem,
    getItemQuantity,
  };
}
