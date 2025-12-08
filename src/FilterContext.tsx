import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type FilterState = {
  searchQuery: string;
  category: string;
  sortBy: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | '';
};

type FilterContextType = {
  filters: FilterState;
  setSearchQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSortBy: (sortBy: FilterState['sortBy']) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  searchQuery: '',
  category: '',
  sortBy: '',
};

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  // Инициализация из URL параметров
  const [filters, setFilters] = useState<FilterState>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return {
        searchQuery: params.get('q') || '',
        category: params.get('category') || '',
        sortBy: (params.get('sort') as FilterState['sortBy']) || '',
      };
    }
    return defaultFilters;
  });

  // Синхронизация с URL при изменении фильтров
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (filters.searchQuery) {
      params.set('q', filters.searchQuery);
    }
    if (filters.category) {
      params.set('category', filters.category);
    }
    if (filters.sortBy) {
      params.set('sort', filters.sortBy);
    }

    const newUrl = params.toString() 
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  const setSearchQuery = (query: string) => {
    setFilters(prev => ({ ...prev, searchQuery: query }));
  };

  const setCategory = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };

  const setSortBy = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const hasActiveFilters = !!(
    filters.searchQuery || 
    filters.category || 
    filters.sortBy
  );

  return (
    <FilterContext.Provider
      value={{
        filters,
        setSearchQuery,
        setCategory,
        setSortBy,
        clearFilters,
        hasActiveFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
