import { Products } from './components/products-page/Products.tsx';
import { Box, CssBaseline } from '@mui/material';
import SearchAppBar from './components/SearchAppBar.tsx';
import { Categories } from './components/products-page/Categories.tsx';
import { useEffect, useRef, useState,  } from 'react';
import { useInfiniteScroll } from './hooks/useInfiniteScroll.ts';
import { useDebounce } from './hooks/useDebounce.ts';
import { ProductFilters } from './components/products-page/ProductFilters.tsx';
import CheckoutWizard from './components/CheckoutWizard.tsx';
import { motion, AnimatePresence } from "framer-motion";
import { flushSync } from "react-dom";

export const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Audio', 'Gaming', 'Wearables', 'Cameras'];

export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
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
  const abortRef = useRef<AbortController | null>(null);
  const containerRef = useRef(null);
  const locationParams = new URLSearchParams(window.location.search);
  const [searchText, setSearchText] = useState(locationParams.get("q") || "");
  const [category, setCategory] = useState<string | null>(locationParams.get("category") || null);
  const [cart, setCart] = useState<Cart>();
  const [page, setPage] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [fetchErrored, setFetchErrored] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerRow, setItemsPerRow] = useState(() => {
    const width = window.innerWidth;
    if (width < 600) return 1;
    if (width < 900) return 2;
    return 3;
  });
  const [isLoading, setIsLoading] = useState(true);
  const initialPriceRange: [number, number] = (() => {
    const value = locationParams.get("priceRange");
    if (!value) return [0, Infinity];
    try {
      const arr = JSON.parse(value);
      if (Array.isArray(arr) && arr.length === 2) {
        const result = [Number(arr[0]), Number(arr[1])] as [number, number];
        if (!result.some(isNaN)) return result;
      }
      return [0, Infinity];
    } catch {
      return [0, Infinity];
    }
  })();
  const [priceRange, setPriceRange] = useState<[number, number]>(initialPriceRange);
  const [sortBy, setSortBy] = useState<string>(locationParams.get("sortBy") || "name");
  const initialSortOrder = (() => {
    const value = locationParams.get("sortOrder");
    return value === "asc" || value === "desc" ? value : "asc";
  })();
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">(initialSortOrder);
  const [totalResults, setTotalResults] = useState<number | null>(null);
  const [maxPriceRange, setMaxPriceChange] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(locationParams.get("checkout") === 'true');
  
  const loadMore = async (replace = false) => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;
    setIsLoading(true);
    if (replace) {
      setProducts([]);
      setPage(0);
      setTotalResults(null);
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
      const res = await fetch(`/products?${params.toString()}`, {
        signal: controller.signal
      });
      const { products: newProducts, hasMore, total, maxPriceChange } = await res.json();
      setHasMore(hasMore);
      setMaxPriceChange(Math.max(1000, maxPriceChange));
      setTotalResults(total || 0);
      flushSync(() => {
        setProducts(replace ? newProducts : [...products, ...newProducts]);
      });
      setIsLoading(false);
      setPage(p => replace ? 1 : p + 1);
      setFetchErrored(false);
    } catch (e: any) {
      if (e.name === "AbortError") return;
      console.error("Could not fetch products:", e);
      setFetchErrored(true);
      setHasMore(false);
      setIsLoading(false);
    }
  };

  const { loaderRef } = useInfiniteScroll({
    loadMore,
    hasMore,
    isLoading,
    containerRef,
  });

  const updateQuantity = (productId: number, delta: number) => {
    setCart(p => {
      const prev: Cart = (!p || Object.keys(p).length === 0) ? {items: [], totalPrice: 0, totalItems: 0} : p;
      const existingItem = prev.items.find(p => p.id === productId);
      let newItems: Product[];
      if (existingItem) {
        newItems = prev.items.map(p =>
          p.id === productId ? { ...p, itemInCart: (p.itemInCart || 0) + delta } : p
        );
      } else {
        const productInProducts = products.find(p => p.id === productId);
        const newItem: Product = productInProducts
          ? { ...productInProducts, itemInCart: delta }
          : { id: productId, name: '', imageUrl: '', price: 0, category: '', itemInCart: delta };
        newItems = [...prev.items, newItem];
      }
      const filteredItems = newItems.filter(v => v.itemInCart > 0);
      const totalItems = filteredItems.reduce((sum, p) => sum + (p.itemInCart || 0), 0);
      const totalPrice = filteredItems.reduce((sum, p) => sum + (p.price * (p.itemInCart || 0)), 0);
      return { ...prev, items: filteredItems, totalItems, totalPrice };
    });
  }

  function removeItem(id: number) {
    setCart((p) => {
        const prev: Cart = (!p || Object.keys(p).length === 0) ? {items: [], totalPrice: 0, totalItems: 0} : p;
        const filteredItems = prev.items.filter((it) => it.id !== id);
        const totalItems = filteredItems.reduce((sum, p) => sum + (p.itemInCart || 0), 0);
        const totalPrice = filteredItems.reduce((sum, p) => sum + (p.price * (p.itemInCart || 0)), 0);
        return { ...prev, items: filteredItems, totalItems, totalPrice };
      }
    );
  }

  function resetCart() {
    setCart({items: [], totalPrice: 0, totalItems: 0});
  }

  function addToCart(productId: number, quantity: number) {
    setProducts(prev =>
      prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            itemInCart: (product.itemInCart || 0) + quantity,
          };
        }
        return product;
      })
    );
    updateQuantity(productId, quantity);
    fetch('/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    })
    .then(async response => {
      if (!response.ok) throw new Error("Failed to update cart");
    })
    .catch(() => {
      setProducts(prev =>
        prev.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              itemInCart: (product.itemInCart || 0) - quantity,
            };
          }
          return product;
        })
      );
      setCart(prev => {
        if (!prev) return prev;
        const newItems = prev.items.map(p =>
          p.id === productId ? { ...p, itemInCart: (p.itemInCart || 0) - quantity } : p
        );
        const totalItems = newItems.reduce((sum, p) => sum + (p.itemInCart || 0), 0);
        const totalPrice = newItems.reduce((sum, p) => sum + (p.price * (p.itemInCart || 0)), 0);
        return { ...prev, items: newItems, totalItems, totalPrice };
      });
    });
  }

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchText) params.set("q", searchText);
    if (category) params.set("category", category);
    params.set("checkout", String(checkoutOpen));
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("priceRange", JSON.stringify(priceRange.map(String)));
    const qs = params.toString();
    const newUrl = qs ? `?${qs}` : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [searchText, category, checkoutOpen, sortBy, sortOrder, priceRange]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) setItemsPerRow(1);
      else if (width < 900) setItemsPerRow(2);
      else setItemsPerRow(3);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetch('/cart')
      .then(response => response.json())
      .then(cart => setCart(cart as Cart));
  }, []);

  const {debounced: debouncedSearch, setDebounced} = useDebounce(searchText, 500);
  const {debounced: debouncedPriceRange, setDebounced: setDebouncedPriceRange} = useDebounce(priceRange, 500);
  const {debounced: debouncedCheckoutOpen, setDebounced: setDebouncedCheckoutOpen} = useDebounce(checkoutOpen, 500);

  const handleOpenCheckout = () => {
    setCheckoutOpen(true);
    setDebouncedCheckoutOpen(true);
  }

  const handleCloseCheckout= () => {
    setTotalResults(null);
    setIsLoading(true);
    setCheckoutOpen(false);
  }

  useEffect(() => {
    if (!debouncedCheckoutOpen) loadMore(true);
  }, [category, debouncedSearch, debouncedPriceRange, sortBy, sortOrder, debouncedCheckoutOpen]);

  return (
    <Box height="100vh" display="flex" flexDirection="column" overflow="hidden">
      <CssBaseline/>
      <SearchAppBar 
        searchText={searchText} 
        setSearchText={setSearchText} 
        checkoutOpen={checkoutOpen}
        handleOpenCheckout={handleOpenCheckout} 
        handleCloseCheckout={handleCloseCheckout} 
        quantity={cart?.totalItems || 0} 
        price={cart?.totalPrice || 0}/>
      <AnimatePresence>
        {checkoutOpen &&
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            style={{ width: "100vw", height: "100vh" }}
          >
            <CheckoutWizard 
              cart={cart} 
              removeItem={removeItem} 
              addToCart={addToCart} 
              resetCart={resetCart} 
              handleCloseCheckout={handleCloseCheckout}
            />
          </motion.div> }
      </AnimatePresence>
      {!checkoutOpen && (
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
            setCategory={setCategory}
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
              containerRef={containerRef}
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
      )}
    </Box>
  );
}

export default App;
