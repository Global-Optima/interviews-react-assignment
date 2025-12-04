import { useEffect, useState, useCallback, useRef } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { HeavyComponent } from "./HeavyComponent.tsx";
import { Cart, Product } from "../types/checkout.ts";

export const Products = ({
  onCartChange,
}: {
  onCartChange: (cart: Cart) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const loadProducts = useCallback(async () => {
    if (loadingProducts || !hasMore) return;

    try {
      setLoadingProducts(true);
      const res = await fetch(`/products?limit=20&page=${page}`);

      if (!res.ok) throw new Error("Failed to load products");

      const data = await res.json();

      setProducts((prev) => [...prev, ...data.products]);
      setHasMore(data.products.length > 0);
      setPage((prev) => prev + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoadingProducts(false);
      setLoadingInitial(false);
    }
  }, [page, loadingProducts, hasMore]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) loadProducts();
    });

    observerRef.current.observe(loadMoreRef.current);
  }, [loadMoreRef, loadProducts]);

  async function addToCart(productId: number, quantity: number) {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, loading: true } : p))
    );

    const res = await fetch("/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!res.ok) {
      alert("Failed to update cart.");
      return;
    }

    const cart = await res.json();

    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? {
              ...p,
              itemInCart: (p.itemInCart || 0) + quantity,
              loading: false,
            }
          : p
      )
    );

    onCartChange(cart);
  }

  if (loadingInitial)
    return (
      <Box display="flex" justifyContent="center" pt={4}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (products.length === 0)
    return (
      <Box p={2}>
        <Alert severity="info">No products available.</Alert>
      </Box>
    );

  return (
    <Box overflow="scroll" height="100%">
      <Grid container spacing={2} p={2}>
        {products.map((product) => (
          <Grid item xs={4} key={product.id}>
            {/* Do not remove this */}
            <HeavyComponent />
            <Card style={{ width: "100%" }}>
              <CardMedia
                component="img"
                height="150"
                image={product.imageUrl}
              />
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </Typography>
              </CardContent>

              <CardActions>
                <Typography variant="h6">${product.price}</Typography>
                <Box flexGrow={1} />

                <Box position="relative" display="flex" alignItems="center">
                  {product.loading && (
                    <CircularProgress
                      size={22}
                      style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                      }}
                    />
                  )}

                  <IconButton
                    disabled={product.loading}
                    size="small"
                    onClick={() => addToCart(product.id, -1)}
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>

                  <Typography mx={1}>{product.itemInCart || 0}</Typography>

                  <IconButton
                    disabled={product.loading}
                    size="small"
                    onClick={() => addToCart(product.id, 1)}
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box ref={loadMoreRef} height={60}>
        {loadingProducts && (
          <Box display="flex" justifyContent="center" py={3}>
            <CircularProgress />
          </Box>
        )}
      </Box>
    </Box>
  );
};
