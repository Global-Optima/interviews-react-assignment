import { useEffect } from 'react';
import { Box, Grid } from '@mui/material';
import { List, AutoSizer } from 'react-virtualized';
import { ProductCard } from './ProductCard';
import { Product } from '../types/types';
import { AddToCart, SetProducts } from '../hooks/useCart';

const ITEMS_PER_ROW = 3;
const ROW_HEIGHT = 320;

export const Products = ({
  products,
  setProducts,
  addToCart,
}: {
  products: Product[];
  setProducts: SetProducts;
  addToCart: AddToCart;
}) => {
  const rowCount = Math.ceil(products.length / ITEMS_PER_ROW);

  useEffect(() => {
    fetch('/products?limit=200')
      .then((response) => response.json())
      .then((data) => setProducts(data.products));
  }, []);

  const rowRenderer = ({
    index,
    key,
    style,
  }: {
    index: number;
    key: React.Key;
    style: React.CSSProperties | undefined;
  }) => {
    const startIdx = index * ITEMS_PER_ROW;
    const rowProducts = products.slice(startIdx, startIdx + ITEMS_PER_ROW);

    return (
      <div key={key} style={style}>
        <Grid container spacing={2} sx={{ px: 2, py: 1 }}>
          {rowProducts.map((product) => (
            <Grid item xs={4} key={product.id}>
              <ProductCard product={product} addToCart={addToCart} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  return (
    <Box height='100%' width='100%'>
      <AutoSizer>
        {({ height, width }) => (
          <List
            width={width}
            height={height}
            rowCount={rowCount}
            rowHeight={ROW_HEIGHT}
            rowRenderer={rowRenderer}
            overscanRowCount={3}
          />
        )}
      </AutoSizer>
    </Box>
  );
};
