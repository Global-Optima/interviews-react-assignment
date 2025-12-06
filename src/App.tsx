import { Products } from './Products.tsx';
import { Cart } from './types.ts';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
import { FilterBar } from './FilterBar.tsx';
import { SortSelect } from './SortSelect.tsx';
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

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, [setSearchTerm]);

  const handleClearCategory = useCallback(() => {
    setSelectedCategory('');
  }, [setSelectedCategory]);

  const handleClearAll = useCallback(() => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('');
  }, [setSearchTerm, setSelectedCategory, setSortBy]);

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
        resultCount={totalCount}
        onClearSearch={handleClearSearch}
        onClearCategory={handleClearCategory}
        onClearAll={handleClearAll}
      >
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
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
