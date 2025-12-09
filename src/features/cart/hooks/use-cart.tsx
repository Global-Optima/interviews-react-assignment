import { createContext, useCallback, useContext, useState } from "react";
import { Cart } from "../model/types";
import { Product } from "../../products/model/types";

interface CartContextType {
  cart: Cart | undefined;
  addToCart: (product: Product, quantity: number) => Promise<Cart | undefined>;
  isProductLoading: (productId: number) => boolean;
  getProductQuantity: (productId: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<Cart>();
  const [loadingItems, setLoadingItems] = useState<Set<number>>(new Set());

  const addToCart = useCallback(async (product: Product, quantity: number) => {
    setLoadingItems(prev => new Set(prev).add(product.id));

    // save current cart state in case of failure
    const previousCart = cart;

    // optimistically update cart UI
    const optimisticCart = updateCartItem(cart, product, quantity);
    setCart(optimisticCart);

    try {
      const response = await fetch('/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId: product.id, quantity }),
      });
        
      if (response.ok) {
        const updatedCart = await response.json();
        //override with backend response
        setCart(updatedCart);
        return updatedCart;
      } else {
        //rollback on failure
        setCart(previousCart);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setLoadingItems(prev => {
        const next = new Set(prev);
        next.delete(product.id);
        return next;
      });
    }
  }, [cart]);

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

//mimics what backend would give us with increments/decrements
function updateCartItem(cart: Cart | undefined, product: Product, delta: number): Cart {
  if (!cart) {
    return {
      items: [
        {
          product,
          quantity: Math.max(delta, 0),
        },
      ],
      totalItems: Math.max(delta, 0),
      totalPrice: product.price * Math.max(delta, 0),
    };
  }

  const items = cart.items.map(item =>
    item.product.id === product.id
      ? { ...item, quantity: Math.max(0, item.quantity + delta) }
      : item
  );

  if (delta > 0 && !cart.items.find(item => item.product.id === product.id)) {
    items.push({ product, quantity: delta });
  }

  return { ...cart, items, totalItems: Math.max(0, cart.totalItems + delta), totalPrice: Math.max(0, cart.totalPrice + product.price * delta) };
}