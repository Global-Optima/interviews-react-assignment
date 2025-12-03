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
import React from "react";
import { Product } from "../types/Product.types";

export const ProductCard = React.memo(
  ({ product, addToCart }: ProductCardProps) => {

    return (
      <Card style={{ width: "100%" }}>
        <CardMedia component="img" height="150" image={product.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant="h6">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          </Typography>
        </CardContent>

        <CardActions>
          <Typography variant="h6">${product.price}</Typography>
          <Box flexGrow={1} />
          <Box position="relative" display="flex" alignItems="center">
            {product.loading && (
              <CircularProgress
                size={20}
                style={{ position: "absolute", left: 0, right: 0 }}
              />
            )}
            <IconButton
              disabled={product.loading}
              size="small"
              onClick={() => addToCart(product.id, -1)}
            >
              <RemoveIcon fontSize="small" />
            </IconButton>
            <Typography mx={1}>{product.itemInCart || 0}</Typography>
            <IconButton
              disabled={product.loading}
              size="small"
              onClick={() => addToCart(product.id, 1)}
            >
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    );
  }
);

interface ProductCardProps {
  product: Product;
  addToCart: (productId: number, quantity: number) => void;
}
