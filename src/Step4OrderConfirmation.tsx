import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";
import { Product } from "./Products";
import { ShippingDetails } from "./Step2ShippingDetails";
import { PaymentDetails } from "./Checkout";

export const Step4OrderConfirmation = ({
  items,
  shipping,
  payment,
  subtotal,
  tax,
  total,
  orderStatus,
  orderMessage,
  onRetry,
}: {
  items: Product[];
  shipping: ShippingDetails;
  payment: PaymentDetails;
  subtotal: number;
  tax: number;
  total: number;
  orderStatus: "idle" | "loading" | "success" | "failure";
  orderMessage: string;
  onPlaceOrder: () => void;
  onRetry: () => void;
}) => {
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Review and Place Order
      </Typography>

      {orderStatus !== "idle" && (
        <Box my={2}>
          <Alert
            severity={
              orderStatus === "success"
                ? "success"
                : orderStatus === "failure"
                ? "error"
                : "info"
            }
          >
            {orderStatus === "loading" ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Processing your order...
              </Box>
            ) : (
              orderMessage
            )}
          </Alert>
        </Box>
      )}

      {/* --- Order Details Summary --- */}
      <Box mt={3} p={2} border={1} borderColor="grey.300" borderRadius={1}>
        <Typography variant="h6" gutterBottom>
          📦 Items Summary
        </Typography>
        <List dense disablePadding>
          {items.map((item) => (
            <ListItem key={item.id} disableGutters>
              <ListItemText
                primary={`${item.name} x ${item.itemInCart}`}
                secondary={`$${(item.price * item.itemInCart).toFixed(2)}`}
              />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box mt={3} p={2} border={1} borderColor="grey.300" borderRadius={1}>
        <Typography variant="h6" gutterBottom>
          🚚 Shipping and Payment
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Shipping Address:
            </Typography>
            <Typography>{shipping.fullName}</Typography>
            <Typography>{shipping.phone}</Typography>
            <Typography>
              {shipping.city}, {shipping.postalCode}
            </Typography>
            <Typography>{shipping.address}</Typography>
            <Typography variant="body2" color="text.secondary" mt={1}>
              Delivery Slot: {shipping.timeSlot}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" fontWeight="bold">
              Payment Method:
            </Typography>
            <Typography>{payment.method}</Typography>
            {payment.method === "Credit Card" && (
              <Typography variant="body2" color="text.secondary">
                Card ending in **{payment.cardNumber.slice(-4)}**
              </Typography>
            )}
            {payment.method === "PayPal" && (
              <Typography variant="body2" color="text.secondary">
                Payment via redirection
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>

      {/* --- Financial Summary --- */}
      <Box mt={3} p={2} border={1} borderColor="primary.main" borderRadius={1}>
        <Typography variant="h6" gutterBottom>
          Final Total
        </Typography>
        <Box sx={{ "& > *": { my: 1 } }}>
          <Box display="flex" justifyContent="space-between">
            <Typography>Subtotal:</Typography>
            <Typography fontWeight="bold">${subtotal.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>Tax (10%):</Typography>
            <Typography fontWeight="bold">${tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h5">Total Due:</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              ${total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
        {orderStatus !== "success" && (
          <Button
            onClick={onRetry}
            disabled={orderStatus === "loading" || items.length === 0}
            variant="contained"
            color={orderStatus === "failure" ? "warning" : "success"}
            size="large"
            aria-label={
              orderStatus === "failure" ? "Retry Order" : "Place Order"
            }
          >
            {orderStatus === "loading" ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Placing Order...
              </Box>
            ) : orderStatus === "failure" ? (
              "Retry Order"
            ) : (
              "Place Order"
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
};
