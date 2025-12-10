import { Box, Chip, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { ReactNode } from 'react';

interface FilterBarProps {
    searchTerm: string;
    selectedCategory: string;
    minPrice: number | null;
    maxPrice: number | null;
    resultCount: number | null;
    children?: ReactNode;
    onClearSearch: () => void;
    onClearCategory: () => void;
    onClearPriceRange: () => void;
    onClearAll: () => void;
}

export const FilterBar = ({
    searchTerm,
    selectedCategory,
    minPrice,
    maxPrice,
    resultCount,
    children,
    onClearSearch,
    onClearCategory,
    onClearPriceRange,
    onClearAll
}: FilterBarProps) => {
    const hasPriceFilter = minPrice !== null || maxPrice !== null;
    const hasFilters = searchTerm || selectedCategory || hasPriceFilter;

    if (!hasFilters && resultCount === null) {
        return null;
    }

    const formatPriceLabel = () => {
        if (minPrice !== null && maxPrice !== null) {
            return `Price: $${minPrice} - $${maxPrice}`;
        } else if (minPrice !== null) {
            return `Price: $${minPrice}+`;
        } else if (maxPrice !== null) {
            return `Price: up to $${maxPrice}`;
        }
        return '';
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            gap={1}
            px={2}
            py={1}
            bgcolor="grey.100"
            flexWrap="wrap"
        >
            {resultCount !== null && (
                <Box
                    component="span"
                    fontWeight="medium"
                    fontSize="0.875rem"
                    mr={2}
                >
                    {resultCount} {resultCount === 1 ? 'product' : 'products'}
                </Box>
            )}

            {hasFilters && (
                <Box component="span" color="text.secondary" fontSize="0.875rem">
                    Active filters:
                </Box>
            )}

            {searchTerm && (
                <Chip
                    label={`Search: "${searchTerm}"`}
                    size="small"
                    onDelete={onClearSearch}
                    color="primary"
                    variant="outlined"
                />
            )}

            {selectedCategory && (
                <Chip
                    label={`Category: ${selectedCategory}`}
                    size="small"
                    onDelete={onClearCategory}
                    color="primary"
                    variant="outlined"
                />
            )}

            {hasPriceFilter && (
                <Chip
                    label={formatPriceLabel()}
                    size="small"
                    onDelete={onClearPriceRange}
                    color="primary"
                    variant="outlined"
                />
            )}

            <Box flexGrow={1} />

            {children}

            <Button
                size="small"
                startIcon={<ClearIcon />}
                onClick={onClearAll}
                color="inherit"
            >
                Clear All
            </Button>
        </Box>
    );
};
