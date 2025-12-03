import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { useProductFilters } from '../hooks/useProductFilters';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCart } from '../hooks/useCart';
import { ProductFilters } from './ProductFilters';
import { VirtualizedProductGrid } from './VirtualizedProductGrid';

export function ProductsPage() {
  // Управление корзиной через dedicated hook с оптимистичными обновлениями
  const { updateCartItem, getItemQuantity } = useCart();
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
  // Использует useCart hook с оптимистичными обновлениями и функциональными setState
  // Это полностью устраняет проблемы stale closure
  const handleAddToCart = useCallback(async (productId: number, quantity: number) => {
    // Устанавливаем loading состояние используя функциональное обновление
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, loading: true } : p))
    );

    // useCart внутри делает оптимистичное обновление с автоматическим rollback при ошибке
    const success = await updateCartItem(productId, quantity);
    
    // Обновляем состояние товара на основе результата, используя функциональное обновление
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const currentQty = getItemQuantity(productId);
          return {
            ...p,
            itemInCart: currentQty,
            loading: false,
          };
        }
        return p;
      })
    );
    
    if (!success) {
      console.error('Failed to update cart for product', productId);
    }
  }, [updateCartItem, getItemQuantity, setProducts]);

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

      {/* Виртуализированная сетка товаров */}
      {products.length > 0 && (
        <Box
          sx={{
            height: 'calc(100vh - 350px)', // Adjust based on filters height
            minHeight: '500px',
            mb: 2,
          }}
        >
          <VirtualizedProductGrid
            products={products}
            onAddToCart={handleAddToCart}
            onLoadMore={loadMore}
            hasMore={hasMore}
            isLoading={isLoading}
          />
        </Box>
      )}

      {/* Индикатор загрузки при первоначальной загрузке */}
      {isLoading && products.length === 0 && (
        <Box display="flex" justifyContent="center" p={3} gap={2}>
          <CircularProgress size={30} />
          <Typography variant="body2" color="text.secondary">
            Loading products...
          </Typography>
        </Box>
      )}

      {/* Сообщение об окончании списка */}
      {!hasMore && products.length > 0 && (
        <Box display="flex" justifyContent="center" p={2}>
          <Typography variant="body2" color="text.secondary">
            All products loaded ({totalCount} total)
          </Typography>
        </Box>
      )}
    </Box>
  );
}
