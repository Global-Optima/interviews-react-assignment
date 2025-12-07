import { Cart, Products } from './components/products-page/Products.tsx';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './components/SearchAppBar.tsx';
import { Categories } from './components/products-page/Categories.tsx';
import { useState } from 'react';

function App() {
  const [cart, setCart] = useState<Cart>();

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline/>
      <SearchAppBar quantity={cart?.totalItems || 0} price={cart?.totalPrice || 0}/>
      <Box flex={1} display="flex" minHeight={0} flexDirection="row">
        <Categories/>
        <Products onCartChange={onCartChange}/>
      </Box>
    </Box>
  );
}

export default App;
