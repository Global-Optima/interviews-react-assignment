import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Badge,
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
  Delete,
  Close,
} from '@mui/icons-material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { Cart } from '../../types/types';
import {
  AddToCart,
  RemoveFromCart,
  SetCart,
  SetProducts,
} from '../../hooks/useCart';
import { ShippingDetails } from './ShippingDetails';
import { useShippingDetails } from '../../hooks/useShippingDetails';
import { PaymentMethod } from './PaymentMethod';
import { usePaymentMethod } from '../../hooks/usePaymentMethod';
import { OrderConfirmation } from './OrderConfitmation';
import { useOrderConfirmation } from '../../hooks/useOrderConfirmation';

const steps = [
  'Cart Review',
  'Shipping Details',
  'Payment Method',
  'Order Confirmation',
];

interface CheckoutProps {
  cart: Cart;
  setCart: SetCart;
  setProducts: SetProducts;
  addToCart: AddToCart;
  removeFromCart: RemoveFromCart;
}

export function Checkout({
  cart,
  setCart,
  setProducts,
  addToCart,
  removeFromCart,
}: CheckoutProps) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const {
    shippingData,
    shippingErrors,
    handleShippingChange,
    validateShippingForm,
  } = useShippingDetails();

  const {
    paymentData,
    paymentErrors,
    handlePaymentChange,
    validatePaymentForm,
  } = usePaymentMethod();

  const { handleOrderSuccess } = useOrderConfirmation(setCart);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
  };

  const handleNext = () => {
    if (activeStep === 0 && cart.items.length === 0) return;

    if (activeStep === 1) {
      if (!validateShippingForm()) {
        return;
      }
    }

    if (activeStep === 2) {
      if (!validatePaymentForm()) {
        return;
      }
    }

    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const calculateSubtotal = () => {
    return cart.totalPrice;
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.1;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal + calculateTax(subtotal);
  };

  const totalQuantity = cart.items.reduce(
    (sum, item) => sum + item.itemInCart,
    0
  );

  // Step 1: Cart Review
  const CartReview = () => {
    if (cart.items.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant='h5' gutterBottom>
            Your cart is empty
          </Typography>
          <Typography color='text.secondary'>
            Add some items to get started
          </Typography>
        </Box>
      );
    }

    const subtotal = calculateSubtotal();
    const tax = calculateTax(subtotal);
    const total = calculateTotal();

    return (
      <Box>
        <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>
          Review Your Cart
        </Typography>
        <TableContainer component={Paper} sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell>Item</TableCell>
                <TableCell align='center'>Quantity</TableCell>
                <TableCell align='right'>Price</TableCell>
                <TableCell align='right'>Total</TableCell>
                <TableCell align='center'>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cart.items.map((item) => (
                <TableRow key={item.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                      <Box>
                        <Typography sx={{ fontWeight: 'medium' }}>
                          {item.name}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>
                          {item.category}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align='center'>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 1,
                      }}
                    >
                      <IconButton
                        disabled={item.loading}
                        aria-label='delete'
                        size='small'
                        onClick={() => addToCart(item.id, -1)}
                      >
                        <RemoveIcon fontSize='small' />
                      </IconButton>
                      <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                        {item.itemInCart}
                      </Typography>
                      <IconButton
                        disabled={item.loading}
                        aria-label='add'
                        size='small'
                        onClick={() => addToCart(item.id, 1)}
                      >
                        <AddIcon fontSize='small' />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell align='right'>${item.price.toFixed(2)}</TableCell>
                  <TableCell align='right' sx={{ fontWeight: 'medium' }}>
                    ${(item.price * item.itemInCart).toFixed(2)}
                  </TableCell>
                  <TableCell align='center'>
                    <IconButton
                      color='error'
                      onClick={() => removeFromCart(item.id)}
                      aria-label='remove item'
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Card sx={{ maxWidth: 400, ml: 'auto' }}>
          <CardContent>
            <Typography variant='h6' gutterBottom>
              Order Summary
            </Typography>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography color='text.secondary'>Subtotal:</Typography>
              <Typography>${subtotal.toFixed(2)}</Typography>
            </Box>
            <Box
              sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}
            >
              <Typography color='text.secondary'>Tax (10%):</Typography>
              <Typography>${tax.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant='h6'>Total:</Typography>
              <Typography variant='h6'>${total.toFixed(2)}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    );
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <CartReview />;
      case 1:
        return (
          <ShippingDetails
            shippingData={shippingData}
            shippingErrors={shippingErrors}
            onShippingChange={handleShippingChange}
          />
        );
      case 2:
        return (
          <PaymentMethod
            paymentData={paymentData}
            paymentErrors={paymentErrors}
            onPaymentChange={handlePaymentChange}
          />
        );
      case 3:
        return (
          <OrderConfirmation
            cart={cart}
            setCart={setCart}
            setProducts={setProducts}
            shippingData={shippingData}
            paymentData={paymentData}
            calculateSubtotal={calculateSubtotal}
            calculateTax={calculateTax}
            calculateTotal={calculateTotal}
            onOrderSuccess={handleOrderSuccess}
          />
        );
      default:
        return null;
    }
  };

  const getStepIcon = (step: number) => {
    const icons = [
      <ShoppingCart />,
      <LocalShipping />,
      <Payment />,
      <CheckCircle />,
    ];
    return icons[step];
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          color: 'white',
        }}
        aria-label='shopping cart'
      >
        <Badge
          badgeContent={totalQuantity || 0}
          color='secondary'
          sx={{
            '& .MuiBadge-badge': {
              backgroundColor: '#f50057',
              color: 'white',
            },
          }}
        >
          <ShoppingCart />
        </Badge>
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth='lg' fullWidth>
        <Box sx={{ position: 'relative' }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              zIndex: 1,
            }}
          >
            <Close />
          </IconButton>

          <DialogContent sx={{ pt: 6, pb: 4 }}>
            <Typography variant='h3' align='center' gutterBottom sx={{ mb: 4 }}>
              Checkout
            </Typography>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          bgcolor:
                            activeStep >= index ? 'primary.main' : 'grey.300',
                          color: 'white',
                        }}
                      >
                        {getStepIcon(index)}
                      </Box>
                    )}
                  >
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
            <Card sx={{ minHeight: 400 }}>
              <CardContent sx={{ p: 4 }}>{renderStepContent()}</CardContent>
            </Card>

            {activeStep < 3 && (
              <Box
                sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  variant='outlined'
                  size='large'
                >
                  Back
                </Button>
                <Button
                  onClick={handleNext}
                  variant='contained'
                  size='large'
                  disabled={activeStep === 0 && cart.items.length === 0}
                >
                  Next
                </Button>
              </Box>
            )}
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
}
