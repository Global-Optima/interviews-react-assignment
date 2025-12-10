import { useState } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardMedia,
    CardContent,
    Divider,
    Stack,

    CircularProgress,
    Fade,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { useCheckout } from './useCheckout';
import { CartItem } from './types';

export function CartReviewStep() {
    const { cart, updateCartItem } = useCheckout();
    const [loadingItems, setLoadingItems] = useState<Record<number, boolean>>({});

    const handleQuantityChange = async (item: CartItem, delta: number) => {
        const productId = item.product.id;
        setLoadingItems(prev => ({ ...prev, [productId]: true }));
        await updateCartItem(productId, delta);
        setLoadingItems(prev => ({ ...prev, [productId]: false }));
    };

    const handleRemoveItem = async (item: CartItem) => {
        const productId = item.product.id;
        setLoadingItems(prev => ({ ...prev, [productId]: true }));
        await updateCartItem(productId, -item.quantity);
        setLoadingItems(prev => ({ ...prev, [productId]: false }));
    };

    const items = cart?.items ?? [];
    const subtotal = cart?.totalPrice ?? 0;
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    if (items.length === 0) {
        return (
            <Fade in timeout={400}>
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight={300}
                    textAlign="center"
                    p={4}
                >
                    <ShoppingCartOutlinedIcon
                        sx={{ fontSize: 80, color: 'grey.400', mb: 2 }}
                        aria-hidden="true"
                    />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        Your cart is empty
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Add some products to your cart to continue with checkout.
                    </Typography>
                </Box>
            </Fade>
        );
    }

    return (
        <Fade in timeout={400}>
            <Box>
                <Stack spacing={2} sx={{ mb: 3 }}>
                    {items.map((item) => (
                        <Card
                            key={item.product.id}
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                flexDirection: { xs: 'column', sm: 'row' },
                                alignItems: { sm: 'center' },
                                p: 2,
                                position: 'relative',
                                opacity: loadingItems[item.product.id] ? 0.6 : 1,
                                transition: 'opacity 0.2s',
                            }}
                        >
                            {loadingItems[item.product.id] && (
                                <CircularProgress
                                    size={24}
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        marginTop: '-12px',
                                        marginLeft: '-12px',
                                    }}
                                />
                            )}
                            <CardMedia
                                component="img"
                                sx={{
                                    width: { xs: '100%', sm: 80 },
                                    height: { xs: 120, sm: 80 },
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    flexShrink: 0,
                                }}
                                image={item.product.imageUrl}
                                alt={item.product.name}
                            />
                            <CardContent
                                sx={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: { xs: 'column', sm: 'row' },
                                    alignItems: { sm: 'center' },
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    py: { xs: 2, sm: 0 },
                                    '&:last-child': { pb: { xs: 0, sm: 0 } },
                                }}
                            >
                                <Box flex={1}>
                                    <Typography variant="subtitle1" fontWeight={500}>
                                        {item.product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {item.product.category}
                                    </Typography>
                                    <Typography variant="body2" color="primary" fontWeight={500}>
                                        ${item.product.price.toFixed(2)}
                                    </Typography>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                >
                                    <IconButton
                                        size="small"
                                        onClick={() => handleQuantityChange(item, -1)}
                                        disabled={loadingItems[item.product.id] || item.quantity <= 1}
                                        aria-label={`Decrease quantity of ${item.product.name}`}
                                    >
                                        <RemoveIcon fontSize="small" />
                                    </IconButton>
                                    <Typography
                                        sx={{
                                            minWidth: 32,
                                            textAlign: 'center',
                                            fontWeight: 500,
                                        }}
                                        aria-label={`Quantity: ${item.quantity}`}
                                    >
                                        {item.quantity}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleQuantityChange(item, 1)}
                                        disabled={loadingItems[item.product.id]}
                                        aria-label={`Increase quantity of ${item.product.name}`}
                                    >
                                        <AddIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box display="flex" alignItems="center" gap={2}>
                                    <Typography variant="subtitle1" fontWeight={600} sx={{ minWidth: 80, textAlign: 'right' }}>
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                    </Typography>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleRemoveItem(item)}
                                        disabled={loadingItems[item.product.id]}
                                        aria-label={`Remove ${item.product.name} from cart`}
                                    >
                                        <DeleteOutlineIcon />
                                    </IconButton>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ maxWidth: 300, ml: 'auto' }}>
                    <Stack spacing={1}>
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">Subtotal</Typography>
                            <Typography>${subtotal.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between">
                            <Typography color="text.secondary">Tax (10%)</Typography>
                            <Typography>${tax.toFixed(2)}</Typography>
                        </Box>
                        <Divider />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="h6">Total</Typography>
                            <Typography variant="h6" color="primary">
                                ${total.toFixed(2)}
                            </Typography>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Fade>
    );
}
