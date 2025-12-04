import { memo } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Skeleton,
  useTheme,
} from '@mui/material'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  loading?: boolean
}

export const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
  loading = false,
}: ProductCardProps) {
  const theme = useTheme()

  if (loading) {
    return (
      <Card>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton height={24} width="80%" />
          <Skeleton height={20} width="60%" sx={{ mt: 1 }} />
          <Skeleton height={32} width="40%" sx={{ mt: 2 }} />
          <Skeleton height={36} width="100%" sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow:
            theme.palette.mode === 'light'
              ? '0 4px 12px rgba(0,0,0,0.1)'
              : '0 4px 12px rgba(0,0,0,0.5)',
        },
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.image}
        alt={product.title}
        sx={{
          objectFit: 'contain',
          objectPosition: 'center',
          borderRadius: '10px 10px 0 0',
          width: '100%',
          maxWidth: '100%',
          maxHeight: '200px',
          backgroundColor: theme.palette.gray[100],
          padding: 1,
        }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 600, mb: 0.5 }}>
          {product.title}
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
          {product.category}
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, mt: 'auto' }}>
          ${product.price.toFixed(2)}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          onClick={() => onAddToCart(product)}
          sx={{ mt: 'auto' }}
        >
          Add to cart
        </Button>
      </CardContent>
    </Card>
  )
})


