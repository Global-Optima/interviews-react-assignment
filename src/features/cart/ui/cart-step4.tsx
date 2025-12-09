import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useCart } from "../hooks/use-cart";
import { useCartForm } from "../hooks/use-cart-form";

export const CartStep4 = () => {
  const { cart, clearCart } = useCart();
  const { shipping, payment, clearForm } = useCartForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      const orderData = {
        items: cart?.items,
        shipping,
        payment,
        total: cart?.totalPrice,
      };

      const response = await fetch("/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to place order. Please try again.");
      }

      // Success
      setSuccess(true);
      clearCart();
      clearForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ textAlign: "center", py: 4 }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Order confirmed!
        </Alert>
        
      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: "500px", overflowY: "auto", px: 1 }}>
      <Typography variant="h6" gutterBottom>
        Order Confirmation
      </Typography>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Order Items
          </Typography>
          {cart?.items.map((item) => (
            <Box
              key={item.product.id}
              sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}
            >
              <Typography variant="body2">
                {item.product.name} x {item.quantity}
              </Typography>
              <Typography variant="body2">
                ${(item.product.price * item.quantity).toFixed(2)}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="subtitle1" fontWeight="bold">
              ${cart?.totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Shipping Address
          </Typography>
          {shipping && (
            <>
              <Typography variant="body2">{shipping.fullName}</Typography>
              <Typography variant="body2">{shipping.address}</Typography>
              <Typography variant="body2">
                {shipping.city}, {shipping.postalCode}
              </Typography>
              <Typography variant="body2">{shipping.phone}</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Delivery: {shipping.deliveryTimeSlot}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
            Payment Method
          </Typography>
          {payment && (
            <>
              {payment.method === "credit_card" && (
                <Typography variant="body2">
                  Credit Card ending in{" "}
                  {payment.cardNumber.slice(-4)}
                </Typography>
              )}
              {payment.method === "paypal" && (
                <Typography variant="body2">PayPal</Typography>
              )}
              {payment.method === "cash" && (
                <Typography variant="body2">Cash on Delivery</Typography>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        size="large"
        onClick={handlePlaceOrder}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} /> : "Place Order"}
      </Button>
    </Box>
  );
};