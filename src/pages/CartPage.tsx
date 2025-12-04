import { Container, Typography, Box, Button, Card, CardContent, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { CartItemCard } from '@/components/CartItemCard'
import { CartSummary } from '@/components/CartSummary'

export function CartPage() {
  const navigate = useNavigate()
  const { items, getTotalPrice } = useCart()
  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1
  const total = subtotal + tax

  if (items.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Cart
        </Typography>
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your cart is empty
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Cart
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {items.map((item) => (
                <CartItemCard key={item.product.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <CartSummary subtotal={subtotal} tax={tax} total={total} />
        </Grid>
      </Grid>
    </Container>
  )
}


