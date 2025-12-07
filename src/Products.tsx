import { useState } from 'react';
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
  Button,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { HeavyComponent } from './HeavyComponent.tsx';
import { useInfiniteScroll } from './hooks/useInfiniteScroll.ts';
import { UpdateSharp } from '@mui/icons-material';

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
}

export const Products = ({ onCartChange }: { onCartChange: (cart: Cart) => void }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [fetchErrored, setFetchErrored] = useState<Boolean>(false);
  const [hasMore, setHasMore] = useState(true);
  const [itemsPerRow] = useState<number>(3)

  const loadMore = async () => {
    try {
      const {products: newProducts} = await fetch(`/products?page=${page}&limit=${itemsPerRow*6}`).then(r => r.json());

      if (newProducts.length === 0) setHasMore(false);

      setProducts(prev => [...prev, ...newProducts]);
      setPage(p => p + 1);
      setFetchErrored(false);
    } catch (e) {
      setHasMore(false);
      setFetchErrored(true);
      console.error("Could not fetch products:", e);
    }
  };

  const { loaderRef, isLoading, loadMoreWithLoading } = useInfiniteScroll({
    loadMore,
    hasMore,
    threshold: 0
  });

  function addToCart(productId: number, quantity: number) {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          loading: true,
        };
      }
      return product;
    }));
    fetch('/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ productId, quantity }),
    }).then(async response => {
      if (response.ok) {
        const cart = await response.json();
        setProducts(products.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              itemInCart: (product.itemInCart || 0) + quantity,
              loading: false,
            };
          }
          return product;
        }));
        onCartChange(cart);
      }
    });
  }

  return (
    <Box sx={{overflowY: "scroll", width: "100%"}} height="100%">
      <Grid container spacing={2} p={2}>
        {products.map((product, i) => (
          <Grid item xs={12 / itemsPerRow} key={product.id} ref={i === products.length - itemsPerRow + 1 ? loaderRef : null}>
            {/* Do not remove this */}
            <HeavyComponent/>
            <Card style={{ width: '100%' }}>
              <CardMedia
                component="img"
                height="150"
                image={product.imageUrl}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                </Typography>
              </CardContent>
              <CardActions>
                <Typography variant="h6" component="div">
                  ${product.price}
                </Typography>
                <Box flexGrow={1}/>
                <Box position="relative" display="flex" flexDirection="row" alignItems="center">
                  <Box position="absolute" left={0} right={0} top={0} bottom={0} textAlign="center">
                    {product.loading && <CircularProgress size={20}/>}
                  </Box>
                  <IconButton disabled={product.loading} aria-label="delete" size="small"
                              onClick={() => addToCart(product.id, -1)}>
                    <RemoveIcon fontSize="small"/>
                  </IconButton>

                  <Typography variant="body1" component="div" mx={1}>
                    {product.itemInCart || 0}
                  </Typography>

                  <IconButton disabled={product.loading} aria-label="add" size="small"
                              onClick={() => addToCart(product.id, 1)}>
                    <AddIcon fontSize="small"/>
                  </IconButton>
                </Box>

              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {
        products.length === 0 && <Box ref={loaderRef} height="1px"/>
      }
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

            <Button startIcon={<UpdateSharp/>} variant="text" color="error" onClick={() => {
              loadMoreWithLoading();
              setHasMore(true)
            }}>
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
