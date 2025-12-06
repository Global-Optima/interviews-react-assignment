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
  const rowCount = Math.ceil(products.length / ITEMS_PER_ROW);

  useEffect(() => {
    fetch('/products?limit=200')
      .then((response) => response.json())
      .then((data) => setProducts(data.products));
  }, []);

  const calculateOptimisticCart = useCallback(
    (updatedProducts: Product[]): Cart => {
      const items = updatedProducts.filter((p) => p.itemInCart > 0);
      const totalItems = items.reduce((sum, p) => sum + p.itemInCart, 0);
      const totalPrice = items.reduce(
        (sum, p) => sum + p.price * p.itemInCart,
        0
      );

      return { items, totalItems, totalPrice };
    },
    []
  );

  const recalculateOnError = useCallback(
    (productId: number, quantity: number) => {
      // Rollback on network error
      setProducts((currentProducts) =>
        currentProducts.map((product) => {
          if (product.id === productId) {
            return {
              ...product,
              itemInCart: Math.max(0, (product.itemInCart || 0) - quantity),
              loading: false,
            };
          }
          return product;
        })
      );

      // Recalculate cart after rollback
      setProducts((rolledBackProducts) => {
        const rolledBackCart = calculateOptimisticCart(rolledBackProducts);
        onCartChange(rolledBackCart);
        return rolledBackProducts;
      });
    },
    []
  );

  const addToCart = useCallback(
    (productId: number, quantity: number) => {
      const updatedProducts = products.map((product) => {
        if (product.id === productId) {
          return {
            ...product,
            itemInCart: (product.itemInCart || 0) + quantity,
            loading: true,
          };
        }
        return product;
      });

      setProducts(updatedProducts);

      const optimisticCart = calculateOptimisticCart(updatedProducts);
      onCartChange(optimisticCart);

      fetch('/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, quantity }),
      })
        .then(async (response) => {
          if (response.ok) {
            setProducts((currentProducts) =>
              currentProducts.map((product) => {
                if (product.id === productId) {
                  return {
                    ...product,
                    loading: false,
                  };
                }
                return product;
              })
            );
          } else {
            recalculateOnError(productId, quantity);
          }
        })
        .catch(() => {
          recalculateOnError(productId, quantity);
        });
    },
    [onCartChange, products, calculateOptimisticCart, recalculateOnError]
  );

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
