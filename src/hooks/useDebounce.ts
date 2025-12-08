import { useEffect, useState } from 'react';

/**
 * Custom hook для debouncing значения
 * @param value - Значение для debounce
 * @param delay - Задержка в миллисекундах (по умолчанию 500ms)
 * @returns Debounced значение
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Устанавливаем таймер для обновления debounced значения
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Очищаем таймер при размонтировании или изменении value/delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
