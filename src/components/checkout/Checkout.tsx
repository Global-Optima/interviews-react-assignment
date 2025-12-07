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
  Badge,
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
  Close,
} from '@mui/icons-material';
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
import { calculateTax } from '../../utils/utils';
import { CartReview } from './CartReview';

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

const getStepIcon = (step: number) => {
  const icons = [
    <ShoppingCart />,
    <LocalShipping />,
    <Payment />,
    <CheckCircle />,
  ];
  return icons[step];
};

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

  const totalQuantity = cart.items.reduce(
    (sum, item) => sum + item.itemInCart,
    0
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <CartReview
            cart={cart}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        );
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
            calculateTax={calculateTax}
            onOrderSuccess={handleOrderSuccess}
          />
        );
      default:
        return null;
    }
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
