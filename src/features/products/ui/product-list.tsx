import { CircularProgress, Grid, Typography } from "@mui/material";
import { memo } from "react";
import { ProductCard } from "./product-card";
import { Product } from "../model/types";

interface ProductListProps {
  products: Product[];
  loading: boolean;
  allFetched: boolean;
  searchValue: string;
  searchedProducts: Product[];
}

const ProductListComponent = ({
  products,
  loading,
  allFetched,
  searchValue,
  searchedProducts
}: ProductListProps) => {

  return (
    <Grid container spacing={2} p={2}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}

      {loading && (
        <Grid
          item
          xs={4}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Grid>
      )}

      {allFetched && !searchValue && (
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body1" my={2}>
            All products are loaded.
          </Typography>
        </Grid>
      )}

      {searchValue && searchedProducts.length === 0 && !loading && (
        <Grid
          item
          xs={12}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="body1" my={2}>
            No products found for "{searchValue}"
          </Typography>
        </Grid>
      )}
    </Grid>
  );
};

export const ProductList = memo(ProductListComponent, (prev, next) => {
  return (
    prev.products.length === next.products.length &&
    prev.products === next.products && 
    prev.loading === next.loading &&
    prev.allFetched === next.allFetched &&
    prev.searchValue === next.searchValue &&
    prev.searchedProducts.length === next.searchedProducts.length
  );
});
