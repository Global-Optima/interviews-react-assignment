import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import {
  Box,
  Select,
  MenuItem,
  Button,
  Chip,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { HeavyComponent } from "./HeavyComponent.tsx";

export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
};

export type Cart = {
  items: Product[];
  totalPrice: number;
  totalItems: number;
};

type SortOption =
  | "default"
  | "price-asc"
  | "price-desc"
  | "name-asc"
  | "name-desc";

const PRODUCTS_PER_PAGE = 20;
const DEBOUNCE_DELAY = 300;

interface ProductsProps {
  onCartChange: (cart: Cart) => void;
  searchQuery: string;
  selectedCategory: string;
  onCategoriesExtracted?: (categories: string[]) => void;
}

const ProductCard = memo(
  ({
    product,
    onAddToCart,
  }: {
    product: Product;
    onAddToCart: (id: number, qty: number) => void;
  }) => {
    return (
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 1,
          boxShadow: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          transition: "all 0.2s",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: 3,
          },
        }}
      >
        <HeavyComponent />

        <img
          src={
            product.imageUrl ||
            "https://via.placeholder.com/300x150?text=No+Image"
          }
          alt={product.name}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            background: "#e0e0e0",
          }}
        />
        <Box p={2} flex={1}>
          <Typography variant="h6" gutterBottom>
            {product.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={1}
          >
            {product.category}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            ${product.price}
          </Typography>
          <Box position="relative" display="flex" alignItems="center" gap={1}>
            {product.loading && (
              <Box
                sx={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(255,255,255,0.8)",
                  zIndex: 1,
                }}
              >
                <CircularProgress size={20} />
              </Box>
            )}
            <button
              disabled={product.loading || (product.itemInCart || 0) === 0}
              onClick={() => onAddToCart(product.id, -1)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #ddd",
                background: "white",
                cursor:
                  product.loading || (product.itemInCart || 0) === 0
                    ? "not-allowed"
                    : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity:
                  product.loading || (product.itemInCart || 0) === 0 ? 0.5 : 1,
              }}
            >
              −
            </button>
            <span
              style={{
                minWidth: "24px",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              {product.itemInCart || 0}
            </span>
            <button
              disabled={product.loading}
              onClick={() => onAddToCart(product.id, 1)}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "1px solid #ddd",
                background: "white",
                cursor: product.loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: product.loading ? 0.5 : 1,
              }}
            >
              +
            </button>
          </Box>
        </Box>
      </Box>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.product.itemInCart === nextProps.product.itemInCart &&
      prevProps.product.loading === nextProps.product.loading &&
      prevProps.product.price === nextProps.product.price
    );
  }
);

ProductCard.displayName = "ProductCard";

