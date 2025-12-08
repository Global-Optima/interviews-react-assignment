import { useEffect, useState, useRef, useCallback, memo } from "react";
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
  Button,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { HeavyComponent } from "./HeavyComponent";

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
// i wrapper productitem in memo in order to prevent heavycomponent being re-rendered each time when we add product to card
// when we click add to cart, setproducts() turned on, so our Products is being changed; Product (with map) was parent of all carts and heavycomponents, so rerender was 200 each time
// memoization "checkhs" whether props are changed. if yes, re-render. no, go away
const ProductItem = memo(
  ({
    product,
    onAddToCart,
  }: {
    product: Product;
    onAddToCart: (id: number, qty: number) => void;
  }) => {
    return (
      <Grid item xs={12} sm={6} md={4}>
        {/* HeavyComponent is now isolated in this memoized component */}
        <HeavyComponent />
        <Card
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <CardMedia
            component="img"
            height="150"
            image={product.imageUrl}
            alt={product.name}
          />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h6" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </Typography>
          </CardContent>
          <CardActions>
            <Typography variant="h6" component="div" px={1}>
              ${product.price}
            </Typography>
            <Box flexGrow={1} />
            <Box
              position="relative"
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              {product.loading && (
                <Box
                  position="absolute"
                  left={0}
                  right={0}
                  top={0}
                  bottom={0}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  bgcolor="rgba(255,255,255,0.8)"
                  zIndex={1}
                >
                  <CircularProgress size={20} />
                </Box>
              )}
              <IconButton
                disabled={product.loading}
                aria-label="remove"
                size="small"
                onClick={() => onAddToCart(product.id, -1)}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Typography variant="body1" component="div" mx={1}>
                {product.itemInCart || 0}
              </Typography>

              <IconButton
                disabled={product.loading}
                aria-label="add"
                size="small"
                onClick={() => onAddToCart(product.id, 1)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      </Grid>
    );
  }
);

export const Products = ({
  onCartChange,
}: {
  onCartChange: (cart: Cart) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true); //state do we have more to load or not

  // oberservertarget is anchor for our obserber, which will asynchronously observe changes in  intersection of target element with an ancestor element (viewport in our code: root:null)
  const observerTarget = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 20;

  const fetchProducts = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/products?limit=${ITEMS_PER_PAGE}&page=${pageNum}`
      );
      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      if (data.products.length < ITEMS_PER_PAGE) {
        setHasMore(false); // no items to show
      }

      setProducts((prev) => {
        const newIds = new Set(data.products.map((p: Product) => p.id));
        const filteredPrev = prev.filter((p) => !newIds.has(p.id));
        return [...filteredPrev, ...data.products];
      });
    } catch (err) {
      setError("Unable to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // for initial load / pagination effect
  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  // infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { root: null, threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [hasMore, loading]);

  const handleAddToCart = useCallback(
    (productId: number, quantity: number) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? { ...product, loading: true } : product
        )
      );

      fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })
        .then(async (response) => {
          if (!response.ok) throw new Error("Cart update failed");

          const incomingCart = await response.json();

          const transformedCartItems = incomingCart.items.map(
            (item: { product: any; quantity: any }) => ({
              ...item.product,
              itemInCart: item.quantity,
              loading: false,
            })
          );

          const transformedCart = {
            items: transformedCartItems,
            totalPrice: incomingCart.totalPrice,
            totalItems: incomingCart.totalItems,
          };
          const newCartMap = new Map<number, Product>(
            transformedCartItems.map((item: { id: any }) => [item.id, item])
          );
          setProducts((prevProducts) => {
            return prevProducts.map((product) => {
              if (newCartMap.has(product.id)) {
                const newCartItem = newCartMap.get(product.id)!; // not null or undefined

                return {
                  ...product,
                  itemInCart: newCartItem.itemInCart,
                  loading: false,
                };
              } else {
                return {
                  ...product,
                  itemInCart: 0,
                  loading: false,
                };
              }
            });
          });

          onCartChange(transformedCart);
        })
        .catch(() => {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? { ...product, loading: false }
                : product
            )
          );
        });
    },
    [onCartChange]
  );

  return (
    <Box height="100%" display="flex" flexDirection="column">
      {error && (
        <Box p={2}>
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => fetchProducts(page)}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      )}

      <Box flexGrow={1} overflow="auto" p={2}>
        {products.length === 0 && !loading && !error ? (
          <Box textAlign="center" mt={4}>
            <Typography variant="h6" color="text.secondary">
              No products found.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {products.map((product) => (
              <ProductItem
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
              />
            ))}
          </Grid>
        )}

        {/* observable / spinner */}
        <Box
          ref={observerTarget}
          py={4}
          display="flex"
          justifyContent="center"
          width="100%"
        >
          {loading && <CircularProgress />}
          {!hasMore && products.length > 0 && (
            <Typography variant="caption">
              You've reached the end of the list.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};
