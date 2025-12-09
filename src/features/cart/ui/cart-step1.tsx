import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
    Box,
    Button,
    Divider,
    Typography
} from "@mui/material";
import { useStepperContext } from '../../../shared/hooks/useStepperContext';
import { useCart } from "../hooks/use-cart";
import { CartItemCard } from "./cart-item-card";

export const CartStep1 = () => {
  const { cart} = useCart();
  const { nextPage } = useStepperContext();

  const subtotal = cart?.totalPrice || 0;
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handleSubmit = () => {
    nextPage();
  };

  if (!cart || cart.items.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          py: 8,
          textAlign: "center",
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: 50, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>

      </Box>
    );
  }

  return (
    <Box sx={{ maxHeight: "500px", overflowY: "auto" }}>
      <Typography variant="h6" gutterBottom>
        Cart Review
      </Typography>

      <Box sx={{ mb: 3 }}>
        {cart.items.map((item) => (
            <CartItemCard product={item.product} quantity={item.quantity}></CartItemCard>
        ))}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body1">Subtotal:</Typography>
          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
          <Typography variant="body1">Tax (10%):</Typography>
          <Typography variant="body1">${tax.toFixed(2)}</Typography>
        </Box>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Total:
          </Typography>
          <Typography variant="h6" fontWeight="bold">
            ${total.toFixed(2)}
          </Typography>
        </Box>
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        sx={{ width: "100%" }}
      >
        Continue
      </Button>
    </Box>
  );
};
