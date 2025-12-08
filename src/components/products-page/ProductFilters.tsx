import { Box, Typography, Button, Chip, Slider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

interface ProductFiltersProps {
  searchText: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  priceRange: [number, number];
  sortBy: string;
  sortOrder: "asc" | "desc";
  totalResults: number;
  maxPriceChange: number;
  onPriceRangeChange: (value: [number, number]) => void;
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void;
  clearAll: () => void;
  clearSearch: () => void;
  clearCategory: () => void;
  clearPrice: () => void;
}

export function ProductFilters({
  searchText,
  category,
  minPrice,
  maxPrice,
  priceRange,
  sortBy,
  sortOrder,
  totalResults,
  maxPriceChange,
  onPriceRangeChange,
  onSortChange,
  clearAll,
  clearSearch,
  clearCategory,
  clearPrice,
}: ProductFiltersProps) {

  return (
    <Box display="flex" flexDirection="column" gap={1} p={1}>
      {/* Active Filters as Chips */}
      <Box display="flex" flexWrap="wrap" alignItems="center" mt={1}>
        {/* Sorting */}
        <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
                value={`${sortBy}-${sortOrder}`}
                label="Sort By"
                onChange={e => {
                    const [field, order] = (e.target.value as string).split("-");
                    onSortChange(field, order as "asc" | "desc");
                }}
            >
            <MenuItem value="name-asc">Name A → Z</MenuItem>
            <MenuItem value="name-desc">Name Z → A</MenuItem>
            <MenuItem value="price-asc">Price Low → High</MenuItem>
            <MenuItem value="price-desc">Price High → Low</MenuItem>
            </Select>
        </FormControl>

        {/* Price Slider */}
        <Box width="50%" maxWidth={400} ml={3}>
            <Typography variant="body2">Price Range</Typography>
            <Slider
                value={priceRange}
                min={0}
                max={maxPriceChange}
                onChange={(_, value) => onPriceRangeChange(value as [number, number])}
                valueLabelDisplay="auto"
            />
        </Box>
      </Box>
      <Box display="flex" flexWrap="wrap" gap={1} alignItems="center" mt={1}>
        {category && (
          <Chip label={`Category: ${category}`} onDelete={clearCategory} color="primary" variant="outlined" />
        )}
        {searchText && (
          <Chip label={`Search: "${searchText}"`} onDelete={clearSearch} color="primary" variant="outlined" />
        )}
        {(minPrice !== null || maxPrice !== null) && (
          <Chip
            label={`Price: $${minPrice ?? 0} - ${maxPrice === Infinity? 'Max' : `$${maxPrice ?? priceRange[1]}`}`}
            onDelete={clearPrice}
            color="primary"
            variant="outlined"
          />
        )}
        {(category || searchText || minPrice !== null || maxPrice !== null) && (
          <Button size="small" color="error" variant="outlined" onClick={clearAll}>
            Clear All
          </Button>
        )}
        {/* Result count */}
        <Typography variant="body2" sx={{ ml: 1 }}>
            {totalResults} results
        </Typography>
      </Box>
    </Box>
  );
}
