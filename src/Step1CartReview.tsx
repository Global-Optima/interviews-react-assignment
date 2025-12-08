import {
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import { Cart, Product } from "./Products";

const mockCartUpdate = (
  currentCart: Cart,
  productId: number,
  quantityChange: number
): Cart => {
  const itemIndex = currentCart.items.findIndex(
    (item) => item.id === productId
  );

  if (itemIndex === -1 && quantityChange <= 0) return currentCart;

  const currentItem = currentCart.items[itemIndex] || {
    id: productId,
    name: "Unknown",
    imageUrl: "",
    price: 0,
    category: "",
    itemInCart: 0,
    loading: false,
  };

  const newQty = currentItem.itemInCart + quantityChange;

  let newItems: Product[] = [];
  if (newQty > 0) {
    newItems = currentCart.items.map((item, index) =>
      index === itemIndex ? { ...item, itemInCart: newQty } : item
    );
  } else {
    newItems = currentCart.items.filter((_item, index) => index !== itemIndex);
  }
  const newTotalItems = newItems.reduce(
    (acc, item) => acc + item.itemInCart,
    0
  );
  const newTotalPrice = newItems.reduce(
    (acc, item) => acc + item.itemInCart * item.price,
    0
  );

  return {
    items: newItems,
    totalItems: newTotalItems,
    totalPrice: newTotalPrice,
  };
};

const CartItem = ({
  item,
  onUpdate,
}: {
  item: Product;
  onUpdate: (id: number, qty: number) => void;
}) => {
  return (
    <Card sx={{ display: "flex", mb: 2, alignItems: "center" }} elevation={1}>
      <CardMedia
        component="img"
        sx={{ width: 80, height: 80, objectFit: "cover" }}
        image={item.imageUrl}
        alt={item.name}
      />
      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <CardContent
          sx={{ flex: "1 0 auto", py: 1, "&:last-child": { pb: 1 } }}
        >
          <Typography component="div" variant="body1">
            {item.name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            ${item.price.toFixed(2)}
          </Typography>
        </CardContent>
      </Box>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        mx={2}
        sx={{ minWidth: 150, justifyContent: "flex-end" }}
      >
        <IconButton
          size="small"
          onClick={() => onUpdate(item.id, -1)}
          aria-label="Decrease quantity"
        >
          <RemoveIcon fontSize="inherit" />
        </IconButton>
        <Typography variant="body1" component="span" mx={1}>
          {item.itemInCart}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onUpdate(item.id, 1)}
          aria-label="Increase quantity"
        >
          <AddIcon fontSize="inherit" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onUpdate(item.id, -item.itemInCart)}
          aria-label="Remove item"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </Card>
  );
};

export const Step1CartReview = ({
  cart,
  subtotal,
  tax,
  total,
  onCartUpdate,
}: {
  cart: Cart;
  subtotal: number;
  tax: number;
  total: number;
  onCartUpdate: (newCart: Cart) => void;
}) => {
  const handleUpdate = (productId: number, quantityChange: number) => {
    // in a real app, this would call the /cart for this, we mock the local state update
    const newCart = mockCartUpdate(cart, productId, quantityChange);
    onCartUpdate(newCart);
  };

  if (cart.totalItems === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Your cart is empty 🙁
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add some products to proceed with the checkout.
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4}>
      <Grid item xs={12} md={8}>
        <Typography variant="h5" gutterBottom>
          Items in Cart ({cart.totalItems})
        </Typography>
        <Box
          sx={{
            maxHeight: 400,
            overflowY: "auto",
            pr: 1,
            "&::-webkit-scrollbar": { width: "8px" },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "rgba(0,0,0,.1)",
              borderRadius: "10px",
            },
          }}
        >
          {cart.items.map((item) => (
            <CartItem key={item.id} item={item} onUpdate={handleUpdate} />
          ))}
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <Typography variant="h5" gutterBottom>
          Order Summary
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
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" fontWeight="bold" color="primary">
              ${total.toFixed(2)}
            </Typography>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
};
