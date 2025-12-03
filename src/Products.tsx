import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { HeavyComponent } from './HeavyComponent.tsx';
import { useProductFilters } from './hooks/useProductFilters.ts';
import { useIntersectionObserver } from './hooks/useIntersectionObserver.ts';
import { useCart } from './hooks/useCart.ts';

export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
};

const PRODUCTS_PER_PAGE = 20;

export const Products = () => {
  const { filters } = useProductFilters();
  const { updateCartItem, getItemQuantity } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  
  // AbortController для отмены устаревших запросов
  const abortControllerRef = useRef<AbortController | null>(null);

  // Функция loadMore для загрузки следующей страницы
  const loadMore = useCallback(async () => {
    // Не загружаем если уже идет загрузка или нет больше товаров
    if (isLoading || !hasMore) {
      console.log('[loadMore] Skipped:', { isLoading, hasMore });
      return;
    }

    // Отменяем предыдущий запрос если он еще выполняется
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для этого запроса
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    console.log('[loadMore] Loading page:', page + 1);
    setIsLoading(true);
    setError(null);

    try {
      // Построение URL с параметрами фильтров
      const params = new URLSearchParams();
      params.set('page', (page + 1).toString());
      params.set('limit', PRODUCTS_PER_PAGE.toString());
      
      if (filters.q) {
        params.set('q', filters.q);
      }
      if (filters.category) {
        params.set('category', filters.category);
      }

      const response = await fetch(`/products?${params.toString()}`, {
        signal: abortController.signal,
      });
      
      if (!response.ok) {
        throw new Error(`Не удалось загрузить товары: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Сервер вернул неправильный тип данных');
      }
      
      const data = await response.json();
      console.log('[loadMore] Loaded:', { 
        productsCount: data.products?.length, 
        total: data.total, 
        hasMore: data.hasMore 
      });
      
      // Проверяем, что запрос не был отменен перед обновлением состояния
      if (!abortController.signal.aborted) {
        // Добавляем новые товары к существующим
        setProducts(prev => [...prev, ...data.products]);
        setTotalCount(data.total);
        
        // Увеличиваем номер страницы
        setPage(prev => prev + 1);
        
        // Обновляем hasMore на основе ответа API
        setHasMore(data.hasMore);
      }
    } catch (err) {
      // Игнорируем ошибки отмены запроса
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('[Products.loadMore] Request aborted (expected)');
        return;
      }
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
      
      // Очищаем ссылку если это был текущий контроллер
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [isLoading, hasMore, page, filters.q, filters.category]);

  // Начальная загрузка товаров
  const loadInitial = useCallback(async () => {
    // Отменяем все предыдущие запросы при изменении фильтров
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для начальной загрузки
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    console.log('[loadInitial] Starting initial load');
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', '0');
      params.set('limit', PRODUCTS_PER_PAGE.toString());
      
      if (filters.q) {
        params.set('q', filters.q);
      }
      if (filters.category) {
        params.set('category', filters.category);
      }

      const response = await fetch(`/products?${params.toString()}`, {
        signal: abortController.signal,
      });
      
      if (!response.ok) {
        throw new Error(`Не удалось загрузить товары: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Сервер вернул неправильный тип данных');
      }
      
      const data = await response.json();
      console.log('[loadInitial] Loaded:', { 
        productsCount: data.products?.length, 
        total: data.total, 
        hasMore: data.hasMore 
      });
      
      // Проверяем, что запрос не был отменен перед обновлением состояния
      if (!abortController.signal.aborted) {
        setProducts(data.products);
        setTotalCount(data.total);
        setPage(0);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      // Игнорируем ошибки отмены запроса
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('[Products.loadInitial] Request aborted (expected - filters changed)');
        return;
      }
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
      
      // Очищаем ссылку если это был текущий контроллер
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [filters.q, filters.category]);

  // Перезагрузка при изменении фильтров
  useEffect(() => {
    setPage(0);
    setProducts([]);
    setHasMore(true);
    loadInitial();
    
    // Прокручиваем наверх при новом поиске
    if (scrollBoxRef.current) {
      scrollBoxRef.current.scrollTop = 0;
    }
    
    // Cleanup: отменяем запросы при размонтировании компонента
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadInitial]);

  // Сортировка товаров на клиенте (поскольку API не поддерживает сортировку)
  const sortedProducts = useMemo(() => {
    const sorted = [...products];
    
    switch (filters.sort) {
      case 'name_asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'price_asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price_desc':
        return sorted.sort((a, b) => b.price - a.price);
      default:
        return sorted;
    }
  }, [products, filters.sort]);

  // Используем кастомный хук для Intersection Observer
  useIntersectionObserver({
    target: sentinelRef,
    onIntersect: loadMore,
    enabled: hasMore && !isLoading,
    rootMargin: '100px',
  });

  // Функция addToCart теперь использует useCart hook для оптимистичных обновлений
  // и полностью избегает stale closures через функциональные setState
  const addToCart = useCallback(async (productId: number, quantity: number) => {
    // Устанавливаем loading состояние для конкретного товара используя функциональное обновление
    setProducts(prev => prev.map(product =>
      product.id === productId ? { ...product, loading: true } : product
    ));
    
    // Используем useCart который внутри делает оптимистичные обновления с функциональным setState
    const success = await updateCartItem(productId, quantity);
    
    // Обновляем состояние товара на основе результата
    setProducts(prev => prev.map(product => {
      if (product.id === productId) {
        const currentQty = getItemQuantity(productId);
        return {
          ...product,
          itemInCart: currentQty,
          loading: false,
        };
      }
      return product;
    }));
    
    if (!success) {
      console.error('Failed to update cart for product', productId);
    }
  }, [updateCartItem, getItemQuantity]);

  return (
    <Box 
      ref={scrollBoxRef}
      height="100%"
      sx={{ 
        overflowY: 'auto',
        overflowX: 'hidden'
      }}
    >
      <Grid container spacing={2} p={2}>
        {/* Счетчик результатов */}
        {!isLoading && products.length > 0 && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center" pb={1}>
              <Typography variant="body1" color="text.secondary">
                Найдено товаров: <strong>{totalCount}</strong>
              </Typography>
              {filters.sort && (
                <Typography variant="body2" color="text.secondary">
                  Сортировка: {
                    filters.sort === 'name_asc' ? 'Название (А-Я)' :
                    filters.sort === 'name_desc' ? 'Название (Я-А)' :
                    filters.sort === 'price_asc' ? 'Цена (по возрастанию)' :
                    'Цена (по убыванию)'
                  }
                </Typography>
              )}
            </Box>
            <Divider />
          </Grid>
        )}

        {/* Ошибка API */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Пустое состояние */}
        {!isLoading && products.length === 0 && !error && (
          <Grid item xs={12}>
            <Box 
              display="flex" 
              flexDirection="column"
              justifyContent="center" 
              alignItems="center" 
              minHeight="400px"
              gap={2}
            >
              <Typography variant="h6" color="text.secondary">
                Товары не найдены
              </Typography>
              {(filters.q || filters.category) && (
                <Typography variant="body2" color="text.secondary">
                  Попробуйте изменить параметры поиска или фильтры
                </Typography>
              )}
            </Box>
          </Grid>
        )}

        {/* Список товаров - ИСПРАВЛЕН key prop на Grid item, используем отсортированный список */}
        {sortedProducts.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            {/* Do not remove this */}
            <HeavyComponent/>
            <Card style={{ width: '100%', height: '100%' }}>
              <CardMedia
                component="img"
                height="150"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.category}
                </Typography>
              </CardContent>
              <CardActions>
                <Typography variant="h6" component="div">
                  ${product.price.toFixed(2)}
                </Typography>
                <Box flexGrow={1}/>
                <Box position="relative" display="flex" flexDirection="row" alignItems="center">
                  <Box position="absolute" left={0} right={0} top={0} bottom={0} textAlign="center">
                    {product.loading && <CircularProgress size={20}/>}
                  </Box>
                  <IconButton 
                    disabled={product.loading || (product.itemInCart || 0) === 0} 
                    aria-label="удалить из корзины" 
                    size="small"
                    onClick={() => addToCart(product.id, -1)}
                  >
                    <RemoveIcon fontSize="small"/>
                  </IconButton>

                  <Typography variant="body1" component="div" mx={1}>
                    {product.itemInCart || 0}
                  </Typography>

                  <IconButton 
                    disabled={product.loading} 
                    aria-label="добавить в корзину" 
                    size="small"
                    onClick={() => addToCart(product.id, 1)}
                  >
                    <AddIcon fontSize="small"/>
                  </IconButton>
                </Box>

              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* Sentinel элемент для Intersection Observer */}
        {hasMore && (
          <Grid item xs={12}>
            <Box ref={sentinelRef} sx={{ height: '1px' }} />
          </Grid>
        )}

        {/* Индикатор загрузки при подгрузке следующей страницы */}
        {isLoading && products.length > 0 && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress size={30} />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                Загрузка...
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Сообщение об окончании списка */}
        {!hasMore && products.length > 0 && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3}>
              <Typography variant="body2" color="text.secondary">
                Все товары загружены ({totalCount} из {totalCount})
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
