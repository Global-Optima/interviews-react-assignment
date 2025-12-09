import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import React from "react";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Product } from "../../App";

interface ProductItemProps {
  product: Product;
  addToCart: (productId: number, quantity: number) => void;
}

const ProductItem = ({ product, addToCart }: ProductItemProps) => {
  return (
    <Card sx={{ width: "100%", height: 320, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
      <CardMedia component="img" height={150} image={product.imageUrl} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {product.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit
        </Typography>
      </CardContent>
      <CardActions>
        <Typography variant="h6" component="div">
          ${product.price}
        </Typography>
        <Box flexGrow={1} />
        <Box sx={{ position: "relative", display: "flex", alignItems: "center" }}>
          <IconButton
            size="small"
            disabled={!product.itemInCart}
            onClick={() => addToCart(product.id, -1)}
          >
            <RemoveIcon fontSize="small" />
          </IconButton>
          <Typography variant="body1" component="div" sx={{ mx: 1 }}>
            {product.itemInCart || 0}
          </Typography>
          <IconButton
            size="small"
            onClick={() => addToCart(product.id, 1)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
};

export default React.memo(ProductItem);
