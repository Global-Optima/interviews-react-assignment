import { Box, CircularProgress, Grid, Typography } from "@mui/material";
import { useInfiniteProducts } from "../../features/products/hooks/use-infinite-products";
import { ProductCard } from "../../features/products/ui/product-card";
import { useCart } from "../../features/cart/hooks/use-cart";
import SearchAppBar from "../../SearchAppBar";
import { Categories } from "../../Categories";
import { useProductSearch } from "../../features/products/hooks/use-product-search";

export const ShopPage = () => {
  const { products, loading, allFetched } = useInfiniteProducts();
  const { addToCart, isProductLoading, getProductQuantity } = useCart();
  const {searchValue, setSearchValue, searchedProducts} = useProductSearch({unfilteredProducts: products});

  return (
    <Box>
      <SearchAppBar onSearchChange={setSearchValue} searchValue={searchValue} />
      <Box flex={1} display="flex" flexDirection="row">
        <Categories />
        <Box flex={1}>
          <Box overflow="scroll" height="100%">
            <Grid container spacing={2} p={2}>
              {searchedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={(quantity) => {
                    console.log("Adding to cart:", product.id, quantity);
                    addToCart(product.id, quantity);
                  }}
                  isLoading={isProductLoading(product.id)}
                  cartQuantity={getProductQuantity(product.id)}
                />
              ))}

              {loading && (
                <Grid
                  item
                  xs={4}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress></CircularProgress>
                </Grid>
              )}

              {allFetched && (
                <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" component="div" my={2}>
                    All products are loaded.
                  </Typography>
                </Grid>
              )}

              {searchValue && searchedProducts.length === 0 && !loading && (
                      <Grid
                  item
                  xs={12}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body1" component="div" my={2}>
                    No products found for "{searchValue}"
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
