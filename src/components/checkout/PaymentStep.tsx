import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Paper,
    Fade,
    Grid,
    Alert,
} from '@mui/material';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useCheckout } from './useCheckout';
import { PaymentMethod, CardDetails } from './types';

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: React.ReactNode; description: string }[] = [
    {
        value: 'creditCard',
        label: 'Credit Card',
        icon: <CreditCardIcon sx={{ fontSize: 32, color: 'primary.main' }} />,
        description: 'Pay securely with your credit or debit card',
    },
    {
        value: 'paypal',
        label: 'PayPal',
        icon: <AccountBalanceWalletIcon sx={{ fontSize: 32, color: '#003087' }} />,
        description: 'Fast and secure payment with PayPal',
    },
    {
        value: 'cashOnDelivery',
        label: 'Cash on Delivery',
        icon: <LocalShippingIcon sx={{ fontSize: 32, color: 'success.main' }} />,
        description: 'Pay when you receive your order',
    },
];

export function PaymentStep() {
    const { paymentInfo, setPaymentInfo, cardErrors, validatePayment } = useCheckout();

    const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPaymentInfo({
            ...paymentInfo,
            method: event.target.value as PaymentMethod,
        });
    };

    const handleCardChange = (field: keyof CardDetails) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let value = event.target.value;

        if (field === 'cardNumber') {
            value = value.replace(/\D/g, '').slice(0, 16);
            value = value.replace(/(.{4})/g, '$1 ').trim();
        }

        if (field === 'expiry') {
            value = value.replace(/\D/g, '').slice(0, 4);
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2);
            }
        }

        if (field === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 4);
        }

        setPaymentInfo({
            ...paymentInfo,
            cardDetails: {
                ...paymentInfo.cardDetails!,
                [field]: value,
            },
        });
    };

    const handleBlur = () => {
        if (paymentInfo.method === 'creditCard') {
            validatePayment();
        }
    };

    return (
        <Fade in timeout={400}>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Payment Method
                </Typography>

                <FormControl component="fieldset" fullWidth>
                    <RadioGroup
                        value={paymentInfo.method}
                        onChange={handleMethodChange}
                        aria-label="Payment method"
                    >
                        <Grid container spacing={2} sx={{ mb: 3 }}>
                            {PAYMENT_METHODS.map((method) => (
                                <Grid item xs={12} sm={4} key={method.value}>
                                    <Paper
                                        variant="outlined"
                                        sx={{
                                            p: 2.5,
                                            cursor: 'pointer',
                                            borderColor: paymentInfo.method === method.value
                                                ? 'primary.main'
                                                : 'divider',
                                            borderWidth: paymentInfo.method === method.value ? 2 : 1,
                                            bgcolor: paymentInfo.method === method.value
                                                ? 'primary.50'
                                                : 'background.paper',
                                            transition: 'all 0.2s',
                                            height: '100%',
                                            '&:hover': {
                                                borderColor: 'primary.main',
                                                boxShadow: 1,
                                            },
                                        }}
                                        onClick={() => setPaymentInfo({ ...paymentInfo, method: method.value })}
                                    >
                                        <FormControlLabel
                                            value={method.value}
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ textAlign: 'center', width: '100%', pt: 1 }}>
                                                    {method.icon}
                                                    <Typography fontWeight={500} sx={{ mt: 1 }}>
                                                        {method.label}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {method.description}
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{
                                                m: 0,
                                                width: '100%',
                                                alignItems: 'flex-start',
                                                '& .MuiFormControlLabel-label': { width: '100%' }
                                            }}
                                        />
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </RadioGroup>
                </FormControl>

                {paymentInfo.method === 'creditCard' && (
                    <Fade in timeout={300}>
                        <Paper variant="outlined" sx={{ p: 3, mt: 2 }}>
                            <Typography variant="subtitle1" fontWeight={500} gutterBottom>
                                Card Details
                            </Typography>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Card Number"
                                        value={paymentInfo.cardDetails?.cardNumber || ''}
                                        onChange={handleCardChange('cardNumber')}
                                        onBlur={handleBlur}
                                        error={!!cardErrors.cardNumber}
                                        helperText={cardErrors.cardNumber || 'Enter 16-digit card number'}
                                        placeholder="0000 0000 0000 0000"
                                        required
                                        inputProps={{
                                            'aria-label': 'Card Number',
                                            'aria-required': true,
                                            maxLength: 19,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Expiry Date"
                                        value={paymentInfo.cardDetails?.expiry || ''}
                                        onChange={handleCardChange('expiry')}
                                        onBlur={handleBlur}
                                        error={!!cardErrors.expiry}
                                        helperText={cardErrors.expiry || 'MM/YY'}
                                        placeholder="MM/YY"
                                        required
                                        inputProps={{
                                            'aria-label': 'Expiry Date',
                                            'aria-required': true,
                                            maxLength: 5,
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="CVV"
                                        value={paymentInfo.cardDetails?.cvv || ''}
                                        onChange={handleCardChange('cvv')}
                                        onBlur={handleBlur}
                                        error={!!cardErrors.cvv}
                                        helperText={cardErrors.cvv || '3 or 4 digits'}
                                        placeholder="123"
                                        type="password"
                                        required
                                        inputProps={{
                                            'aria-label': 'CVV',
                                            'aria-required': true,
                                            maxLength: 4,
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Fade>
                )}

                {paymentInfo.method === 'paypal' && (
                    <Fade in timeout={300}>
                        <Alert
                            severity="info"
                            icon={<AccountBalanceWalletIcon />}
                            sx={{ mt: 2 }}
                        >
                            <Typography variant="body2">
                                You will be redirected to PayPal to complete your payment securely after reviewing your order.
                            </Typography>
                        </Alert>
                    </Fade>
                )}

                {paymentInfo.method === 'cashOnDelivery' && (
                    <Fade in timeout={300}>
                        <Alert
                            severity="success"
                            icon={<LocalShippingIcon />}
                            sx={{ mt: 2 }}
                        >
                            <Typography variant="body2">
                                Pay with cash when your order is delivered. Please have the exact amount ready.
                            </Typography>
                        </Alert>
                    </Fade>
                )}
            </Box>
        </Fade>
    );
}
