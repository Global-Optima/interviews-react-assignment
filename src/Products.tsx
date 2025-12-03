import { useCallback, memo } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { HeavyComponent } from "./HeavyComponent.tsx";
import { ProductCard } from "./components/ProductCard.tsx";
import { Cart, Product } from "./types/Product.types.ts";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";
import { useProducts } from "./hooks/useProducts";

export const Products = ({
  onCartChange,
  search,
  category,
}: {
  onCartChange: (cart: Cart) => void;
  search: string;
  category: string | null;
}) => {
  const { products, setProducts, loading, hasMore, error, total, loadMore } =
    useProducts(search, category);

  const addToCart = useCallback(
    (productId: number, quantity: number) => {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId
            ? {
                ...product,
                loading: true,
    
                itemInCart: Math.max(
                  0,
                  (product.itemInCart || 0) + quantity
                ),
              }
            : product
        )
      );

      fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      })
        .then(async (response) => {
          if (!response.ok) {
            throw new Error("Failed to add item to cart");
          }
          return response.json();
        })
        .then((cart: Cart) => {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    loading: false,
                  }
                : product
            )
          );
          onCartChange(cart);
        })
        .catch(() => {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? {
                    ...product,
                    loading: false,
     
                    itemInCart: Math.max(
                      0,
                      (product.itemInCart || 0) - quantity
                    ),
                  }
                : product
            )
          );
        });
    },
    [setProducts, onCartChange]
  );

  const loaderRef = useInfiniteScroll({
    hasMore,
    loading,
    onLoadMore: loadMore,
  });

  const ProductRow = memo(
    ({ product, addToCart }: ProductRowProps) => (
      <Grid item xs={4}>
        {/* Do not remove this */}
        <HeavyComponent />
        <ProductCard product={product} addToCart={addToCart} />
      </Grid>
    )
  );

  return (
    <Box overflow="scroll" height="100%">
      {!error && search && (
        <Box px={2} pt={1}>
          <Typography variant="subtitle2">
            {total} result{total === 1 ? "" : "s"} for &quot;{search}&quot;
          </Typography>
        </Box>
      )}

      {!loading && products.length === 0 && !error && (
        <Typography textAlign="center" mt={4}>No products found.</Typography>
      )}

      {error && (
        <Box marginTop="40px" textAlign="center">
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Grid container spacing={2} p={2}>
        {products.map((product) => (
          <ProductRow
            key={product.id}
            product={product}
            addToCart={addToCart}
          />
        ))}
      </Grid>

      {!error && <div ref={loaderRef} style={{ height: 40 }} />}

      {loading && (
        <Typography textAlign="center">Loading...</Typography>
      )}

      {!loading && !hasMore && !error && products.length > 0 && (
        <Typography textAlign="center">No more products.</Typography>
      )}
    </Box>
  );
};

interface ProductRowProps {
  product: Product;
  addToCart: (productId: number, quantity: number) => void;
}
