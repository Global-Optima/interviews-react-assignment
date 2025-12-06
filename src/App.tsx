import { Products } from './Products.tsx';
import { Cart } from './types.ts';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
import { FilterBar } from './FilterBar.tsx';
import { useState, useCallback } from 'react';
import { useDebounce } from './hooks/useDebounce.ts';
import { useUrlState } from './hooks/useUrlState.ts';

function App() {
  const [cart, setCart] = useState<Cart>();
  const [searchTerm, setSearchTerm] = useUrlState('q', '', 'replace');
  const [selectedCategory, setSelectedCategory] = useUrlState('category', '');

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
  }, [setSearchTerm, setSelectedCategory]);

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
        onClearSearch={handleClearSearch}
        onClearCategory={handleClearCategory}
        onClearAll={handleClearAll}
      />
      <Box flex={1} display="flex" flexDirection="row" overflow="hidden">
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <Box flex={1} overflow="auto">
          <Products
            onCartChange={onCartChange}
            searchTerm={debouncedSearchTerm}
            selectedCategory={selectedCategory}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
