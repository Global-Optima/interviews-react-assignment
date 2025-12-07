import { useState, useCallback } from 'react';
import { Cart, Product } from '../types/types';
import { calculateOptimisticCart } from '../utils/cartUtils';

export function useCart() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalPrice: 0,
    totalItems: 0,
  });
  const [products, setProducts] = useState<Product[]>([]);

  const recalculateOnError = (productId: number, quantity: number) => {
    // Rollback on network error
    setProducts((currentProducts) =>
      currentProducts.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            itemInCart: Math.max(0, (product.itemInCart || 0) - quantity),
            loading: false,
          };
        }
        return product;
      })
    );

    // Recalculate cart after rollback
    setProducts((rolledBackProducts) => {
      const rolledBackCart = calculateOptimisticCart(rolledBackProducts);
      setCart(rolledBackCart);
      return rolledBackProducts;
    });
  };

  const updateProductLoadingState = useCallback(
    (productId: number, loading: boolean) => {
      setProducts((current) =>
        current.map((product) =>
          product.id === productId ? { ...product, loading } : product
        )
      );
    },
    []
  );

  const updateCartLoadingState = useCallback(
    (productId: number, loading: boolean) => {
      setCart((current) => ({
        ...current,
        items: current.items.map((item) =>
          item.id === productId ? { ...item, loading } : item
        ),
      }));
    },
    []
  );

  const updateCartItem = useCallback(
    async (productId: number, quantity: number) => {
      // Optimistic update
      const updatedProducts = products.map((product) =>
        product.id === productId
          ? {
              ...product,
              itemInCart:
                quantity === 0 ? 0 : (product.itemInCart || 0) + quantity,
              loading: true,
            }
          : product
      );

      setProducts(updatedProducts);
      const optimisticCart = calculateOptimisticCart(updatedProducts);
      setCart(optimisticCart);

      try {
        const response = await fetch('/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, quantity }),
        });

        if (response.ok) {
          updateProductLoadingState(productId, false);
          updateCartLoadingState(productId, false);
        } else {
          throw new Error('Server error');
        }
      } catch (error) {
        recalculateOnError(productId, quantity);
        updateProductLoadingState(productId, false);
        updateCartLoadingState(productId, false);
      }
    },
    [products, updateProductLoadingState, updateCartLoadingState]
  );

  const addToCart = useCallback(
    (productId: number, quantity: number) => {
      return updateCartItem(productId, quantity);
    },
    [updateCartItem]
  );

  const removeFromCart = useCallback(
    (productId: number) => {
      return updateCartItem(productId, 0);
    },
    [updateCartItem]
  );

  return {
    cart,
    products,
    setProducts,
    setCart,
    addToCart,
    removeFromCart,
  };
}

export type UseCartReturn = ReturnType<typeof useCart>;
export type AddToCart = UseCartReturn['addToCart'];
export type RemoveFromCart = UseCartReturn['removeFromCart'];
export type SetProducts = UseCartReturn['setProducts'];
export type SetCart = UseCartReturn['setCart'];
