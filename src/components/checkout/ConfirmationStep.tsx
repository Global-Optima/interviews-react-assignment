import React from "react";
import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Box,
  Divider,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { StepProps, OrderStatus } from "../../types/checkout";

interface ConfirmationStepProps extends StepProps {
  placeOrder: () => Promise<void>;
  orderStatus: OrderStatus;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  cart,
  shipping,
  payment,
  placeOrder,
  orderStatus,
}) => {
  if (!cart) return null;

  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const generateTrackingNumber = () =>
    `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Order Summary
          </Typography>
          {cart.items.map((item) => (
            <Box key={item.product.id} sx={{ mb: 2 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar
                    src={item.product.imageUrl}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                </Grid>
                <Grid item xs>
                  <Typography variant="subtitle1">
                    {item.product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Quantity: {item.quantity}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="subtitle1">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Divider sx={{ my: 2 }} />
          <Grid container justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6" color="primary">
              ${total.toFixed(2)}
            </Typography>
          </Grid>
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Shipping Details
          </Typography>
          <Typography>{shipping.fullName}</Typography>
          <Typography>{shipping.address}</Typography>
          <Typography>
            {shipping.city}, {shipping.postalCode}
          </Typography>
          <Typography>{shipping.phone}</Typography>
          <Typography sx={{ mt: 1 }}>
            <strong>Delivery:</strong> {shipping.deliverySlot}
          </Typography>
        </Paper>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Method
          </Typography>
          <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
            {payment.method === "Credit Card" && (
              <CreditCardIcon sx={{ mr: 1 }} />
            )}
            {payment.method === "PayPal" && (
              <AccountBalanceWalletIcon sx={{ mr: 1 }} />
            )}
            {payment.method === "Cash on Delivery" && (
              <LocalShippingIcon sx={{ mr: 1 }} />
            )}
            <Typography>{payment.method}</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} lg={4}>
        <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
          <Typography variant="h6" gutterBottom>
            Place Order
          </Typography>
          {orderStatus.success ? (
            <Box sx={{ textAlign: "center", py: 3 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Order Confirmed!
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                ID: {orderStatus.orderId}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Tracking: {generateTrackingNumber()}
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => (window.location.href = "/products")}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={placeOrder}
                disabled={orderStatus.loading}
                startIcon={
                  orderStatus.loading ? <CircularProgress size={20} /> : null
                }
              >
                {orderStatus.loading ? "Processing..." : "Place Order"}
              </Button>
              {orderStatus.error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {orderStatus.error}
                  <Button size="small" onClick={placeOrder} sx={{ ml: 1 }}>
                    Retry
                  </Button>
                </Alert>
              )}
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ConfirmationStep;
