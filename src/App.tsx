import { Products } from './Products.tsx';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
import { useCart } from './hooks/useCart.ts';

function App() {
  const { cart } = useCart();

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
          <Products/>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
