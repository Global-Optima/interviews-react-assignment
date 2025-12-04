import { useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  Button,
  Box,
  Typography,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material'
import { CheckCircle, Error as ErrorIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import type { ShippingDetails, PaymentDetails } from '@/types'
import { ordersApi } from '@/api/orders'
import type { Order } from '@/types'

interface CheckoutStep4Props {
  shipping: ShippingDetails
  payment: PaymentDetails
  subtotal: number
  tax: number
  total: number
  onBack: () => void
}

export function CheckoutStep4({
  shipping,
  payment,
  subtotal,
  tax,
  total,
  onBack,
}: CheckoutStep4Props) {
  const navigate = useNavigate()
  const { items, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const orderData: Omit<Order, 'id' | 'createdAt'> = {
        items,
        shipping,
        payment,
        total,
        subtotal,
        tax,
      }
      await ordersApi.createOrder(orderData)
      clearCart()
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }, [items, shipping, payment, total, subtotal, tax, clearCart])

  if (success) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 8 }}>
          <CheckCircle sx={{ fontSize: 64, color: 'success.main', mb: 2 }} />
          <Typography variant="h2" sx={{ mb: 2 }}>
            Order placed successfully!
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Thank you for your purchase.
          </Typography>
          <Button variant="contained" onClick={() => navigate('/')}>
            Back to Products
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Review & Confirm
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Order Items
          </Typography>
          {items.map((item) => (
            <Box
              key={item.product.id}
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography variant="body2">
                {item.product.title} x {item.quantity}
              </Typography>
              <Typography variant="body2">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Shipping Address
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {shipping.fullName}
            <br />
            {shipping.address}
            <br />
            {shipping.city}, {shipping.zipCode}
            <br />
            {shipping.country}
            <br />
            Phone: {shipping.phone}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Payment Method
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {payment.method === 'credit_card' && 'Credit Card'}
            {payment.method === 'paypal' && 'PayPal'}
            {payment.method === 'cash_on_delivery' && 'Cash on Delivery'}
            {payment.method === 'credit_card' && payment.cardNumber && (
              <>
                <br />
                **** **** **** {payment.cardNumber.slice(-4)}
              </>
            )}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
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

        {error && (
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            action={
              <Button color="inherit" size="small" onClick={handleSubmit}>
                Retry
              </Button>
            }
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onBack} disabled={loading}>
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
}

