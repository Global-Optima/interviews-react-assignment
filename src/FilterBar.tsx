import { Box, Chip, Button } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

interface FilterBarProps {
    searchTerm: string;
    selectedCategory: string;
    onClearSearch: () => void;
    onClearCategory: () => void;
    onClearAll: () => void;
}

export const FilterBar = ({
    searchTerm,
    selectedCategory,
    onClearSearch,
    onClearCategory,
    onClearAll
}: FilterBarProps) => {
    const hasFilters = searchTerm || selectedCategory;

    if (!hasFilters) {
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
            <Box component="span" color="text.secondary" fontSize="0.875rem">
                Active filters:
            </Box>

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
