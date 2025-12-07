import { Cart, Products } from './Products.tsx';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
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
