import { Box, CircularProgress, Typography, Button, Alert, useTheme, useMediaQuery } from '@mui/material';
import { useEffect, useCallback, useRef } from 'react';
import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { useProducts, SortOption } from '../../hooks/useProducts';
import { ProductCard } from './ProductCard';
import { Cart } from '../../types';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import RefreshIcon from '@mui/icons-material/Refresh';

export const Products = ({
    onCartChange,
    onTotalCountChange,
    searchTerm,
    selectedCategory,
    sortBy = '',
    minPrice = null,
    maxPrice = null
}: {
    onCartChange: (cart: Cart) => void;
    onTotalCountChange?: (count: number | null) => void;
    searchTerm: string;
    selectedCategory: string;
    sortBy?: SortOption;
    minPrice?: number | null;
    maxPrice?: number | null;
}) => {
    const { products, loading, hasMore, error, totalCount, loadMore, setProducts, resetError } = useProducts({
        searchTerm,
        category: selectedCategory,
        sortBy,
        minPrice,
        maxPrice
    });

    const theme = useTheme();
    const isSm = useMediaQuery(theme.breakpoints.up('sm'));
    const isMd = useMediaQuery(theme.breakpoints.up('md'));
    const columnCount = isMd ? 3 : isSm ? 2 : 1;
    const gutter = 16;

    const onCartChangeRef = useRef(onCartChange);
    useEffect(() => {
        onCartChangeRef.current = onCartChange;
    }, [onCartChange]);

    useEffect(() => {
        onTotalCountChange?.(totalCount);
    }, [totalCount, onTotalCountChange]);

    const addToCart = useCallback((productId: number, quantity: number) => {
        setProducts(prev => prev.map(product => {
            if (product.id === productId) {
                return {
                    ...product,
                    itemInCart: (product.itemInCart || 0) + quantity,
                    loading: true,
                };
            }
            return product;
        }));

        fetch('/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ productId, quantity }),
        })
            .then(async response => {
                if (response.ok) {
                    const cart = await response.json();

                    setProducts(prev => prev.map(product => {
                        if (product.id === productId) {
                            return {
                                ...product,
                                loading: false,
                            };
                        }
                        return product;
                    }));

                    onCartChangeRef.current(cart);
                } else {
                    throw new Error('Failed to update cart');
                }
            })
            .catch(() => {
                setProducts(prev => prev.map(product => {
                    if (product.id === productId) {
                        return {
                            ...product,
                            itemInCart: (product.itemInCart || 0) - quantity,
                            loading: false,
                        };
                    }
                    return product;
                }));
            });
    }, [setProducts]);

    const handleRetry = useCallback(() => {
        resetError();
        loadMore();
    }, [resetError, loadMore]);

    const Cell = ({ columnIndex, rowIndex, style, data }: GridChildComponentProps) => {
        const { products, columnCount } = data;
        const index = rowIndex * columnCount + columnIndex;
        const product = products[index];

        if (!product) return null;

        const left = parseFloat(style.left?.toString() || '0') + gutter;
        const top = parseFloat(style.top?.toString() || '0') + gutter;
        const width = parseFloat(style.width?.toString() || '0') - gutter;
        const height = parseFloat(style.height?.toString() || '0') - gutter;

        return (
            <div style={{ ...style, left, top, width, height }}>
                <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                />
            </div>
        );
    };

    if (error && products.length === 0) {
        return (
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="100%"
                p={4}
            >
                <Alert
                    severity="error"
                    sx={{ mb: 2, maxWidth: 400 }}
                >
                    {error}
                </Alert>
                <Button
                    variant="contained"
                    startIcon={<RefreshIcon />}
                    onClick={handleRetry}
                >
                    Try Again
                </Button>
            </Box>
        );
    }

    const showEmptyState = !loading && products.length === 0 && !error;

    return (
        <Box height="100%" width="100%" p={0}>
            {showEmptyState ? (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    p={4}
                >
                    <SearchOffIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No products found
                    </Typography>
                    <Typography variant="body1" color="text.secondary" textAlign="center">
                        {searchTerm || selectedCategory
                            ? "Try adjusting your search or filter criteria"
                            : "No products are available at the moment"}
                    </Typography>
                </Box>
            ) : (
                <AutoSizer>
                    {({ height, width }) => {
                        const rowCount = Math.ceil(products.length / columnCount);
                        const itemHeight = 350;

                        return (
                            <Grid
                                columnCount={columnCount}
                                columnWidth={(width - gutter) / columnCount}
                                height={height}
                                rowCount={rowCount}
                                rowHeight={itemHeight}
                                width={width}
                                itemData={{ products, columnCount }}
                                onItemsRendered={({ visibleRowStopIndex }) => {
                                    if (visibleRowStopIndex >= rowCount - 2 && hasMore && !loading) {
                                        loadMore();
                                    }
                                }}
                            >
                                {Cell}
                            </Grid>
                        );
                    }}
                </AutoSizer>
            )}
            {loading && products.length === 0 && (
                <Box display="flex" justifyContent="center" p={2} position="absolute" top="50%" left="50%">
                    <CircularProgress />
                </Box>
            )}
            {error && products.length > 0 && (
                <Box position="absolute" bottom={20} left="50%" sx={{ transform: 'translateX(-50%)' }} bgcolor="background.paper" p={2} borderRadius={1} boxShadow={3}>
                    <Typography color="error" variant="body2">{error}</Typography>
                    <Button size="small" onClick={handleRetry}>Retry</Button>
                </Box>
            )}
        </Box>
    );
};
