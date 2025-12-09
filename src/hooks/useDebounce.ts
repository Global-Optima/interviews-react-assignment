import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 500): {debounced: T, setDebounced: (value: T) => void} {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (Array.isArray(value) && Array.isArray(debounced) ) {
            if (value[0] !== debounced[0] || value[1] !== debounced[1]) {
                setDebounced(value);
            }
        } else if (value !== debounced) {
            setDebounced(value);
        }
    }, delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return {debounced, setDebounced};
}