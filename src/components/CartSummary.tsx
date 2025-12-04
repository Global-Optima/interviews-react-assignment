import { memo } from 'react'
import { Card, CardContent, Typography, Button, Box, Divider } from '@mui/material'
import { useNavigate } from 'react-router-dom'

interface CartSummaryProps {
  subtotal: number
  tax: number
  total: number
}

export const CartSummary = memo(function CartSummary({
  subtotal,
  tax,
  total,
}: CartSummaryProps) {
  const navigate = useNavigate()

  return (
    <Card>
      <CardContent>
        <Typography variant="h3" sx={{ mb: 2 }}>
          Summary
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Subtotal</Typography>
            <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="body1">Tax (10%)</Typography>
            <Typography variant="body1">${tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h3" sx={{ fontSize: '20px', fontWeight: 700 }}>
              Total
            </Typography>
            <Typography variant="h3" sx={{ fontSize: '20px', fontWeight: 700 }}>
              ${total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={() => navigate('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </CardContent>
    </Card>
  )
})


