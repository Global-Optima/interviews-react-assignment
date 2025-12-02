import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';

export interface Filters {
  q: string;
  category: string;
  sort: SortOption;
  minPrice?: number;
  maxPrice?: number;
}

const DEFAULT_SORT: SortOption = 'price_asc';

/**
 * Hook для управления фильтрами товаров с синхронизацией через URL query параметры.
 * 
 * Фильтры хранятся в URL как единственный источник истины (single source of truth).
 * Это позволяет делиться ссылками с фильтрами и сохранять состояние при перезагрузке.
 * 
 * @returns объект с текущими фильтрами и функциями для их обновления
 */
export function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Парсим фильтры из URL параметров
  const filters: Filters = useMemo(() => {
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const sortParam = searchParams.get('sort');
    const minPriceParam = searchParams.get('minPrice');
    const maxPriceParam = searchParams.get('maxPrice');

    // Валидация sort параметра
    const validSortOptions: SortOption[] = ['price_asc', 'price_desc', 'name_asc', 'name_desc'];
    const sort: SortOption = validSortOptions.includes(sortParam as SortOption)
      ? (sortParam as SortOption)
      : DEFAULT_SORT;

    // Парсинг цен с защитой от невалидных значений
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

    return {
      q,
      category,
      sort,
      minPrice: minPrice && !isNaN(minPrice) ? minPrice : undefined,
      maxPrice: maxPrice && !isNaN(maxPrice) ? maxPrice : undefined,
    };
  }, [searchParams]);

  /**
   * Обновляет фильтры частично (merge с текущими значениями).
   * Пустые/null значения удаляются из URL.
   * Использует replace: true для избежания засорения истории браузера.
   */
  const updateFilters = useCallback((partial: Partial<Filters>) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);

      // Обрабатываем каждое поле из partial
      Object.entries(partial).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          // Удаляем параметр если значение пустое
          newParams.delete(key);
        } else {
          // Устанавливаем новое значение
          newParams.set(key, String(value));
        }
      });

      return newParams;
    }, { replace: true });
  }, [setSearchParams]);

  /**
   * Очищает все фильтры, удаляя все параметры из URL.
   */
  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
}
