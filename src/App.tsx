import { Cart, Products } from "./Products.tsx";
import { Box, Button, CssBaseline } from "@mui/material";
import SearchAppBar from "./SearchAppBar.tsx";
import { Categories } from "./Categories.tsx";
import { useState, useCallback, useEffect } from "react";
import { Checkout } from "./Checkout.tsx";

function App() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalPrice: 0,
    totalItems: 0,
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false); // ⭐️ New state to control view

  // ⭐️ Mock function to fetch initial cart data (essential for starting state)
  const fetchCart = useCallback(async () => {
    try {
      // In a real app, this fetches the current cart from the API
      const response = await fetch("/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const initialCart = await response.json();
      setCart(initialCart);
    } catch (e) {
      console.error("Could not fetch cart:", e);
      setCart({ items: [], totalPrice: 0, totalItems: 0 }); // Fallback
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  function onCartChange(cart: Cart) {
    setCart(cart);
  }
  function handleCheckoutClick() {
    if (cart.totalItems > 0) {
      setIsCheckingOut(true);
    } else {
      alert("Your cart is empty! Add items before checking out.");
    }
  }
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      {/* Pass the handler to SearchAppBar */}
      <SearchAppBar
        quantity={cart.totalItems}
        price={cart.totalPrice}
        onCartIconClick={handleCheckoutClick} // ⭐️ New prop
      />

      <Box flex={1} display="flex" flexDirection="row" overflow="hidden">
        <Categories />
        <Box flex={1} overflow="auto">
          {/* Conditional Rendering: Show Checkout or Products */}
          {isCheckingOut ? (
            <Checkout cart={cart} onCartUpdate={onCartChange} />
          ) : (
            <Products onCartChange={onCartChange} />
          )}
        </Box>
      </Box>

      {/* Optional: Button to return from checkout (if needed for a quick demo) */}
      {isCheckingOut && (
        <Box sx={{ p: 2, textAlign: "center", borderTop: "1px solid #ccc" }}>
          <Button
            color="primary"
            onClick={() => setIsCheckingOut(false)}
            sx={{ mr: 1 }}
            aria-label="Back to catalog"
          >
            Back to catalog
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default App;
