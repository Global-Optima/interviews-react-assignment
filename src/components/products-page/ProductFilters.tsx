import { Box, Typography, Button, Chip, Slider, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { categories } from "../../App";

interface ProductFiltersProps {
  searchText: string;
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  priceRange: [number, number];
  sortBy: string;
  sortOrder: "asc" | "desc";
  totalResults: number | null;
  maxPriceChange: number;
  setCategory: (value: string) => void,
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
  setCategory,
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
      <Box display="flex" flexDirection={{xs: "column", sm: "row"}} alignItems={{xs: "start", sm: "center"}} mt={1}  mr={{xs: 0, m: 3}}>
        {/* Sorting */}
        <Box display="flex" alignItems="center" justifyContent="space-between" gap={1} mr={{xs: 0, sm: 2}} width={{xs: "100%", sm: "initial"}}>
          <FormControl size="small" sx={{ minWidth: 180, width: {xs: "50%", sm: "initial"}}}>
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
                <MenuItem value="id-asc">Id Low → High</MenuItem>
                <MenuItem value="id-desc">Id High → Low</MenuItem>
              </Select>
          </FormControl>

          {/* Categories for xs */}
          <FormControl size="small" sx={{ display: {xs: "true", sm: "none"}, minWidth: 180, width: {xs: "50%", sm: "initial"}}}>
              <InputLabel>Category</InputLabel>
              <Select
                  value={category || ''}
                  label="Category"
                  onChange={e => setCategory(e.target.value as string)}
              >
                {categories.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
          </FormControl>
        </Box>

        {/* Price Slider */}
        <Box width={{xs: "100%", sm: "50%"}} display="flex" flexDirection="column" alignItems="center" maxWidth={{sm: 400}} mt={{xs: 1, sm: 0}}>
            <Typography variant="body2">Price Range: {`Price: $${minPrice ?? 0} - ${maxPrice === Infinity? 'Max' : `$${maxPrice ?? priceRange[1]}`}`}</Typography>
            <Slider
                sx={{width: "90%"}}
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
            disabled={maxPrice === Infinity}
            label={`Price: $${minPrice ?? 0} - ${maxPrice === Infinity? 'Max' : `$${maxPrice ?? priceRange[1]}`}`}
            onDelete={clearPrice}
            color="primary"
            variant="outlined"
          />
        )}
        {(category || searchText || minPrice !== null || maxPrice !== null) && (
          <Button size="small" color="error" variant="outlined" onClick={clearAll}>
            Clear All Filters
          </Button>
        )}
        {/* Result count */}
        <Typography variant="body2" sx={{ ml: 1 }}>
            {totalResults !== null ? `${totalResults} Results` : ""} 
        </Typography>
      </Box>
    </Box>
  );
}
