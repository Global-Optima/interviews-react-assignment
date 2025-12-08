import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
} from '@mui/material';
import { HeavyComponent } from '../HeavyComponent.tsx';
import { UpdateSharp } from '@mui/icons-material';
import ProductItem from './ProductItem.tsx';
import { Product } from '../../App.tsx';

export interface ProductsProps {
  products: Product[];
  itemsPerRow: number;
  loaderRef: any;
  addToCart: (productId: number, quantity: number) => void;
  isLoading: boolean;
  fetchErrored: boolean;
  loadMore: () => void;
}

export const Products = ({
  products, 
  itemsPerRow, 
  loaderRef, 
  addToCart,
  isLoading,
  fetchErrored,
  loadMore,
}: ProductsProps) => {
  return (
    <Box sx={{overflowY: "scroll", width: "100%"}} height="100%">
      <Grid container spacing={2} p={2}>
        {products.map((product, i) => (
          <Grid item xs={12 / itemsPerRow} key={product.id} ref={i === products.length - itemsPerRow + 1 ? loaderRef : null}>
            {/* Do not remove this */}
            <HeavyComponent/>
            <ProductItem addToCart={addToCart} product={product}/>
          </Grid>
        ))}
      </Grid>
      {
        fetchErrored && !isLoading &&
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mb={40}
          >
            <Typography color="error" mb={1} textAlign="center">
              Fetching products errored
            </Typography>
            <Button startIcon={<UpdateSharp/>} variant="text" color="error" onClick={() => loadMore()}>
              Try again
            </Button>
          </Box>
      }
      {
        isLoading && 
          <Box display="flex" justifyContent="center" mb={40}>
            <CircularProgress />
          </Box>
      }
    </Box>
  );
};
