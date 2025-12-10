import { useState, useEffect, useCallback } from 'react';

type HistoryMethod = 'push' | 'replace';

export function useUrlState(key: string, initialValue: string = '', method: HistoryMethod = 'push') {
  const [value, setValue] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || initialValue;
  });

  const updateValue = useCallback((newValue: string) => {
    setValue(newValue);
    const params = new URLSearchParams(window.location.search);
    if (newValue) {
      params.set(key, newValue);
    } else {
      params.delete(key);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    
    if (method === 'push') {
      window.history.pushState({}, '', newUrl);
    } else {
      window.history.replaceState({}, '', newUrl);
    }
  }, [key, method]);

  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      setValue(params.get(key) || initialValue);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key, initialValue]);

  return [value, updateValue] as const;
}
