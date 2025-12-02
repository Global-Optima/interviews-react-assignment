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
    <Box 
      height="100vh" 
      display="flex" 
      flexDirection="column"
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <CssBaseline/>
      <SearchAppBar quantity={cart?.totalItems || 0} price={cart?.totalPrice || 0}/>
      <Box 
        flex={1} 
        display="flex" 
        flexDirection="row"
        sx={{
          overflow: 'hidden',
        }}
      >
        <Categories/>
        <Box flex={1}>
          <Products onCartChange={onCartChange}/>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
