import { Cart, Products } from "./Products.tsx";
import { Box, Button, CssBaseline } from "@mui/material";
import SearchAppBar from "./SearchAppBar.tsx";
import { Categories } from "./Categories.tsx";
import { useState, useCallback, useEffect, useMemo } from "react";
import { Checkout } from "./Checkout.tsx";
import { getFiltersFromUrl } from "./helper.ts";

function App() {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalPrice: 0,
    totalItems: 0,
  });
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("");

  const fetchCart = useCallback(async () => {
    try {
      const response = await fetch("/cart");
      if (!response.ok) throw new Error("Failed to fetch cart");
      const initialCart = await response.json();
      setCart(initialCart);
    } catch (e) {
      console.error("Could not fetch cart:", e);
      setCart({ items: [], totalPrice: 0, totalItems: 0 });
    }
  }, []);

  const currentFilters = useMemo(
    () => ({
      searchTerm,
      activeCategory,
    }),
    [searchTerm, activeCategory]
  );

  function onCartChange(cart: Cart) {
    setCart(cart);
  }
  const handleClearFilters = useCallback(
    (key?: "searchTerm" | "activeCategory") => {
      if (key === "searchTerm") {
        setSearchTerm("");
      } else if (key === "activeCategory") {
        setActiveCategory("");
      } else {
        // Default: Clear All
        setSearchTerm("");
        setActiveCategory("");
      }
    },
    []
  );

  const handleCategorySelect = useCallback((category: string) => {
    setActiveCategory(category);
  }, []);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  function handleCheckoutClick() {
    if (cart.totalItems > 0) {
      setIsCheckingOut(true);
    } else {
      alert("Your cart is empty! Add items before checking out.");
    }
  }

  useEffect(() => {
    const initialFilters = getFiltersFromUrl();
    setSearchTerm(initialFilters.searchTerm);
    setActiveCategory(initialFilters.activeCategory);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set("q", searchTerm);
    }
    if (activeCategory) {
      params.set("category", activeCategory);
    }
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({ path: newUrl }, "", newUrl);
  }, [searchTerm, activeCategory]);
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar
        quantity={cart.totalItems}
        price={cart.totalPrice}
        onCartIconClick={handleCheckoutClick}
        initialSearchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />

      <Box flex={1} display="flex" flexDirection="row" overflow="hidden">
        <Categories
          activeCategory={activeCategory}
          onCategorySelect={handleCategorySelect}
          onClearFilters={handleClearFilters}
          searchTerm={searchTerm}
        />
        <Box flex={1} overflow="auto">
          {isCheckingOut ? (
            <Checkout cart={cart} onCartUpdate={onCartChange} />
          ) : (
            <Products onCartChange={onCartChange} filters={currentFilters} />
          )}
        </Box>
      </Box>

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
