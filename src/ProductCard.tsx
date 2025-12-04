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
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { memo } from 'react';
import { HeavyComponent } from './HeavyComponent';
import { Product } from './types';

interface ProductCardProps {
    product: Product;
    onAddToCart: (productId: number, quantity: number) => void;
}

export const ProductCard = memo(({ product, onAddToCart }: ProductCardProps) => {
    return (
        <Grid item xs={12} sm={6} md={4}>
            <HeavyComponent />
            <Card style={{ width: '100%' }}>
                <CardMedia
                    component="img"
                    height="150"
                    image={product.imageUrl}
                    alt={product.name}
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
                    <Box position="relative" display="flex" flexDirection="row" alignItems="center">
                        <Box position="absolute" left={0} right={0} top={0} bottom={0} textAlign="center">
                            {product.loading && <CircularProgress size={20} />}
                        </Box>
                        <IconButton
                            disabled={product.loading}
                            aria-label="remove from cart"
                            size="small"
                            onClick={() => onAddToCart(product.id, -1)}
                        >
                            <RemoveIcon fontSize="small" />
                        </IconButton>

                        <Typography variant="body1" component="div" mx={1}>
                            {product.itemInCart || 0}
                        </Typography>

                        <IconButton
                            disabled={product.loading}
                            aria-label="add to cart"
                            size="small"
                            onClick={() => onAddToCart(product.id, 1)}
                        >
                            <AddIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </CardActions>
            </Card>
        </Grid>
    );
});
