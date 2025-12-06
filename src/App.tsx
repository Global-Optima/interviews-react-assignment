import { Products } from './Products.tsx';
import { Cart } from './types.ts';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
import { FilterBar } from './FilterBar.tsx';
import { SortSelect } from './SortSelect.tsx';
import { PriceRangeFilter } from './PriceRangeFilter.tsx';
import { useState, useCallback } from 'react';
import { useDebounce } from './hooks/useDebounce.ts';
import { useUrlState } from './hooks/useUrlState.ts';
import { SortOption } from './hooks/useProducts.ts';

function App() {
  const [cart, setCart] = useState<Cart>();
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useUrlState('q', '', 'replace');
  const [selectedCategory, setSelectedCategory] = useUrlState('category', '');
  const [sortBy, setSortBy] = useUrlState('sortBy', '');
  const [minPriceStr, setMinPriceStr] = useUrlState('minPrice', '');
  const [maxPriceStr, setMaxPriceStr] = useUrlState('maxPrice', '');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const minPrice = minPriceStr ? parseFloat(minPriceStr) : null;
  const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : null;

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, [setSearchTerm]);

  const handleClearCategory = useCallback(() => {
    setSelectedCategory('');
  }, [setSelectedCategory]);

  const handleClearPriceRange = useCallback(() => {
    setMinPriceStr('');
    setMaxPriceStr('');
  }, [setMinPriceStr, setMaxPriceStr]);

  const handleClearAll = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
    setMinPriceStr('');
    setMaxPriceStr('');
  }, [setSearchTerm, setSelectedCategory, setSortBy, setMinPriceStr, setMaxPriceStr]);

  const handleMinPriceChange = useCallback((value: number | null) => {
    setMinPriceStr(value !== null ? value.toString() : '');
  }, [setMinPriceStr]);

  const handleMaxPriceChange = useCallback((value: number | null) => {
    setMaxPriceStr(value !== null ? value.toString() : '');
  }, [setMaxPriceStr]);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar
        quantity={cart?.totalItems || 0}
        price={cart?.totalPrice || 0}
        onSearchChange={setSearchTerm}
      />
      <FilterBar
        searchTerm={debouncedSearchTerm}
        selectedCategory={selectedCategory}
        minPrice={minPrice}
        maxPrice={maxPrice}
        resultCount={totalCount}
        onClearSearch={handleClearSearch}
        onClearCategory={handleClearCategory}
        onClearPriceRange={handleClearPriceRange}
        onClearAll={handleClearAll}
      >
        <PriceRangeFilter
          minPrice={minPrice}
          maxPrice={maxPrice}
          onMinPriceChange={handleMinPriceChange}
          onMaxPriceChange={handleMaxPriceChange}
        />
        <SortSelect value={sortBy as SortOption} onChange={setSortBy} />
      </FilterBar>
      <Box flex={1} display="flex" flexDirection="row" overflow="hidden">
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <Box flex={1} overflow="auto">
          <Products
            onCartChange={onCartChange}
            onTotalCountChange={setTotalCount}
            searchTerm={debouncedSearchTerm}
            selectedCategory={selectedCategory}
            sortBy={sortBy as SortOption}
            minPrice={minPrice}
            maxPrice={maxPrice}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
