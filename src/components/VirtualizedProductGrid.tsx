import React, { useRef, useEffect, useMemo } from 'react';
// @ts-ignore - react-window has type definition issues
import { FixedSizeList } from 'react-window';
import { Box, Grid, useTheme, useMediaQuery } from '@mui/material';
import { Product } from '../hooks/useInfiniteProducts';
import { ProductCard } from './ProductCard';

interface VirtualizedProductGridProps {
  products: Product[];
  onAddToCart: (productId: number, quantity: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

const CARD_HEIGHT = 420; // Approximate height of ProductCard
const GAP = 16; // Grid spacing in pixels

export const VirtualizedProductGrid = React.memo(function VirtualizedProductGrid({
  products,
  onAddToCart,
  onLoadMore,
  hasMore,
  isLoading,
}: VirtualizedProductGridProps) {
  const theme = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<any>(null);
  
  // Responsive columns based on breakpoints
  const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  const isSm = useMediaQuery(theme.breakpoints.only('sm'));
  const isMd = useMediaQuery(theme.breakpoints.only('md'));
  
  const columnCount = useMemo(() => {
    if (isXs) return 1;
    if (isSm) return 2;
    if (isMd) return 3;
    return 3; // lg and up
  }, [isXs, isSm, isMd]);

  // Calculate rows needed for the grid layout
  const rows = useMemo(() => {
    const result: Product[][] = [];
    for (let i = 0; i < products.length; i += columnCount) {
      result.push(products.slice(i, i + columnCount));
    }
    return result;
  }, [products, columnCount]);

  // Infinite scroll handler
  useEffect(() => {
    const list = listRef.current;
    if (!list || !hasMore || isLoading) return;

    const handleScroll = () => {
      const listElement = list as any;
      if (!listElement._outerRef) return;

      const { scrollTop, scrollHeight, clientHeight } = listElement._outerRef;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

      // Load more when 80% scrolled
      if (scrollPercentage > 0.8 && hasMore && !isLoading) {
        onLoadMore();
      }
    };

    const listElement = (list as any)._outerRef;
    if (listElement) {
      listElement.addEventListener('scroll', handleScroll);
      return () => listElement.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, isLoading, onLoadMore]);

  // Row renderer - renders a row of product cards
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const rowProducts = rows[index];
    if (!rowProducts) return null;

    return (
      <div style={style}>
        <Grid container spacing={2} sx={{ px: 1 }}>
          {rowProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <ProductCard product={product} onAddToCart={onAddToCart} />
            </Grid>
          ))}
        </Grid>
      </div>
    );
  };

  const containerHeight = containerRef.current?.clientHeight || 600;
  const containerWidth = containerRef.current?.clientWidth || 800;

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <FixedSizeList
        ref={listRef}
        height={containerHeight}
        width={containerWidth}
        itemCount={rows.length}
        itemSize={CARD_HEIGHT + GAP}
        overscanCount={2}
        style={{
          overflowX: 'hidden',
        }}
      >
        {Row}
      </FixedSizeList>
    </Box>
  );
});
