import { createContext, useCallback, useContext, useState } from "react";
import { Cart } from "../model/types";

interface CartContextType {
  cart: Cart | undefined;
  addToCart: (productId: number, quantity: number) => Promise<Cart | undefined>;
  isProductLoading: (productId: number) => boolean;
  getProductQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart>();
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());

  const addToCart = useCallback(async (productId: number, quantity: number) => {
    setLoadingItems(prev => new Set(prev).add(productId));

    try {
      const response = await fetch('/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      });
        
      if (response.ok) {
        const updatedCart = await response.json();

        setCart(updatedCart);
        return updatedCart;
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  }, []);

  const isProductLoading = useCallback((productId: number) => {
    return loadingItems.has(productId);
  }, [loadingItems]);

  const getProductQuantity = useCallback((productId: number) => {

    return cart?.items.find(item => item.product.id === productId)?.quantity || 0;
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, isProductLoading, getProductQuantity }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
