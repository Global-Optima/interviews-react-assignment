import { Box, CircularProgress, Grid } from '@mui/material';
import { useEffect, useCallback } from 'react';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { useProducts } from './hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Cart } from './types';

export const Products = ({
  onCartChange,
  searchTerm,
  selectedCategory
}: {
  onCartChange: (cart: Cart) => void;
  searchTerm: string;
  selectedCategory: string;
}) => {
  const { products, loading, hasMore, loadMore, setProducts } = useProducts({
    searchTerm,
    category: selectedCategory
  });
  const [targetRef, isIntersecting] = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && hasMore && !loading) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, loadMore]);

  const addToCart = useCallback((productId: number, quantity: number) => {
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          loading: true,
        };
      }
      return product;
    }));

    fetch('/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    }).then(async response => {
      if (response.ok) {
        const cart = await response.json();
        setProducts(prev => prev.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              itemInCart: (product.itemInCart || 0) + quantity,
              loading: false,
            };
          }
          return product;
        }));
        onCartChange(cart);
      }
    });
  }, [setProducts, onCartChange]);

  return (
    <Box overflow="auto" height="100%">
      <Grid container spacing={2} p={2}>
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </Grid>
      {loading && (
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      )}
      <div ref={targetRef} style={{ height: 20 }} />
    </Box>
  );
};
