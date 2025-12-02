import { useEffect, useState } from 'react';

/**
 * Generic hook для debouncing любого значения.
 * 
 * @template T - Тип дебаунсируемого значения
 * @param value - Значение для debounce
 * @param delay - Задержка в миллисекундах (по умолчанию 300ms)
 * @returns Debounced версия значения
 * 
 * @example
 * ```typescript
 * const [searchInput, setSearchInput] = useState('');
 * const debouncedSearch = useDebouncedValue(searchInput, 400);
 * 
 * useEffect(() => {
 *   // Вызывается только после 400ms без изменений searchInput
 *   fetchResults(debouncedSearch);
 * }, [debouncedSearch]);
 * ```
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер для обновления debounced значения
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при размонтировании или изменении value/delay
    // Это гарантирует, что debounced значение обновится только после
    // того, как value перестанет изменяться на протяжении delay ms
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
