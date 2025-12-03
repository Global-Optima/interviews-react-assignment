import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Grid, CircularProgress, Alert, Typography } from '@mui/material';
import { useProductFilters } from '../hooks/useProductFilters';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ProductFilters } from './ProductFilters';
import { ProductCard } from './ProductCard';

export interface Cart {
  items: Array<{ id: number; quantity: number }>;
  totalPrice: number;
  totalItems: number;
}

interface ProductsPageProps {
  onCartChange: (cart: Cart) => void;
}

export function ProductsPage({ onCartChange }: ProductsPageProps) {
  // Управление фильтрами через URL
  const { filters, updateFilters, clearFilters } = useProductFilters();

  // Локальное состояние для search input (обновляется моментально)
  const [searchInput, setSearchInput] = useState(filters.q);

  // Debounced search query (обновляется с задержкой 400ms)
  const debouncedQ = useDebouncedValue(searchInput, 400);

  // Синхронизируем URL с debounced значением
  useEffect(() => {
    if (debouncedQ !== filters.q) {
      updateFilters({ q: debouncedQ || undefined });
    }
  }, [debouncedQ, filters.q, updateFilters]);

  // Синхронизируем локальный input с URL при внешних изменениях
  useEffect(() => {
    if (filters.q !== searchInput && filters.q !== debouncedQ) {
      setSearchInput(filters.q);
    }
  }, [filters.q]);

  // Загрузка товаров с бесконечной прокруткой
  const { products, totalCount, hasMore, isLoading, error, loadMore, setProducts } = useInfiniteProducts({
    q: debouncedQ,
    category: filters.category,
    sort: filters.sort,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
  });

  // Sentinel элемент для Intersection Observer
  const sentinelRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);

  // Intersection Observer для автоматической подгрузки
  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: loadMore,
    enabled: hasMore && !isLoading,
    rootMargin: '100px',
  });

  // Обработчик добавления товара в корзину
  // Обернуто в useCallback для стабильности ссылки и оптимизации рендеринга
  const handleAddToCart = useCallback(async (productId: number, quantity: number) => {
    // Обновляем UI оптимистично
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, loading: true } : p))
    );

    try {
      const response = await fetch('/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, quantity }),
      });

      if (response.ok) {
        const cart = await response.json();
        
        // Обновляем количество в корзине для товара
        setProducts((prev) =>
          prev.map((p) =>
            p.id === productId
              ? { ...p, itemInCart: (p.itemInCart || 0) + quantity, loading: false }
              : p
          )
        );
        
        onCartChange(cart);
      } else {
        throw new Error('Failed to update cart');
      }
    } catch (err) {
      console.error('Cart update error:', err);
      // Откатываем loading состояние
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, loading: false } : p))
      );
    }
  }, [onCartChange, setProducts]);

  return (
    <Box
      ref={scrollBoxRef}
      sx={{
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        p: 3,
        background: 'transparent',
      }}
    >
      {/* Фильтры */}
      <ProductFilters
        filters={filters}
        onChangeFilters={updateFilters}
        onClearFilters={() => {
          clearFilters();
          setSearchInput('');
        }}
        searchInput={searchInput}
        onSearchInputChange={setSearchInput}
        resultsCount={totalCount}
      />

      {/* Ошибка API */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 2,
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }} 
          onClose={() => {}}
        >
          {error}
        </Alert>
      )}

      {/* Пустое состояние */}
      {!isLoading && products.length === 0 && !error && (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
          gap={2}
        >
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          {(filters.q || filters.category || filters.minPrice || filters.maxPrice) && (
            <Typography variant="body2" color="text.secondary">
              Try adjusting your search or filters
            </Typography>
          )}
        </Box>
      )}

      {/* Сетка товаров */}
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} onAddToCart={handleAddToCart} />
          </Grid>
        ))}

        {/* Sentinel для Intersection Observer */}
        {hasMore && (
          <Grid item xs={12}>
            <Box ref={sentinelRef} sx={{ height: '1px' }} />
          </Grid>
        )}

        {/* Индикатор загрузки */}
        {isLoading && products.length > 0 && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3} gap={2}>
              <CircularProgress size={30} />
              <Typography variant="body2" color="text.secondary">
                Loading more products...
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Сообщение об окончании списка */}
        {!hasMore && products.length > 0 && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3}>
              <Typography variant="body2" color="text.secondary">
                All products loaded ({totalCount} total)
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
