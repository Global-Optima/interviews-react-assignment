import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './layout/SearchAppBar.tsx';
import { Categories } from './layout/Categories.tsx';
import { Products } from './components/Products.tsx';
import { useCart } from './hooks/useCart.ts';

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
