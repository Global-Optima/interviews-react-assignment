import { useCallback, useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
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

  return (
    <Box overflow='scroll' height='100%'>
      <Grid container spacing={2} p={2}>
        {products.map((product) => (
          <Grid item xs={4}>
            <ProductCard product={product} addToCart={addToCart} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