export const Products = ({
  onCartChange,
  searchQuery,
  selectedCategory,
  onCategoriesExtracted,
}: ProductsProps) => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const observerTarget = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (allProducts.length > 0 && onCategoriesExtracted) {
      const cats = Array.from(
        new Set(allProducts.map((p) => p.category))
      ).sort();
      onCategoriesExtracted(cats);
    }
  }, [allProducts, onCategoriesExtracted]);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, DEBOUNCE_DELAY);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceRange[0] > 0) params.set("minPrice", priceRange[0].toString());
    if (priceRange[1] < 5000) params.set("maxPrice", priceRange[1].toString());
    if (sortBy !== "default") params.set("sort", sortBy);

    const newUrl = params.toString()
      ? `?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  }, [debouncedSearch, selectedCategory, priceRange, sortBy]);

  const filteredProducts = useMemo(() => {
    let result = allProducts;

    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.category === selectedCategory);
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-asc":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result = [...result].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result = [...result].sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [allProducts, debouncedSearch, selectedCategory, priceRange, sortBy]);

  const hasActiveFilters =
    debouncedSearch ||
    selectedCategory ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000 ||
    sortBy !== "default";

  const fetchProducts = useCallback(
    async (pageNum: number) => {
      if (loading) return;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      setError(null);

      try {
        const skip = pageNum * PRODUCTS_PER_PAGE;
        const response = await fetch(
          `/products?limit=${PRODUCTS_PER_PAGE}&skip=${skip}`,
          { signal: abortController.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (data.products.length < PRODUCTS_PER_PAGE) {
          setHasMore(false);
        }

        setAllProducts((prev) => [...prev, ...data.products]);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        setError(
          err instanceof Error ? err.message : "Failed to load products"
        );
        setHasMore(false);
      } finally {
        setLoading(false);
        abortControllerRef.current = null;
      }
    },
    [loading]
  );

  useEffect(() => {
    fetchProducts(0);

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => {
            const nextPage = prev + 1;
            fetchProducts(nextPage);
            return nextPage;
          });
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, loading, fetchProducts]);

  const addToCart = useCallback(
    async (productId: number, quantity: number) => {
      setAllProducts((prev) =>
        prev.map((product) =>
          product.id === productId
            ? {
                ...product,
                loading: true,
                itemInCart: Math.max(0, (product.itemInCart || 0) + quantity),
              }
            : product
        )
      );

      try {
        const response = await fetch("/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productId, quantity }),
        });

        if (!response.ok) {
          throw new Error("Failed to update cart");
        }

        const cart = await response.json();

        setAllProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  itemInCart:
                    cart.items.find(
                      (item: { id: number; quantity: number }) =>
                        item.id === productId
                    )?.quantity || 0,
                  loading: false,
                }
              : product
          )
        );

        onCartChange(cart);
      } catch (err) {
        setAllProducts((prev) =>
          prev.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  itemInCart: Math.max(0, (product.itemInCart || 0) - quantity),
                  loading: false,
                }
              : product
          )
        );

        setError("Failed to update cart. Please try again.");
      }
    },
    [onCartChange]
  );

  const clearFilters = useCallback(() => {
    setPriceRange([0, 5000]);
    setSortBy("default");
  }, []);

  const handleAddToCart = useCallback(
    (productId: number, quantity: number) => {
      addToCart(productId, quantity);
    },
    [addToCart]
  );

  return (
    <Box height="100%" display="flex" flexDirection="column">
      <Box
        sx={{
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
          p: 2,
        }}
      >
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            size="small"
            sx={{ minWidth: 160 }}
          >
            <MenuItem value="default">Sort by</MenuItem>
            <MenuItem value="price-asc">Price: Low to High</MenuItem>
            <MenuItem value="price-desc">Price: High to Low</MenuItem>
            <MenuItem value="name-asc">Name: A to Z</MenuItem>
            <MenuItem value="name-desc">Name: Z to A</MenuItem>
          </Select>

          <TextField
            type="number"
            label="Min Price"
            value={priceRange[0]}
            onChange={(e) =>
              setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])
            }
            size="small"
            sx={{ width: 100 }}
          />

          <TextField
            type="number"
            label="Max Price"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])
            }
            size="small"
            sx={{ width: 100 }}
          />

          {hasActiveFilters && (
            <Button
              variant="contained"
              color="error"
              onClick={clearFilters}
              size="small"
            >
              Clear Filters
            </Button>
          )}

          <Typography
            variant="body2"
            sx={{ ml: "auto", color: "text.secondary" }}
          >
            <strong>{filteredProducts.length}</strong> products
          </Typography>
        </Box>

        {hasActiveFilters && (
          <Box display="flex" gap={1} flexWrap="wrap" mt={1.5}>
            {debouncedSearch && (
              <Chip
                label={`Search: "${debouncedSearch}"`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {selectedCategory && (
              <Chip
                label={`Category: ${selectedCategory}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {(priceRange[0] > 0 || priceRange[1] < 5000) && (
              <Chip
                label={`$${priceRange[0]} - $${priceRange[1]}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
            {sortBy !== "default" && (
              <Chip
                label="Sorted"
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </Box>

      <Box flex={1} sx={{ overflow: "auto", bgcolor: "#f5f5f5" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 2,
            p: 2,
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </Box>

        {error && (
          <Box
            m={2}
            p={1.5}
            bgcolor="#fee"
            border="1px solid #fcc"
            borderRadius={1}
            color="#c33"
          >
            {error}
            <button
              onClick={() => setError(null)}
              style={{
                marginLeft: "12px",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Dismiss
            </button>
          </Box>
        )}

        {loading && (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        )}

        {!loading && filteredProducts.length === 0 && !error && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            minHeight={300}
            color="text.secondary"
          >
            <Typography variant="h5">No products found</Typography>
            {hasActiveFilters && (
              <Button variant="contained" onClick={clearFilters} sx={{ mt: 2 }}>
                Clear all filters
              </Button>
            )}
          </Box>
        )}

        {!hasMore && allProducts.length > 0 && (
          <Box
            display="flex"
            justifyContent="center"
            p={4}
            color="text.secondary"
          >
            <Typography>End of catalog</Typography>
          </Box>
        )}

        <div ref={observerTarget} style={{ height: "20px" }} />
      </Box>
    </Box>
  );
};
