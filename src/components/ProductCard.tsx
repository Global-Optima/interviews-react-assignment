import React from 'react';
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Box,
  CircularProgress,
  Chip,
  Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Product } from '../hooks/useInfiniteProducts';
import { HeavyComponent } from '../HeavyComponent';

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: number, quantity: number) => void;
}

export const ProductCard = React.memo(function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const inCart = (product.itemInCart || 0) > 0;
  
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
          backgroundColor: 'background.paper',
          borderRadius: 3,
          boxShadow: 1,
          border: '1px solid',
          borderColor: 'divider',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: 2,
            borderColor: 'primary.main',
          },
          '&:focus-within': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: '2px',
          },
        }}
      >
        {/* Image Container with 16:9 aspect ratio */}
        <Box
          sx={{
            position: 'relative',
            paddingTop: '56.25%', // 16:9 aspect ratio
            overflow: 'hidden',
            backgroundColor: 'grey.50',
          }}
        >
          <CardMedia
            component="img"
            image={product.imageUrl}
            alt={`${product.name} - ${product.category}`}
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: 2,
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.05)',
              },
            }}
          />
          
          {/* In Cart Badge */}
          {inCart && (
            <Chip
              icon={<ShoppingCartIcon sx={{ fontSize: '1rem' }} />}
              label={`In cart (${product.itemInCart})`}
              size="small"
              color="primary"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          )}
        </Box>
        
        {/* Content */}
        <CardContent sx={{ flexGrow: 1, p: 2, pb: 1 }}>
          {/* Product Title - truncated to 2 lines */}
          <Typography 
            variant="subtitle1" 
            component="h3"
            sx={{
              mb: 0.5,
              fontWeight: 600,
              color: 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              minHeight: '2.8em',
              lineHeight: 1.4,
            }}
          >
            {product.name}
          </Typography>
          
          {/* Category */}
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              fontSize: '0.75rem',
              display: 'block',
              mb: 1,
            }}
          >
            {product.category}
          </Typography>
          
          {/* Price */}
          <Typography 
            variant="h6" 
            component="div"
            color="primary.main"
            sx={{ 
              fontWeight: 700,
              fontSize: '1.25rem',
            }}
          >
            ${product.price.toFixed(2)}
          </Typography>
        </CardContent>

        {/* Actions */}
        <CardActions 
          sx={{ 
            p: 2,
            pt: 0,
            display: 'flex',
            gap: 1,
          }}
        >
          {!inCart ? (
            // Add to Cart Button - shown when product not in cart
            <Button
              variant="contained"
              color="primary"
              fullWidth
              startIcon={product.loading ? null : <ShoppingCartIcon />}
              disabled={product.loading}
              onClick={() => onAddToCart(product.id, 1)}
              aria-label={`Add ${product.name} to cart`}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
              }}
            >
              {product.loading ? (
                <CircularProgress size={20} thickness={4} color="inherit" />
              ) : (
                'Add to Cart'
              )}
            </Button>
          ) : (
            // Quantity Controls - shown when product in cart
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                gap: 1,
              }}
            >
              <IconButton
                disabled={product.loading}
                aria-label={`Remove one ${product.name} from cart`}
                size="medium"
                onClick={() => onAddToCart(product.id, -1)}
                color="error"
                sx={{
                  backgroundColor: 'error.main',
                  color: 'error.contrastText',
                  '&:hover': {
                    backgroundColor: 'error.dark',
                  },
                  '&:disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                  width: 40,
                  height: 40,
                }}
              >
                <RemoveIcon />
              </IconButton>

              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.100',
                  borderRadius: 2,
                  py: 1,
                  position: 'relative',
                }}
              >
                {product.loading ? (
                  <CircularProgress size={20} thickness={4} />
                ) : (
                  <Typography 
                    variant="body1" 
                    component="div" 
                    sx={{ 
                      fontWeight: 700,
                      color: 'text.primary',
                    }}
                  >
                    {product.itemInCart}
                  </Typography>
                )}
              </Box>

              <IconButton
                disabled={product.loading}
                aria-label={`Add one more ${product.name} to cart`}
                size="medium"
                onClick={() => onAddToCart(product.id, 1)}
                color="primary"
                sx={{
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '&:disabled': {
                    backgroundColor: 'action.disabledBackground',
                    color: 'action.disabled',
                  },
                  width: 40,
                  height: 40,
                }}
              >
                <AddIcon />
              </IconButton>
            </Box>
          )}
        </CardActions>
      </Card>
    </>
  );
});
