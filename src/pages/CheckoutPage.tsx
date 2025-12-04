import { useState, useCallback } from 'react'
import {
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Card,
  CardContent,
} from '@mui/material'
import { useCart } from '@/context/CartContext'
import { CheckoutStep1 } from '@/components/checkout/CheckoutStep1'
import { CheckoutStep2 } from '@/components/checkout/CheckoutStep2'
import { CheckoutStep3 } from '@/components/checkout/CheckoutStep3'
import { CheckoutStep4 } from '@/components/checkout/CheckoutStep4'
import type { ShippingDetails, PaymentDetails } from '@/types'

const steps = ['Cart Review', 'Shipping Details', 'Payment Method', 'Review & Confirm']

export function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [shipping, setShipping] = useState<ShippingDetails | null>(null)
  const [payment, setPayment] = useState<PaymentDetails | null>(null)
  const { items, getTotalPrice } = useCart()

  const subtotal = getTotalPrice()
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleNext = useCallback(() => {
    setActiveStep((prev) => prev + 1)
  }, [])

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1)
  }, [])

  const handleShippingSubmit = useCallback((data: ShippingDetails) => {
    setShipping(data)
    handleNext()
  }, [handleNext])

  const handlePaymentSubmit = useCallback((data: PaymentDetails) => {
    setPayment(data)
    handleNext()
  }, [handleNext])


  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <CheckoutStep1 onNext={handleNext} />
      case 1:
        return (
          <CheckoutStep2
            initialData={shipping}
            onSubmit={handleShippingSubmit}
            onBack={handleBack}
          />
        )
      case 2:
        return (
          <CheckoutStep3
            initialData={payment}
            onSubmit={handlePaymentSubmit}
            onBack={handleBack}
          />
        )
      case 3:
        return (
          <CheckoutStep4
            shipping={shipping!}
            payment={payment!}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onBack={handleBack}
          />
        )
      default:
        return null
    }
  }

  if (items.length === 0 && activeStep === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
        <Typography variant="h2" sx={{ mb: 3 }}>
          Checkout
        </Typography>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your cart is empty
            </Typography>
            <Button variant="contained" href="/">
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h2" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box>{renderStepContent()}</Box>
    </Container>
  )
}

