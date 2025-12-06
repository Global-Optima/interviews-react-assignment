import { Box, CircularProgress, Grid, Typography, Button, Alert } from '@mui/material';
import { useEffect, useCallback } from 'react';
import { useIntersectionObserver } from './hooks/useIntersectionObserver';
import { useProducts, SortOption } from './hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Cart } from './types';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RefreshIcon from '@mui/icons-material/Refresh';

export const Products = ({
  onCartChange,
  onTotalCountChange,
  searchTerm,
  selectedCategory,
  sortBy = '',
  minPrice = null,
  maxPrice = null
}: {
  onCartChange: (cart: Cart) => void;
  onTotalCountChange?: (count: number | null) => void;
  searchTerm: string;
  selectedCategory: string;
  sortBy?: SortOption;
  minPrice?: number | null;
  maxPrice?: number | null;
}) => {
  const { products, loading, hasMore, error, totalCount, loadMore, setProducts, resetError } = useProducts({
    searchTerm,
    category: selectedCategory,
    sortBy,
    minPrice,
    maxPrice
  });
  const [targetRef, isIntersecting] = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && hasMore && !loading && !error) {
      loadMore();
    }
  }, [isIntersecting, hasMore, loading, error, loadMore]);

  useEffect(() => {
    onTotalCountChange?.(totalCount);
  }, [totalCount, onTotalCountChange]);

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

  const handleRetry = useCallback(() => {
    resetError();
    loadMore();
  }, [resetError, loadMore]);

  if (error && products.length === 0) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
        p={4}
      >
        <Alert
          severity="error"
          sx={{ mb: 2, maxWidth: 400 }}
        >
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={handleRetry}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  const showEmptyState = !loading && products.length === 0 && !error;

  return (
    <Box overflow="auto" height="100%">
      {showEmptyState ? (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100%"
          p={4}
        >
          <SearchOffIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body1" color="text.secondary" textAlign="center">
            {searchTerm || selectedCategory
              ? "Try adjusting your search or filter criteria"
              : "No products are available at the moment"}
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={2} p={2}>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </Grid>

          {error && products.length > 0 && (
            <Box display="flex" flexDirection="column" alignItems="center" p={2}>
              <Alert severity="error" sx={{ mb: 1 }}>
                {error}
              </Alert>
              <Button
                size="small"
                startIcon={<RefreshIcon />}
                onClick={handleRetry}
              >
                Retry
              </Button>
            </Box>
          )}

          {loading && (
            <Box display="flex" justifyContent="center" p={2}>
              <CircularProgress />
            </Box>
          )}
        </>
      )}
      <div ref={targetRef} style={{ height: 20 }} />
    </Box>
  );
};
