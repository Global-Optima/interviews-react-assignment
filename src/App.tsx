import { Products } from './Products.tsx';
import { Cart } from './types.ts';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
import { useState } from 'react';
import { useDebounce } from './hooks/useDebounce.ts';

function App() {
  const [cart, setCart] = useState<Cart>();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar
        quantity={cart?.totalItems || 0}
        price={cart?.totalPrice || 0}
        onSearchChange={setSearchTerm}
      />
      <Box flex={1} display="flex" flexDirection="row">
        <Categories
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
        <Box flex={1}>
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
