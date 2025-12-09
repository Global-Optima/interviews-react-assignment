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
import React, { useEffect, useState } from 'react';

export interface ProductsProps {
  products: Product[];
  itemsPerRow: number;
  loaderRef: any;
  addToCart: (productId: number, quantity: number) => void;
  isLoading: boolean;
  fetchErrored: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  loadMore: () => void;
}

export const CARD_HEIGHT = 320 + 16; // spacing from MUI grid

export const Products = React.memo(({
  products, 
  itemsPerRow, 
  loaderRef, 
  addToCart,
  isLoading,
  fetchErrored,
  containerRef,
  loadMore,
}: ProductsProps) => {
  const [range, setRange] = useState({ start: 0, end: 24 });

  const { start, end } = range;
  const visibleProducts = products.slice(start, end);

  const topPadding = Math.floor(start / itemsPerRow) * CARD_HEIGHT;
  const bottomPadding = Math.ceil((products.length - end) / itemsPerRow) * CARD_HEIGHT;

  const onScroll = () => {
    const container = containerRef.current;
    if (!container) return;

    const scrollTop = container.scrollTop;
    const viewHeight = container.clientHeight;

    const rowsPerScreen = Math.ceil(viewHeight / CARD_HEIGHT);
    const currentRow = Math.floor(scrollTop / CARD_HEIGHT);

    const start = currentRow * itemsPerRow;
    const end = (currentRow + rowsPerScreen) * itemsPerRow;

    setRange({
      start: Math.max(0, start),
      end: Math.min(products.length, end),
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [products.length, itemsPerRow]);

  return (
    <Box ref={containerRef} sx={{overflowY: "scroll", width: "100%"}} height="100%">
      <Box style={{ height: topPadding }} />
      <Grid container spacing={2} p={2}>
        {visibleProducts.map((product) => {
          return (
            <Grid item xs={12 / itemsPerRow} key={product.id}>
              <ProductItem addToCart={addToCart} product={product}/>
              {/* Do not remove this */}
              <HeavyComponent/>
            </Grid>
        )})}
      </Grid>
      <Box style={{ height: bottomPadding }} />
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
      { products.length !== 0 && <Box ref={loaderRef} sx={{height: 50}} display="flex"/> }
    </Box>
  );
});
