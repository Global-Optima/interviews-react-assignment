import { createContext, useContext, ReactNode } from 'react';
import { useCart, Cart } from '../hooks/useCart';

interface CartContextValue {
  cart: Cart;
  isUpdating: boolean;
  updateCartItem: (productId: number, quantity: number) => Promise<boolean>;
  getItemQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const cartValue = useCart();

  return (
    <CartContext.Provider value={cartValue}>
      {children}
    </CartContext.Provider>
  );
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
}
