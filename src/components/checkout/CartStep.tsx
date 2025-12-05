import React, { useState } from "react";
import {
  Box,
  Grid,
  IconButton,
  Card,
  CardContent,
  Typography,
  Avatar,
  Paper,
  Divider,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import { StepProps } from "../../types/checkout";
import { storage } from "../../utils/storage";

const CartStep: React.FC<StepProps> = ({ cart, setCart }) => {
  const [loading, setLoading] = useState<Record<number, boolean>>({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  if (!cart || cart.items.length === 0) {
    return (
      <Box sx={{ textAlign: "center", py: 6 }}>
        <LocalShippingIcon sx={{ fontSize: 56, opacity: 0.5, mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => (window.location.href = "/products")}
        >
          Browse Products
        </Button>
      </Box>
    );
  }

  const handleQuantityChange = async (productId: number, delta: number) => {
    setLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: delta }),
      });
      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
        storage.saveCart(updatedCart);
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update cart",
        severity: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId: number) => {
    const item = cart.items.find((item) => item.product.id === productId);
    if (!item) return;

    setLoading((prev) => ({ ...prev, [productId]: true }));
    try {
      const response = await fetch("/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: -item.quantity }),
      });
      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart);
        storage.saveCart(updatedCart);
      }
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to remove item",
        severity: "error",
      });
    } finally {
      setLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const subtotal = cart.totalPrice;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {cart.items.map((item) => (
            <Card key={item.product.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <Avatar
                      src={item.product.imageUrl}
                      variant="rounded"
                      sx={{ width: 80, height: 80 }}
                    />
                  </Grid>
                  <Grid item xs>
                    <Typography variant="h6">{item.product.name}</Typography>
                    <Typography
                      variant="body1"
                      color="primary"
                      fontWeight="bold"
                    >
                      ${item.product.price.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Box display="flex" alignItems="center">
                      <IconButton
                        onClick={() =>
                          handleQuantityChange(item.product.id, -1)
                        }
                        disabled={
                          loading[item.product.id] || item.quantity <= 1
                        }
                        size="small"
                        aria-label={`Decrease ${item.product.name}`}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <Typography
                        sx={{ mx: 2, minWidth: 40, textAlign: "center" }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        onClick={() => handleQuantityChange(item.product.id, 1)}
                        disabled={loading[item.product.id]}
                        size="small"
                        aria-label={`Increase ${item.product.name}`}
                      >
                        <AddIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleRemoveItem(item.product.id)}
                        disabled={loading[item.product.id]}
                        size="small"
                        aria-label={`Remove ${item.product.name}`}
                        sx={{ ml: 1 }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${subtotal.toFixed(2)}</Typography>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography color="success.main">FREE</Typography>
              </Grid>
              <Grid container justifyContent="space-between" sx={{ mb: 1 }}>
                <Typography>Tax (10%)</Typography>
                <Typography>${tax.toFixed(2)}</Typography>
              </Grid>
              <Divider sx={{ my: 2 }} />
              <Grid container justifyContent="space-between">
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${total.toFixed(2)}
                </Typography>
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default CartStep;
