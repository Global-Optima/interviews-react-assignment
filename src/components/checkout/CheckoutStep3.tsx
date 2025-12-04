import { useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material'
import type { PaymentDetails, PaymentMethod } from '@/types'

interface CheckoutStep3Props {
  initialData: PaymentDetails | null
  onSubmit: (data: PaymentDetails) => void
  onBack: () => void
}

export function CheckoutStep3({ initialData, onSubmit, onBack }: CheckoutStep3Props) {
  const [method, setMethod] = useState<PaymentMethod>(
    initialData?.method || 'credit_card'
  )
  const [cardNumber, setCardNumber] = useState(initialData?.cardNumber || '')
  const [expiration, setExpiration] = useState(initialData?.expiration || '')
  const [cvv, setCvv] = useState(initialData?.cvv || '')
  const [errors, setErrors] = useState<{
    cardNumber?: string
    expiration?: string
    cvv?: string
  }>({})

  const validateCard = useCallback((): boolean => {
    if (method !== 'credit_card') return true

    const newErrors: typeof errors = {}

    // Validate card number (16 digits)
    const cardNumberClean = cardNumber.replace(/\s/g, '')
    if (!/^\d{16}$/.test(cardNumberClean)) {
      newErrors.cardNumber = 'Card number must be 16 digits'
    }

    // Validate expiration (MM/YY)
    if (!/^\d{2}\/\d{2}$/.test(expiration)) {
      newErrors.expiration = 'Expiration must be in MM/YY format'
    }

    // Validate CVV (3 digits)
    if (!/^\d{3}$/.test(cvv)) {
      newErrors.cvv = 'CVV must be 3 digits'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [method, cardNumber, expiration, cvv])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (validateCard()) {
        const paymentData: PaymentDetails = {
          method,
          ...(method === 'credit_card' && {
            cardNumber: cardNumber.replace(/\s/g, ''),
            expiration,
            cvv,
          }),
        }
        onSubmit(paymentData)
      }
    },
    [method, cardNumber, expiration, cvv, validateCard, onSubmit]
  )

  const handleCardNumberChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16)
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    setCardNumber(formatted)
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: undefined }))
    }
  }, [errors.cardNumber])

  const handleExpirationChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4)
    const formatted = cleaned.length >= 2
      ? `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
      : cleaned
    setExpiration(formatted)
    if (errors.expiration) {
      setErrors((prev) => ({ ...prev, expiration: undefined }))
    }
  }, [errors.expiration])

  const handleCvvChange = useCallback((value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 3)
    setCvv(cleaned)
    if (errors.cvv) {
      setErrors((prev) => ({ ...prev, cvv: undefined }))
    }
  }, [errors.cvv])

  return (
    <Card>
      <CardContent>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Payment Method
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
            <FormLabel component="legend">Select Payment Method</FormLabel>
            <RadioGroup
              value={method}
              onChange={(e) => setMethod(e.target.value as PaymentMethod)}
            >
              <FormControlLabel
                value="credit_card"
                control={<Radio />}
                label="Credit Card"
              />
              <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
              <FormControlLabel
                value="cash_on_delivery"
                control={<Radio />}
                label="Cash on Delivery"
              />
            </RadioGroup>
          </FormControl>

          {method === 'credit_card' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              <TextField
                label="Card Number"
                required
                fullWidth
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                error={!!errors.cardNumber}
                helperText={errors.cardNumber}
              />
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  label="Expiration"
                  required
                  fullWidth
                  placeholder="MM/YY"
                  value={expiration}
                  onChange={(e) => handleExpirationChange(e.target.value)}
                  error={!!errors.expiration}
                  helperText={errors.expiration}
                />
                <TextField
                  label="CVV"
                  required
                  fullWidth
                  placeholder="123"
                  value={cvv}
                  onChange={(e) => handleCvvChange(e.target.value)}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                />
              </Box>
            </Box>
          )}

          {method === 'paypal' && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                You will be redirected to PayPal to complete your payment.
              </Typography>
            </Box>
          )}

          {method === 'cash_on_delivery' && (
            <Box sx={{ mb: 3, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                You will pay when the order is delivered.
              </Typography>
            </Box>
          )}

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" variant="contained">
              Continue
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}


