import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
  Alert,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  CheckCircle,
  Error,
  CreditCard,
  AccountBalance,
  LocalAtm,
} from '@mui/icons-material';
import { Cart } from '../../types/types';
import { SetCart, SetProducts } from '../../hooks/useCart';

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  deliverySlot: string;
}

interface PaymentData {
  method: string;
  cardNumber: string;
}

interface OrderConfirmationProps {
  cart: Cart;
  setCart: SetCart;
  setProducts: SetProducts;
  shippingData: ShippingData;
  paymentData: PaymentData;
  calculateSubtotal: () => number;
  calculateTax: (subtotal: number) => number;
  calculateTotal: () => number;
  onOrderSuccess: () => void;
}

export function OrderConfirmation({
  cart,
  setCart,
  setProducts,
  shippingData,
  paymentData,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  onOrderSuccess,
}: OrderConfirmationProps) {
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderStatus, setOrderStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  const [orderNumber, setOrderNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getPaymentMethodDisplay = () => {
    switch (paymentData.method) {
      case 'credit_card':
        return {
          icon: <CreditCard />,
          label: 'Credit Card',
          detail: `**** **** **** ${paymentData.cardNumber.slice(-4)}`,
        };
      case 'paypal':
        return {
          icon: <AccountBalance />,
          label: 'PayPal',
          detail: 'Payment on redirect',
        };
      case 'cash':
        return {
          icon: <LocalAtm />,
          label: 'Cash on Delivery',
          detail: 'Pay upon delivery',
        };
      default:
        return {
          icon: <CreditCard />,
          label: 'Not selected',
          detail: '',
        };
    }
  };

  const getDeliverySlotDisplay = () => {
    const slots = {
      morning: 'Morning (8 AM - 12 PM)',
      afternoon: 'Afternoon (12 PM - 5 PM)',
      evening: 'Evening (5 PM - 9 PM)',
    };

    return (
      slots[shippingData.deliverySlot as keyof typeof slots] ||
      shippingData.deliverySlot
    );
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setErrorMessage('');

    try {
      const orderData = {
        items: cart,
        shipping: shippingData,
        payment: { method: paymentData.method },
        total: calculateTotal(),
      };

      const response = await fetch('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        // Success - generate tracking number
        const trackingNumber = `ORD-${Date.now()}-${Math.random()
          .toString(12)
          .toUpperCase()}`;
        setOrderNumber(trackingNumber);
        setOrderStatus('success');
        onOrderSuccess();
        setProducts((currentProducts) =>
          currentProducts.map((product) => ({
            ...product,
            itemInCart: 0,
          }))
        );
        setCart({
          items: [],
          totalItems: 0,
          totalPrice: 0,
        });
      } else {
        // Failure - try to parse error message
        let errorMsg = 'Failed to place order. Please try again.';
        try {
          const data = await response.json();
          if (data.message) {
            errorMsg = data.message;
          }
        } catch {
          // If JSON parsing fails, use default message
        }
        setOrderStatus('error');
        setErrorMessage(errorMsg);
      }
    } catch (error) {
      setOrderStatus('error');
      setErrorMessage(
        'Network error. Please check your connection and try again.'
      );
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const handleRetry = () => {
    setOrderStatus('pending');
    setErrorMessage('');
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal();
  const paymentMethod = getPaymentMethodDisplay();

  if (orderStatus === 'success') {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
        <Typography variant='h4' gutterBottom sx={{ fontWeight: 'bold' }}>
          Order Placed Successfully!
        </Typography>
        <Typography variant='h6' color='text.secondary' gutterBottom>
          Thank you for your purchase
        </Typography>

        <Card sx={{ maxWidth: 500, mx: 'auto', mt: 4, mb: 3 }}>
          <CardContent>
            <Typography variant='subtitle2' color='text.secondary' gutterBottom>
              Order Tracking Number
            </Typography>
            <Typography
              variant='h5'
              sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2 }}
            >
              {orderNumber}
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Typography variant='body2' color='text.secondary'>
              A confirmation email has been sent to your email address with
              order details and tracking information.
            </Typography>
          </CardContent>
        </Card>

        <Alert severity='info' sx={{ maxWidth: 600, mx: 'auto', mb: 3 }}>
          <Typography variant='body2'>
            Your order will be delivered during the{' '}
            <strong>{getDeliverySlotDisplay()}</strong> time slot.
          </Typography>
        </Alert>

        <Button
          variant='contained'
          size='large'
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Start New Order
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>
        Order Confirmation
      </Typography>

      {orderStatus === 'error' && (
        <Alert severity='error' sx={{ mb: 3 }} icon={<Error />}>
          <Typography variant='subtitle2' gutterBottom>
            Order Failed
          </Typography>
          <Typography variant='body2'>{errorMessage}</Typography>
        </Alert>
      )}

      {/* Order Items */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Order Items
          </Typography>
          <TableContainer>
            <Table size='small'>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align='center'>Qty</TableCell>
                  <TableCell align='right'>Price</TableCell>
                  <TableCell align='right'>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                      >
                        <Box
                          component='img'
                          src={item.imageUrl}
                          alt={item.name}
                          sx={{
                            width: 60,
                            height: 60,
                            objectFit: 'cover',
                            borderRadius: 1,
                          }}
                        />
                        <Typography variant='body2'>{item.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell align='center'>{item.itemInCart}</TableCell>
                    <TableCell align='right'>
                      ${item.price.toFixed(2)}
                    </TableCell>
                    <TableCell align='right' sx={{ fontWeight: 'medium' }}>
                      ${(item.price * item.itemInCart).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {/* Shipping Address */}
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Shipping Address
            </Typography>
            <Typography variant='body2'>{shippingData.fullName}</Typography>
            <Typography variant='body2'>{shippingData.address}</Typography>
            <Typography variant='body2'>
              {shippingData.city}, {shippingData.postalCode}
            </Typography>
            <Typography variant='body2' sx={{ mt: 1 }}>
              Phone: {shippingData.phone}
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Typography variant='body2' color='text.secondary'>
              Delivery Time:
            </Typography>
            <Typography variant='body2' sx={{ fontWeight: 'medium' }}>
              {getDeliverySlotDisplay()}
            </Typography>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card sx={{ flex: 1, minWidth: 250 }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Payment Method
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              {paymentMethod.icon}
              <Typography variant='body1' sx={{ fontWeight: 'medium' }}>
                {paymentMethod.label}
              </Typography>
            </Box>
            <Typography variant='body2' color='text.secondary'>
              {paymentMethod.detail}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Order Summary */}
      <Card sx={{ maxWidth: 400, ml: 'auto', mt: 3 }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color='text.secondary'>Subtotal:</Typography>
            <Typography>${subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color='text.secondary'>Tax (10%):</Typography>
            <Typography>${tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant='h6'>Total:</Typography>
            <Typography variant='h6'>${total.toFixed(2)}</Typography>
          </Box>

          {orderStatus === 'pending' && (
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
              startIcon={isPlacingOrder ? <CircularProgress size={20} /> : null}
            >
              {isPlacingOrder ? 'Processing...' : 'Place Order'}
            </Button>
          )}

          {orderStatus === 'error' && (
            <Button
              variant='contained'
              size='large'
              fullWidth
              onClick={handleRetry}
              color='primary'
            >
              Retry Order
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
