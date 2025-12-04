import { Box, Button, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { CartItemCard } from '@/components/CartItemCard'
import { useCart } from '@/context/CartContext'

interface CheckoutStep1Props {
  onNext: () => void
}

export function CheckoutStep1({ onNext }: CheckoutStep1Props) {
  const navigate = useNavigate()
  const { items } = useCart()

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 3 }}>
          {items.map((item) => (
            <CartItemCard key={item.product.id} item={item} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={() => navigate('/cart')}>
            Back to Cart
          </Button>
          <Button variant="contained" onClick={onNext}>
            Continue
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}


