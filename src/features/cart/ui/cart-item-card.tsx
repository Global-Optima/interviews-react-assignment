import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, IconButton, Paper, TextField, Typography } from "@mui/material";
import { Product } from "../../products/model/types";
import { useCart } from "../hooks/use-cart";

interface CartItemCardProps {
  product: Product;
  quantity: number;
}

export const CartItemCard = ({ product, quantity }: CartItemCardProps) => {
  const { addToCart } = useCart();

  return (
    <Paper
      key={product.id}
      sx={{ p: 2, mb: 2, display: "flex", gap: 2 }}
      elevation={1}
    >
      <Box
        component="img"
        src={product.imageUrl}
        alt={product.name}
        sx={{
          width: 80,
          height: 80,
          objectFit: "cover",
          borderRadius: 1,
        }}
      />

      <Box >
        <Typography variant="subtitle1" fontWeight="bold">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          ${product.price.toFixed(2)} each
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <IconButton size="small" onClick={() => addToCart(product, -1)}>
            <RemoveIcon fontSize="small" />
          </IconButton>

          <TextField
            size="small"
            value={quantity}
            sx={{ width: 60 }}
            inputProps={{
              style: { textAlign: "center" },
              min: 0,
            }}
            type="number"
          />

          <IconButton size="small" onClick={() => addToCart(product, 1)}>
            <AddIcon fontSize="small" />
          </IconButton>

          <IconButton
            size="small"
            color="error"
             onClick={() => addToCart(product, -quantity)}
            // disabled={isProductLoading(item.product.id)}
            sx={{ ml: "auto" }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ textAlign: "right" }}>
        <Typography variant="subtitle1" fontWeight="bold">
          ${(product.price * quantity).toFixed(2)}
        </Typography>
      </Box>
    </Paper>
  );
};
