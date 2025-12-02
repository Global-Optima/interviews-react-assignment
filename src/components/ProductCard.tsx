import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  CircularProgress,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Product } from '../hooks/useInfiniteProducts';
import { HeavyComponent } from '../HeavyComponent';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <>
      {/* Do not remove this - performance challenge component */}
      <HeavyComponent />
      
      <Card 
        sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          borderRadius: '16px',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.3)',
          },
        }}
      >
        <CardMedia
          component="img"
          height="180"
          image={product.imageUrl}
          alt={product.name}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
        />
        
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography gutterBottom variant="h6" component="div" noWrap>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.category}
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
          <Typography 
            variant="h6" 
            component="div"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>

          <Box 
            position="relative" 
            display="flex" 
            alignItems="center" 
            gap={1}
            sx={{
              background: 'rgba(102, 126, 234, 0.05)',
              borderRadius: '24px',
              padding: '4px 8px',
            }}
          >
            {/* Loading overlay */}
            {product.loading && (
              <Box
                position="absolute"
                left={0}
                right={0}
                top={0}
                bottom={0}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress size={20} />
              </Box>
            )}

            <IconButton
              disabled={product.loading || (product.itemInCart || 0) === 0}
              aria-label="remove from cart"
              size="small"
              onClick={() => onAddToCart(product.id, -1)}
              sx={{
                background: product.loading || (product.itemInCart || 0) === 0 
                  ? 'transparent' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>

            <Typography 
              variant="body1" 
              component="div" 
              sx={{ 
                minWidth: '32px', 
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
              }}
            >
              {product.itemInCart || 0}
            </Typography>

            <IconButton
              disabled={product.loading}
              aria-label="add to cart"
              size="small"
              onClick={() => onAddToCart(product.id, 1)}
              sx={{
                background: product.loading 
                  ? 'transparent' 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                },
                '&:disabled': {
                  background: 'rgba(0, 0, 0, 0.12)',
                  color: 'rgba(0, 0, 0, 0.26)',
                },
              }}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </>
  );
}
