import { useEffect, useState, useRef, useCallback } from 'react';
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
  Alert,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { HeavyComponent } from './HeavyComponent.tsx';

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

const PRODUCTS_PER_PAGE = 20;

export const Products = ({ onCartChange }: { onCartChange: (cart: Cart) => void }) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollBoxRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  // Загрузка товаров
  const loadProducts = useCallback(async (pageNum: number) => {
    if (loadingRef.current) return;
    
    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/products?page=${pageNum}&limit=${PRODUCTS_PER_PAGE}`);
      if (!response.ok) {
        throw new Error('Не удалось загрузить товары');
      }
      
      const data = await response.json();
      
      setProducts(prev => {
        // Добавляем новые товары к существующим
        const newProducts = pageNum === 0 ? data.products : [...prev, ...data.products];
        return newProducts;
      });
      
      setHasMore(data.hasMore);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка');
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, []);

  // Начальная загрузка
  useEffect(() => {
    loadProducts(0);
  }, [loadProducts]);

  // Обработчик прокрутки для бесконечной загрузки
  const handleScroll = useCallback(() => {
    const scrollBox = scrollBoxRef.current;
    if (!scrollBox || !hasMore || isLoading) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollBox;
    const scrollThreshold = 200; // Загружать за 200px до конца

    if (scrollHeight - scrollTop - clientHeight < scrollThreshold) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage);
    }
  }, [hasMore, isLoading, page, loadProducts]);

  // Добавление обработчика прокрутки
  useEffect(() => {
    const scrollBox = scrollBoxRef.current;
    if (!scrollBox) return;

    scrollBox.addEventListener('scroll', handleScroll);
    return () => scrollBox.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Исправлена функция addToCart - используется функциональное обновление состояния
  function addToCart(productId: number, quantity: number) {
    setProducts(prev => prev.map(product => {
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
        setProducts(prev => prev.map(product => {
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
      } else {
        // Откатить loading состояние при ошибке
        setProducts(prev => prev.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              loading: false,
            };
          }
          return product;
        }));
      }
    }).catch(() => {
      // Обработка ошибок сети
      setProducts(prev => prev.map(product => {
        if (product.id === productId) {
          return {
            ...product,
            loading: false,
          };
        }
        return product;
      }));
    });
  }

  return (
    <Box 
      ref={scrollBoxRef}
      overflow="auto" 
      height="100%"
      sx={{ overflowY: 'scroll' }}
    >
      <Grid container spacing={2} p={2}>
        {/* Ошибка API */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Grid>
        )}

        {/* Пустое состояние */}
        {!isLoading && products.length === 0 && !error && (
          <Grid item xs={12}>
            <Box 
              display="flex" 
              justifyContent="center" 
              alignItems="center" 
              minHeight="400px"
            >
              <Typography variant="h6" color="text.secondary">
                Товары не найдены
              </Typography>
            </Box>
          </Grid>
        )}

        {/* Список товаров - ИСПРАВЛЕН key prop на Grid item */}
        {products.map(product => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            {/* Do not remove this */}
            <HeavyComponent/>
            <Card style={{ width: '100%', height: '100%' }}>
              <CardMedia
                component="img"
                height="150"
                image={product.imageUrl}
                alt={product.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h6" component="div">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.category}
                </Typography>
              </CardContent>
              <CardActions>
                <Typography variant="h6" component="div">
                  ${product.price.toFixed(2)}
                </Typography>
                <Box flexGrow={1}/>
                <Box position="relative" display="flex" flexDirection="row" alignItems="center">
                  <Box position="absolute" left={0} right={0} top={0} bottom={0} textAlign="center">
                    {product.loading && <CircularProgress size={20}/>}
                  </Box>
                  <IconButton 
                    disabled={product.loading || (product.itemInCart || 0) === 0} 
                    aria-label="удалить из корзины" 
                    size="small"
                    onClick={() => addToCart(product.id, -1)}
                  >
                    <RemoveIcon fontSize="small"/>
                  </IconButton>

                  <Typography variant="body1" component="div" mx={1}>
                    {product.itemInCart || 0}
                  </Typography>

                  <IconButton 
                    disabled={product.loading} 
                    aria-label="добавить в корзину" 
                    size="small"
                    onClick={() => addToCart(product.id, 1)}
                  >
                    <AddIcon fontSize="small"/>
                  </IconButton>
                </Box>

              </CardActions>
            </Card>
          </Grid>
        ))}

        {/* Индикатор загрузки при подгрузке следующей страницы */}
        {isLoading && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3}>
              <CircularProgress />
            </Box>
          </Grid>
        )}

        {/* Сообщение об окончании списка */}
        {!hasMore && products.length > 0 && (
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" p={3}>
              <Typography variant="body2" color="text.secondary">
                Все товары загружены
              </Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
