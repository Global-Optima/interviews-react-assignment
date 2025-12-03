import { useEffect, useState, useCallback, useRef } from 'react';
import { Filters } from './useProductFilters';

export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
}

const PRODUCTS_PER_PAGE = 20;

interface UseInfiniteProductsOptions {
  q?: string;
  category?: string;
  sort?: Filters['sort'];
  minPrice?: number;
  maxPrice?: number;
}

export function useInfiniteProducts(options: UseInfiniteProductsOptions) {
  const { q, category, sort, minPrice, maxPrice } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const loadingRef = useRef(false);
  
  // AbortController для отмены устаревших запросов
  const abortControllerRef = useRef<AbortController | null>(null);

  // Функция для загрузки следующей страницы
  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore || isLoading) {
      return;
    }

    // Отменяем предыдущий запрос если он еще выполняется
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для этого запроса
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set('page', (page + 1).toString());
      params.set('limit', PRODUCTS_PER_PAGE.toString());

      if (q) params.set('q', q);
      if (category) params.set('category', category);

      const response = await fetch(`/products?${params.toString()}`, {
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response type');
      }

      const data = await response.json();

      // Проверяем, что запрос не был отменен перед обновлением состояния
      if (!abortController.signal.aborted) {
        setProducts((prev) => [...prev, ...data.products]);
        setTotalCount(data.total);
        setPage((prev) => prev + 1);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      // Игнорируем ошибки отмены запроса - они не являются реальными ошибками
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('[useInfiniteProducts] Request aborted (expected)');
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
      
      // Очищаем ссылку если это был текущий контроллер
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [page, hasMore, isLoading, q, category]);

  // Функция для начальной загрузки (перезагрузка при изменении фильтров)
  const loadInitial = useCallback(async () => {
    // Отменяем все предыдущие запросы при изменении фильтров
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Создаем новый AbortController для начальной загрузки
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setIsLoading(true);
    setError(null);
    loadingRef.current = true;

    try {
      const params = new URLSearchParams();
      params.set('page', '0');
      params.set('limit', PRODUCTS_PER_PAGE.toString());

      if (q) params.set('q', q);
      if (category) params.set('category', category);

      const response = await fetch(`/products?${params.toString()}`, {
        signal: abortController.signal,
      });

      if (!response.ok) {
        throw new Error(`Failed to load products: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response type');
      }

      const data = await response.json();

      // Проверяем, что запрос не был отменен перед обновлением состояния
      if (!abortController.signal.aborted) {
        setProducts(data.products);
        setTotalCount(data.total);
        setPage(0);
        setHasMore(data.hasMore);
      }
    } catch (err) {
      // Игнорируем ошибки отмены запроса - они не являются реальными ошибками
      if (err instanceof Error && err.name === 'AbortError') {
        console.log('[useInfiniteProducts] Initial load aborted (expected - filters changed)');
        return;
      }
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
      
      // Очищаем ссылку если это был текущий контроллер
      if (abortControllerRef.current === abortController) {
        abortControllerRef.current = null;
      }
    }
  }, [q, category]);

  // Перезагрузка при изменении фильтров
  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    loadInitial();
    
    // Cleanup: отменяем запросы при размонтировании компонента
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadInitial]);

  // Применяем сортировку на клиенте
  const sortedProducts = products.slice();
  if (sort) {
    switch (sort) {
      case 'name_asc':
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
    }
  }

  // Применяем фильтрацию по цене на клиенте
  const filteredProducts = sortedProducts.filter((product) => {
    if (minPrice !== undefined && product.price < minPrice) return false;
    if (maxPrice !== undefined && product.price > maxPrice) return false;
    return true;
  });

  return {
    products: filteredProducts,
    totalCount,
    hasMore,
    isLoading,
    error,
    loadMore,
    setProducts,
  };
}
