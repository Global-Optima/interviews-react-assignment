import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Product } from "./Products";

interface ProductItemProps {
  product: Product;
  addToCart: (productId: number, quantity: number) => void;
}

const ProductItem = ({ product, addToCart }: ProductItemProps) => {
  return (
    <Card sx={{ width: "100%" }}>
      <CardMedia component="img" height={150} image={product.imageUrl} />
      <CardContent>
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </Typography>
      </CardContent>
      <CardActions>
        <Typography variant="h6" component="div">
          ${product.price}
        </Typography>
        <Box flexGrow={1} />
        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
          {product.loading && (
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress size={20} />
            </Box>
          )}
          <IconButton
            size="small"
            disabled={product.loading}
            onClick={() => addToCart(product.id, -1)}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography variant="body1" component="div" sx={{ mx: 1 }}>
            {product.itemInCart || 0}
          </Typography>
          <IconButton
            size="small"
            disabled={product.loading}
            onClick={() => addToCart(product.id, 1)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
