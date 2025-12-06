import { Box, Chip, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface FilterBarProps {
    searchTerm: string;
    selectedCategory: string;
    resultCount: number | null;
    onClearSearch: () => void;
    onClearCategory: () => void;
    onClearAll: () => void;
}

export const FilterBar = ({
    searchTerm,
    selectedCategory,
    resultCount,
    onClearSearch,
    onClearCategory,
    onClearAll
}: FilterBarProps) => {
    const hasFilters = searchTerm || selectedCategory;

    if (!hasFilters && resultCount === null) {
        return null;
    }

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

            <Box flexGrow={1} />

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
