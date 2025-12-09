import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  CircularProgress,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { HeavyComponent } from "../../../HeavyComponent";
import { Product } from "../model/types";
import { memo } from "react";
import { useCart } from "../../cart/hooks/use-cart";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(
  ({ product }: ProductCardProps) => {
    const { isProductLoading, getProductQuantity, addToCart } = useCart();

    return (
      <Grid item xs={4} key={product.id}>
        {/* Do not remove this */}
        <HeavyComponent />
        <Card key={product.id} style={{ width: "100%" }}>
          <CardMedia
            component="img"
            height="150"
            image={
              "https://via.assets.so/img.jpg?w=400&h=150&gradientFrom=56CCF2&gradientTo=2F80ED&gradientAngle=135&f=png"
            }
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
              {product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            </Typography>
          </CardContent>
          <CardActions>
            <Typography variant="h6" component="div">
              ${product.price}
            </Typography>
            <Box flexGrow={1} />
            <Box
              position="relative"
              display="flex"
              flexDirection="row"
              alignItems="center"
            >
              <Box
                position="absolute"
                left={0}
                right={0}
                top={0}
                bottom={0}
                textAlign="center"
              >
                {isProductLoading(product.id) && <CircularProgress size={20} />}
              </Box>
              <IconButton
                disabled={isProductLoading(product.id)}
                aria-label="delete"
                size="small"
                onClick={() => addToCart(product, -1)}
              >
                <RemoveIcon fontSize="small" />
              </IconButton>

              <Typography variant="body1" component="div" mx={1}>
                {getProductQuantity(product.id) || 0}
              </Typography>

              <IconButton
                disabled={isProductLoading(product.id)}
                aria-label="add"
                size="small"
                onClick={() => addToCart(product, 1)}
              >
                <AddIcon fontSize="small" />
              </IconButton>
            </Box>
          </CardActions>
        </Card>
      </Grid>
    );
  }
);
