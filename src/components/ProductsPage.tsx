import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Alert, Typography, Container, Button } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { useProductFilters } from '../hooks/useProductFilters';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useInfiniteProducts } from '../hooks/useInfiniteProducts';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { useCartContext } from '../contexts/CartContext';
import { ProductFilters } from './ProductFilters';
import { VirtualizedProductGrid } from './VirtualizedProductGrid';

export function ProductsPage() {
  // Управление корзиной через CartContext с оптимистичными обновлениями
  const { updateCartItem, getItemQuantity } = useCartContext();
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
        backgroundColor: 'background.default',
      }}
    >
      <Container 
        maxWidth="lg"
        sx={{ 
          py: { xs: 2, sm: 3, md: 4 },
          px: { xs: 2, sm: 3 },
        }}
      >
        {/* Page Header - Title & Subtitle */}
        <Box 
          sx={{ 
            mb: { xs: 3, md: 4 },
            textAlign: { xs: 'center', md: 'left' },
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: { xs: 'center', md: 'flex-start' },
              gap: 1.5,
              mb: 1,
            }}
          >
            <StorefrontIcon 
              sx={{ 
                fontSize: { xs: 32, md: 40 }, 
                color: 'primary.main' 
              }} 
            />
            <Typography 
              variant="h3" 
              component="h1"
              sx={{
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                letterSpacing: '-0.02em',
              }}
            >
              TechHub Store
            </Typography>
          </Box>
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{
              fontSize: { xs: '0.875rem', md: '1rem' },
              maxWidth: { xs: '100%', md: 600 },
              mx: { xs: 'auto', md: 0 },
            }}
          >
            Discover the latest electronics and gadgets. Shop laptops, smartphones, accessories and more.
          </Typography>
        </Box>

        {/* Filters Panel */}
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

        {/* API Error with Retry */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
            action={
              <Button 
                color="inherit" 
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => loadMore()}
              >
                Retry
              </Button>
            }
          >
            <Typography variant="body2" fontWeight={600}>
              Failed to load products
            </Typography>
            <Typography variant="caption">
              {error}
            </Typography>
          </Alert>
        )}

        {/* First-time Loading State */}
        {isLoading && products.length === 0 && !error && (
          <Box 
            display="flex" 
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              minHeight: { xs: 300, md: 400 },
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              p: { xs: 4, md: 6 },
            }}
          >
            <CircularProgress size={48} thickness={4} sx={{ mb: 3 }} />
            <Typography 
              variant="h6" 
              color="text.secondary" 
              fontWeight={500}
              textAlign="center"
            >
              Loading products...
            </Typography>
            <Typography 
              variant="body2" 
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 1 }}
            >
              Please wait while we fetch the latest tech
            </Typography>
          </Box>
        )}

        {/* Empty State - No Products Found */}
        {!isLoading && products.length === 0 && !error && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: { xs: 300, md: 400 },
              backgroundColor: 'background.paper',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              p: { xs: 3, md: 5 },
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: { xs: 80, md: 100 },
                height: { xs: 80, md: 100 },
                borderRadius: '50%',
                backgroundColor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <StorefrontIcon 
                sx={{ 
                  fontSize: { xs: 40, md: 50 }, 
                  color: 'primary.main' 
                }} 
              />
            </Box>
            <Typography 
              variant="h5" 
              color="text.primary"
              fontWeight={600}
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', md: '1.5rem' } }}
            >
              No products found
            </Typography>
            {(filters.q || filters.category || filters.minPrice || filters.maxPrice) ? (
              <>
                <Typography 
                  variant="body1" 
                  color="text.secondary"
                  sx={{ mb: 3, maxWidth: 400 }}
                >
                  We couldn't find any products matching your search criteria. Try adjusting your filters.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    clearFilters();
                    setSearchInput('');
                  }}
                  startIcon={<RefreshIcon />}
                >
                  Clear All Filters
                </Button>
              </>
            ) : (
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ maxWidth: 400 }}
              >
                No products available at the moment. Please check back later.
              </Typography>
            )}
          </Box>
        )}

        {/* Products Grid */}
        {products.length > 0 && (
          <>
            {/* Results Count Header */}
            <Box 
              sx={{ 
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              <Typography 
                variant="body2" 
                color="text.secondary"
                fontWeight={500}
              >
                Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> products
              </Typography>
              {isLoading && (
                <Box display="flex" alignItems="center" gap={1}>
                  <CircularProgress size={16} thickness={4} />
                  <Typography variant="caption" color="text.secondary">
                    Loading more...
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Virtualized Grid */}
            <Box
              sx={{
                height: 'calc(100vh - 450px)',
                minHeight: { xs: 400, md: 500 },
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

            {/* Loading More Indicator */}
            {isLoading && products.length > 0 && (
              <Box 
                display="flex" 
                justifyContent="center"
                alignItems="center"
                gap={2}
                sx={{
                  py: 3,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  mb: 2,
                }}
              >
                <CircularProgress size={24} thickness={4} />
                <Typography variant="body2" color="text.secondary">
                  Loading more products...
                </Typography>
              </Box>
            )}

            {/* End of List Message */}
            {!hasMore && !isLoading && (
              <Box 
                display="flex" 
                justifyContent="center"
                alignItems="center"
                sx={{
                  py: 2,
                  backgroundColor: 'background.paper',
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  ✨ You've seen all {totalCount} products
                </Typography>
              </Box>
            )}
          </>
        )}

        {/* Sentinel for Infinite Scroll */}
        <div ref={sentinelRef} style={{ height: 1 }} />
      </Container>
    </Box>
  );
}
