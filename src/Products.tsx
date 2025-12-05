import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { HeavyComponent } from './HeavyComponent.tsx';
import { useRef } from 'react';

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


//todo: move outside
const fetchProducts = async (page: number): Promise<Product[]> => {
  const response = await fetch(`/products?page=${page}&limit=40`);
  const data = await response.json();
  return data.products;
}


export const Products = ({ onCartChange }: { onCartChange: (cart: Cart) => void }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const fetchedPagesRef = useRef<Set<number>>(new Set()); //to avoid dublicate fetches, strict mode bug
  const allFetchedRef = useRef(false); // stop fetching when all products are fetched


  const loadingRef = useRef(false);

  // todo: debounce? 
  const handleScroll = () => {
      if (loadingRef.current || allFetchedRef.current) return;
      console.log('all fetched:', allFetchedRef.current);

      const lowestFrame = document.documentElement.scrollHeight - document.documentElement.clientHeight

      const threshold = document.documentElement.clientHeight * 0.5


      if (document.documentElement.scrollTop >= lowestFrame - threshold) {
        setPage((prevPage) => prevPage + 1);
        loadingRef.current = true;
      }
  }
  useEffect(() => {
      document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll)
  }, []);

  useEffect(() => {
    fetchProducts(page).then(newProducts => {
      //check if page was already fetched
      if( fetchedPagesRef.current.has(page)) {
        loadingRef.current = false;
        return;
      }

      //handle last fetch
      if (newProducts.length === 0) {
        allFetchedRef.current = true;
        loadingRef.current = false;
        return;
      }

      setProducts(prevProducts => [...prevProducts, ...newProducts]);
      fetchedPagesRef.current.add(page);
      loadingRef.current = false;
    });
  }, [page]);

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
    //refactor 
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
    <Box overflow="scroll" height="100%" >
      <Grid container spacing={2} p={2}>
        {products.map(product => (
          <Grid item xs={4} key={product.id}>
            {/* Do not remove this */}
            <HeavyComponent/>
            <Card key={product.id} style={{ width: '100%' }}>
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
    </Box>
  );
};
