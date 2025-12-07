import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
import { Products } from './Products.tsx';
import { useCart } from './useCart.ts';

function App() {
  const { cart, products, setProducts, setCart, addToCart, removeFromCart } =
    useCart();

  return (
    <Box height='100vh' display='flex' flexDirection='column'>
      <CssBaseline />
      <SearchAppBar
        cart={cart}
        setCart={setCart}
        setProducts={setProducts}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
      />
      <Box flex={1} display='flex' flexDirection='row'>
        <Categories />
        <Box flex={1}>
          <Products
            products={products}
            setProducts={setProducts}
            addToCart={addToCart}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
