import {
    Box,
    Typography,
    Paper,
    Divider,
    Stack,
    Button,
    CircularProgress,
    Alert,
    Fade,
    Chip,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PaymentIcon from '@mui/icons-material/Payment';
import EmailIcon from '@mui/icons-material/Email';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useCheckout } from './useCheckout';
import { DELIVERY_TIME_SLOTS } from './types';

export function ConfirmationStep() {
    const {
        cart,
        shippingInfo,
        paymentInfo,
        orderStatus,
        orderTrackingNumber,
        orderError,
        submitOrder,
        resetCheckout,
    } = useCheckout();

    const items = cart?.items ?? [];
    const subtotal = cart?.totalPrice ?? 0;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    const deliverySlot = DELIVERY_TIME_SLOTS.find(s => s.value === shippingInfo.deliveryTimeSlot);

    const getPaymentMethodLabel = () => {
        if (paymentInfo.method === 'creditCard') {
            const last4 = paymentInfo.cardDetails?.cardNumber.replace(/\s/g, '').slice(-4) || '****';
            return `Credit Card ending in ${last4}`;
        }
        if (paymentInfo.method === 'paypal') {
            return 'PayPal';
        }
        if (paymentInfo.method === 'cashOnDelivery') {
            return 'Cash on Delivery';
        }
        return '';
    };

    if (orderStatus === 'success') {
        return (
            <Fade in timeout={400}>
                <Box textAlign="center" py={4}>
                    <CheckCircleOutlineIcon
                        sx={{ fontSize: 80, color: 'success.main', mb: 2 }}
                    />
                    <Typography variant="h4" gutterBottom fontWeight={600}>
                        Order Confirmed!
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Thank you for your purchase. Your order has been placed successfully.
                    </Typography>

                    <Paper variant="outlined" sx={{ p: 3, mb: 4, maxWidth: 400, mx: 'auto' }}>
                        <Typography variant="overline" color="text.secondary">
                            Tracking Number
                        </Typography>
                        <Typography variant="h5" fontWeight={600} color="primary" sx={{ fontFamily: 'monospace' }}>
                            {orderTrackingNumber}
                        </Typography>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 3, mb: 4, maxWidth: 500, mx: 'auto', textAlign: 'left' }}>
                        <Stack direction="row" alignItems="center" gap={1} mb={2}>
                            <EmailIcon color="action" />
                            <Typography variant="subtitle1" fontWeight={500}>
                                Email Confirmation Preview
                            </Typography>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            To: {shippingInfo.fullName}
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Your order <strong>{orderTrackingNumber}</strong> has been confirmed and will be
                            delivered to <strong>{shippingInfo.address}, {shippingInfo.city}</strong>.
                        </Typography>
                        <Typography variant="body2" paragraph>
                            Expected delivery: <strong>{deliverySlot?.label} ({deliverySlot?.time})</strong>
                        </Typography>
                        <Typography variant="body2">
                            Total: <strong>${total.toFixed(2)}</strong>
                        </Typography>
                    </Paper>

                    <Button
                        variant="contained"
                        size="large"
                        onClick={resetCheckout}
                        sx={{ minWidth: 200 }}
                    >
                        Continue Shopping
                    </Button>
                </Box>
            </Fade>
        );
    }

    if (orderStatus === 'error') {
        return (
            <Fade in timeout={400}>
                <Box textAlign="center" py={4}>
                    <ErrorOutlineIcon
                        sx={{ fontSize: 80, color: 'error.main', mb: 2 }}
                    />
                    <Typography variant="h4" gutterBottom fontWeight={600}>
                        Order Failed
                    </Typography>
                    <Alert severity="error" sx={{ mb: 4, maxWidth: 400, mx: 'auto' }}>
                        {orderError || 'Something went wrong. Please try again.'}
                    </Alert>
                    <Stack direction="row" gap={2} justifyContent="center">
                        <Button
                            variant="outlined"
                            onClick={resetCheckout}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={submitOrder}
                        >
                            Try Again
                        </Button>
                    </Stack>
                </Box>
            </Fade>
        );
    }

    return (
        <Fade in timeout={400}>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Order Summary
                </Typography>

                <Paper variant="outlined" sx={{ mb: 3 }}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            Items ({items.length})
                        </Typography>
                    </Box>
                    <Divider />
                    <List dense>
                        {items.map((item) => (
                            <ListItem key={item.product.id}>
                                <ListItemAvatar>
                                    <Avatar
                                        variant="rounded"
                                        src={item.product.imageUrl}
                                        alt={item.product.name}
                                        sx={{ width: 48, height: 48 }}
                                    />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={item.product.name}
                                    secondary={`Qty: ${item.quantity}`}
                                />
                                <Typography variant="body2" fontWeight={500}>
                                    ${(item.product.price * item.quantity).toFixed(2)}
                                </Typography>
                            </ListItem>
                        ))}
                    </List>
                </Paper>

                <Paper variant="outlined" sx={{ mb: 3 }}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocationOnIcon fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Shipping Address
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1" fontWeight={500}>
                            {shippingInfo.fullName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {shippingInfo.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {shippingInfo.city}, {shippingInfo.postalCode}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Phone: {shippingInfo.phone}
                        </Typography>
                        <Box mt={1}>
                            <Chip
                                icon={<LocalShippingIcon />}
                                label={`${deliverySlot?.label} (${deliverySlot?.time})`}
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Box>
                </Paper>

                <Paper variant="outlined" sx={{ mb: 3 }}>
                    <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentIcon fontSize="small" />
                        <Typography variant="subtitle2" fontWeight={600}>
                            Payment Method
                        </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ p: 2 }}>
                        <Typography variant="body1">
                            {getPaymentMethodLabel()}
                        </Typography>
                    </Box>
                </Paper>

                <Paper variant="outlined" sx={{ p: 3, bgcolor: 'primary.50' }}>
                    <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography>${subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">Tax (10%)</Typography>
                            <Typography>${tax.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">Shipping</Typography>
                            <Typography color="success.main">Free</Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6" fontWeight={600}>Total</Typography>
                            <Typography variant="h6" fontWeight={600} color="primary">
                                ${total.toFixed(2)}
                            </Typography>
                        </Box>
                    </Stack>
                </Paper>

                <Box mt={4} textAlign="center">
                    <Button
                        variant="contained"
                        size="large"
                        onClick={submitOrder}
                        disabled={orderStatus === 'submitting'}
                        sx={{ minWidth: 250, py: 1.5 }}
                    >
                        {orderStatus === 'submitting' ? (
                            <>
                                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                                Processing...
                            </>
                        ) : (
                            `Place Order - $${total.toFixed(2)}`
                        )}
                    </Button>
                    <Typography variant="caption" display="block" mt={1} color="text.secondary">
                        By placing your order, you agree to our terms and conditions.
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
}
