import { Box, CssBaseline } from "@mui/material";
import SearchAppBar from "./components/SearchAppBar.tsx";
import { Categories } from "./components/Categories.tsx";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Checkout from "./components/Checkout.tsx";
import { Cart } from "./types/checkout.ts";
import { Products } from "./components/Products.tsx";

function App() {
  const [cart, setCart] = useState<Cart>();

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar
        quantity={cart?.totalItems || 0}
        price={cart?.totalPrice || 0}
      />

      <Box flex={1} display="flex" flexDirection="row">
        <Categories />

        <Box flex={1}>
          <Routes>
            <Route
              path="/"
              element={<Products onCartChange={onCartChange} />}
            />
            <Route
              path="/products"
              element={<Products onCartChange={onCartChange} />}
            />
            <Route
              path="/checkout"
              element={<Checkout cart={cart} setCart={setCart} />}
            />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

export default App;
