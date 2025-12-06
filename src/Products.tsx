import { useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import { List, AutoSizer } from 'react-virtualized';
import { ProductCard } from './ProductCard';

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

const ITEMS_PER_ROW = 3;
const ROW_HEIGHT = 320;

export const Products = ({
  onCartChange,
}: {
  onCartChange: (cart: Cart) => void;
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/products?limit=200')
      .then((response) => response.json())
      .then((data) => setProducts(data.products));
  }, []);

  const addToCart = useCallback(
    (productId: number, quantity: number) => {
      setProducts(
        products.map((product) => {
          if (product.id === productId) {
            return {
              ...product,
              loading: true,
            };
          }
          return product;
        })
      );

      fetch('/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      }).then(async (response) => {
        if (response.ok) {
          const cart = await response.json();

          setProducts((currentProducts) =>
            currentProducts.map((product) => {
              if (product.id === productId) {
                return {
                  ...product,
                  itemInCart: (product.itemInCart || 0) + quantity,
                  loading: false,
                };
              }
              return product;
            })
          );

          onCartChange(cart);
        }
      });
    },
    [onCartChange, products]
  );

  const rowCount = Math.ceil(products.length / ITEMS_PER_ROW);

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
