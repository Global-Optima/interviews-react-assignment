import { Cart } from "./types/Product.types.tsx";
import { Products } from "./Products.tsx";
import { Box, CssBaseline } from "@mui/material";
import SearchAppBar from "./SearchAppBar.tsx";
import { Categories } from "./Categories.tsx";
import { useEffect, useState } from "react";
import { useDebouncedValue } from "./hooks/useDebouncedValue";

function App() {
  const [cart, setCart] = useState<Cart>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 300);

  function onCartChange(cart: Cart) {
    setCart(cart);
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialSearch = params.get("q") || "";
    const initialCategory = params.get("category");
    setSearch(initialSearch);
    setCategory(initialCategory);
  }, []);


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }

    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    const query = params.toString();
    const newUrl = query
      ? `${window.location.pathname}?${query}`
      : window.location.pathname;

    window.history.replaceState(null, "", newUrl);
  }, [debouncedSearch, category]);

  const handleClearFilters = () => {
    setSearch("");
    setCategory(null);
  };

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar
        quantity={cart?.totalItems || 0}
        price={cart?.totalPrice || 0}
        search={search}
        activeCategory={category}
        onSearchChange={setSearch}
        onClearFilters={handleClearFilters}
      />
      <Box flex={1} display="flex" flexDirection="row">
        <Categories
          activeCategory={category}
          onCategoryChange={(cat) =>
            setCategory((prev) => (prev === cat ? null : cat))
          }
        />
        <Box flex={1}>
          <Products
            onCartChange={onCartChange}
            search={debouncedSearch}
            category={category}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
