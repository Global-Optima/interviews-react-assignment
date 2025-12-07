import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Alert,
} from '@mui/material';
import { CreditCard, AccountBalance, LocalAtm } from '@mui/icons-material';

interface PaymentData {
  method: string;
  cardNumber: string;
  cardExpiry: string;
  cardCVV: string;
}

interface PaymentMethodProps {
  paymentData: PaymentData;
  paymentErrors: Record<string, string>;
  onPaymentChange: (field: keyof PaymentData, value: string) => void;
}

export function PaymentMethod({
  paymentData,
  paymentErrors,
  onPaymentChange,
}: PaymentMethodProps) {
  const paymentMethods = [
    {
      value: 'credit_card',
      label: 'Credit Card',
      icon: <CreditCard sx={{ fontSize: 32 }} />,
      description: 'Pay securely with your credit card',
    },
    {
      value: 'paypal',
      label: 'PayPal',
      icon: <AccountBalance sx={{ fontSize: 32 }} />,
      description: 'Fast & secure PayPal payment',
    },
    {
      value: 'cash',
      label: 'Cash on Delivery',
      icon: <LocalAtm sx={{ fontSize: 32 }} />,
      description: 'Pay when you receive your order',
    },
  ];

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const chunks = cleaned.match(/.{1,4}/g) || [];
    return chunks.join(' ').substring(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (value: string) => {
    const formatted = formatCardNumber(value);
    onPaymentChange('cardNumber', formatted);
  };

  const handleExpiryChange = (value: string) => {
    const formatted = formatExpiry(value);
    onPaymentChange('cardExpiry', formatted);
  };

  const handleCVVChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').substring(0, 4);
    onPaymentChange('cardCVV', cleaned);
  };

  return (
    <Box>
      <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>
        Payment Method
      </Typography>

      <Box sx={{ maxWidth: 600 }}>
        <Typography
          variant='subtitle1'
          gutterBottom
          sx={{ mb: 2, fontWeight: 'medium' }}
        >
          Select Payment Method *
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
          {paymentMethods.map((method) => (
            <Card
              key={method.value}
              sx={{
                cursor: 'pointer',
                border: 2,
                borderColor:
                  paymentData.method === method.value
                    ? 'primary.main'
                    : 'grey.300',
                bgcolor:
                  paymentData.method === method.value ? 'primary.50' : 'white',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
              onClick={() => onPaymentChange('method', method.value)}
            >
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      border: 2,
                      borderColor:
                        paymentData.method === method.value
                          ? 'primary.main'
                          : 'grey.400',
                      bgcolor:
                        paymentData.method === method.value
                          ? 'primary.main'
                          : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {paymentData.method === method.value && (
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: 'white',
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      color:
                        paymentData.method === method.value
                          ? 'primary.main'
                          : 'grey.700',
                    }}
                  >
                    {method.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant='h6' sx={{ fontSize: '1.1rem' }}>
                      {method.label}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {method.description}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        {paymentErrors.method && (
          <Typography
            color='error'
            variant='caption'
            sx={{ display: 'block', mb: 2 }}
          >
            {paymentErrors.method}
          </Typography>
        )}

        {/* Credit Card Form */}
        {paymentData.method === 'credit_card' && (
          <Box sx={{ mt: 3, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
            <Typography variant='h6' gutterBottom sx={{ mb: 2 }}>
              Card Details
            </Typography>

            <TextField
              fullWidth
              label='Card Number'
              value={paymentData.cardNumber}
              onChange={(e) => handleCardNumberChange(e.target.value)}
              error={!!paymentErrors.cardNumber}
              helperText={paymentErrors.cardNumber}
              placeholder='1234 5678 9012 3456'
              required
              sx={{ mb: 2 }}
              inputProps={{
                'aria-label': 'Card number',
                maxLength: 19,
              }}
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                label='Expiry Date'
                value={paymentData.cardExpiry}
                onChange={(e) => handleExpiryChange(e.target.value)}
                error={!!paymentErrors.cardExpiry}
                helperText={paymentErrors.cardExpiry}
                placeholder='MM/YY'
                required
                inputProps={{
                  'aria-label': 'Expiry date',
                  maxLength: 5,
                }}
              />

              <TextField
                fullWidth
                label='CVV'
                value={paymentData.cardCVV}
                onChange={(e) => handleCVVChange(e.target.value)}
                error={!!paymentErrors.cardCVV}
                helperText={paymentErrors.cardCVV}
                placeholder='123'
                required
                type='password'
                inputProps={{
                  'aria-label': 'CVV',
                  maxLength: 4,
                }}
              />
            </Box>

            <Alert severity='info' sx={{ mt: 2 }}>
              This is a demo. No actual payment will be processed.
            </Alert>
          </Box>
        )}

        {/* PayPal Message */}
        {paymentData.method === 'paypal' && (
          <Alert severity='info' sx={{ mt: 3 }}>
            <Typography variant='body2'>
              You will be redirected to PayPal to complete your payment
              securely.
            </Typography>
          </Alert>
        )}

        {/* Cash on Delivery Message */}
        {paymentData.method === 'cash' && (
          <Alert severity='success' sx={{ mt: 3 }}>
            <Typography variant='body2'>
              Please keep exact change ready. Payment will be collected upon
              delivery.
            </Typography>
          </Alert>
        )}
      </Box>
    </Box>
  );
}
