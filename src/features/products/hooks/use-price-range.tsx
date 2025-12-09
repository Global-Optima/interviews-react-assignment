import { useState, useMemo, useEffect } from 'react';
import { Product } from '../model/types';
import { useDebounce } from '../../../shared/hooks/useDebounce';

interface UsePriceRangeProps {
  products: Product[];
  initialMin?: number;
  initialMax?: number;
}

export const usePriceRange = ({ 
  products, 
  initialMin = 0, 
  initialMax = 10000 
}: UsePriceRangeProps) => {
  const getInitialPriceRange = (): number[] => {
    const params = new URLSearchParams(window.location.search);
    const minParam = params.get('minPrice');
    const maxParam = params.get('maxPrice');
    
    const min = minParam ? parseInt(minParam, 10) : initialMin;
    const max = maxParam ? parseInt(maxParam, 10) : initialMax;
    
    return [min, max];
  };

  const [priceRange, setPriceRange] = useState<number[]>(getInitialPriceRange());
  const debouncedPriceRange = useDebounce(priceRange, 300);

  useEffect(() => {
    const [min, max] = debouncedPriceRange;
    const params = new URLSearchParams(window.location.search);
    
    if (min !== initialMin) {
      params.set('minPrice', min.toString());
    } else {
      params.delete('minPrice');
    }
    
    if (max !== initialMax) {
      params.set('maxPrice', max.toString());
    } else {
      params.delete('maxPrice');
    }
    
    const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [debouncedPriceRange, initialMin, initialMax]);

  const filteredProducts = useMemo(() => {
    const [min, max] = debouncedPriceRange;
    return products.filter(product => 
      product.price >= min && product.price <= max
    );
  }, [products, debouncedPriceRange]);

  const handlePriceChange = (_: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const resetPriceRange = () => {
    setPriceRange([initialMin, initialMax]);
  };

  return {
    priceRange,
    debouncedPriceRange,
    filteredProducts,
    handlePriceChange,
    setPriceRange,
    resetPriceRange,
  };
};