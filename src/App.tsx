import { Products } from './components/products-page/Products.tsx';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './components/SearchAppBar.tsx';
import { Categories } from './components/products-page/Categories.tsx';
import { useEffect, useState,  } from 'react';
import { useInfiniteScroll } from './hooks/useInfiniteScroll.ts';
import { useDebounce } from './hooks/useDebounce.ts';
import { ProductFilters } from './components/products-page/ProductFilters.tsx';

export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
}

export type Cart = {
  items: Product[];
  totalPrice: number;
  totalItems: number;
}

export interface ProductListParams {
  page?: string,
  limit?: string,
  category?: string,
  q?: string,
}

function App() {
  const locationParams = new URLSearchParams(window.location.search);
  const [searchText, setSearchText] = useState(locationParams.get("q") || "");
  const [category, setCategory] = useState<string | null>(locationParams.get("category") || null);
  const [cart, setCart] = useState<Cart>();
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchErrored, setFetchErrored] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerRow] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, Infinity]);
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [totalResults, setTotalResults] = useState(0);
  const [maxPriceRange, setMaxPriceChange] = useState(0);
  
const loadMore = async (replace = false) => {
  setIsLoading(true);
  if (replace) {
    setProducts([]);
    setPage(0);
    setTotalResults(0);
  }
  try {
    // 30% error chance uncomment this code to test the retry button feature
    // if (Math.random() < 0.3) { 
    //   throw new Error("Random test error"); 
    // }
    const params = new URLSearchParams({
      page: String(replace ? 0 : page),
      limit: String(itemsPerRow * 6),
      sortOrder,
      sortBy,
      minPrice: String(priceRange[0]),
      maxPrice: String(priceRange[1]),
    });
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (category) params.set("category", category);
    const res = await fetch(`/products?${params.toString()}`);
    const { products: newProducts, hasMore, total, maxPriceChange } = await res.json();
    setHasMore(hasMore);
    setMaxPriceChange(Math.max(1000, maxPriceChange));
    setTotalResults(total || 0);
    setProducts(prev => replace ? newProducts : [...prev, ...newProducts]);
    setPage(p => replace ? 1 : p + 1);
    setFetchErrored(false);
  } catch (e) {
    console.error("Could not fetch products:", e);
    setFetchErrored(true);
    setHasMore(false);
  } finally {
    setIsLoading(false);
  }
};

  const { loaderRef } = useInfiniteScroll({
    loadMore,
    hasMore,
    threshold: 0,
    isLoading,
  });

  function onCartChange(cart: Cart) {
    setCart(cart);
  }
  
  function addToCart(productId: number, quantity: number) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          loading: true,
        };
      }
      return product;
    }));
    fetch('/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    }).then(async response => {
      if (response.ok) {
        const cart = await response.json();
        setProducts(products.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              itemInCart: (product.itemInCart || 0) + quantity,
              loading: false,
            };
          }
          return product;
        }));
        onCartChange(cart);
      }
    });
  }

  useEffect(() => {
    const filter = new URLSearchParams();
    if (searchText) filter.set("q", searchText);
    if (category) filter.set("category", category);
    const qs = filter.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    window.history.pushState({}, "", newUrl);
  }, [searchText, category]);

  const {debounced: debouncedSearch, setDebounced} = useDebounce(searchText, 500);
  const {debounced: debouncedPriceRange, setDebounced: setDebouncedPriceRange} = useDebounce(priceRange, 500);

  useEffect(() => {
    loadMore(true);
  }, [category, debouncedSearch, debouncedPriceRange, sortBy, sortOrder]);

  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline/>
      <SearchAppBar searchText={searchText} setSearchText={setSearchText} quantity={cart?.totalItems || 0} price={cart?.totalPrice || 0}/>

      <Box flex={1} display="flex" minHeight={0} flexDirection="row">
        <Categories category={category} setCategory={setCategory} />
        <Box flex={1} display="flex" minHeight={0} flexDirection="column">
        <ProductFilters
          category={category}
          searchText={debouncedSearch}
          priceRange={priceRange}
          minPrice={priceRange[0]}
          maxPrice={priceRange[1]}
          sortBy={sortBy}
          sortOrder={sortOrder}
          totalResults={totalResults}
          maxPriceChange={maxPriceRange}
          onPriceRangeChange={setPriceRange}
          onSortChange={(field, order) => { setSortBy(field); setSortOrder(order); }}
          clearAll={() => {
            setDebounced("");
            setSearchText("");
            setCategory(null);
            setDebouncedPriceRange([0, Infinity]);
            setPriceRange([0, Infinity]);
            setSortBy("name");
            setSortOrder("asc");
          }}
          clearSearch={() => {
            setDebounced("");
            setSearchText("");
          }}
          clearCategory={() => setCategory(null)}
          clearPrice={() => {
            setDebouncedPriceRange([0, Infinity]);
            setPriceRange([0, Infinity]);
          }}
        />
          <Products 
            addToCart={addToCart} 
            itemsPerRow={itemsPerRow}
            products={products}
            isLoading={isLoading}
            loaderRef={loaderRef}
            fetchErrored={fetchErrored}
            loadMore={loadMore}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
