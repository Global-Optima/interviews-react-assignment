import { Products } from './components/products';
import { Cart } from './types';
import { Box, CssBaseline } from '@mui/material';
import { SearchAppBar, Categories } from './components/layout';
import { FilterBar, SortSelect, PriceRangeFilter } from './components/filters';
import { useState, useCallback, useEffect } from 'react';
import { useDebounce, useUrlState } from './hooks';
import { SortOption } from './hooks/useProducts';
import { CheckoutWizard } from './components/checkout';

function App() {
  const [cart, setCart] = useState<Cart>();
  const [totalCount, setTotalCount] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useUrlState('q', '', 'replace');
  const [selectedCategory, setSelectedCategory] = useUrlState('category', '');
  const [sortBy, setSortBy] = useUrlState('sortBy', '');
  const [minPriceStr, setMinPriceStr] = useUrlState('minPrice', '');
  const [maxPriceStr, setMaxPriceStr] = useUrlState('maxPrice', '');
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const minPrice = minPriceStr ? parseFloat(minPriceStr) : null;
  const maxPrice = maxPriceStr ? parseFloat(maxPriceStr) : null;

  useEffect(() => {
    fetch('/cart')
      .then((response) => response.json())
      .then((data) => setCart(data));
  }, []);

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

  const handleCartClick = useCallback(() => {
    setCheckoutOpen(true);
  }, []);

  const handleCheckoutClose = useCallback(() => {
    setCheckoutOpen(false);
  }, []);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar
        quantity={cart?.totalItems || 0}
        price={cart?.totalPrice || 0}
        onSearchChange={setSearchTerm}
        onCartClick={handleCartClick}
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
      <CheckoutWizard
        open={checkoutOpen}
        onClose={handleCheckoutClose}
        cart={cart || null}
        onCartChange={onCartChange}
      />
    </Box>
  );
}

export default App;

