import { Cart, Products } from "./Products.tsx";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import SearchAppBar from "./SearchAppBar.tsx";
import { Categories } from "./Categories.tsx";
import { useState, useEffect } from "react";
import theme from "./theme";

function App() {
  const [cart, setCart] = useState<Cart>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const search = params.get("search");
    const category = params.get("category");

    if (search) setSearchQuery(search);
    if (category) setSelectedCategory(category);
  }, []);

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box height="100vh" display="flex" flexDirection="column">
        <SearchAppBar
          quantity={cart?.totalItems || 0}
          price={cart?.totalPrice || 0}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <Box flex={1} display="flex" flexDirection="row" overflow="hidden">
          <Categories
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <Box flex={1}>
            <Products
              onCartChange={onCartChange}
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onCategoriesExtracted={setCategories}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
