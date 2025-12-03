import {
  Box,
  Button,
  Chip,
  FormControl,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  Paper,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { Filters, SortOption } from '../hooks/useProductFilters';

// Доступные категории товаров
const CATEGORIES = [
  { value: '', label: 'All Products' },
  { value: 'Laptops', label: 'Laptops' },
  { value: 'Smartphones', label: 'Smartphones' },
  { value: 'Tablets', label: 'Tablets' },
  { value: 'Accessories', label: 'Accessories' },
  { value: 'Audio', label: 'Audio' },
  { value: 'Gaming', label: 'Gaming' },
  { value: 'Wearables', label: 'Wearables' },
  { value: 'Cameras', label: 'Cameras' },
];

// Опции сортировки
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A–Z' },
  { value: 'name_desc', label: 'Name: Z–A' },
];

interface ProductFiltersProps {
  filters: Filters;
  onChangeFilters: (partial: Partial<Filters>) => void;
  onClearFilters: () => void;
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  resultsCount: number;
}

export function ProductFilters({
  filters,
  onChangeFilters,
  onClearFilters,
  searchInput,
  onSearchInputChange,
  resultsCount,
}: ProductFiltersProps) {
  // Проверяем наличие активных фильтров
  const hasActiveFilters = !!(
    filters.q ||
    filters.category ||
    filters.sort !== 'price_asc' ||
    filters.minPrice ||
    filters.maxPrice
  );

  // Обработчики для диапазона цен
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onChangeFilters({ minPrice: undefined });
    } else {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0) {
        onChangeFilters({ minPrice: num });
      }
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      onChangeFilters({ maxPrice: undefined });
    } else {
      const num = parseFloat(value);
      if (!isNaN(num) && num >= 0) {
        onChangeFilters({ maxPrice: num });
      }
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: { xs: 2, sm: 2.5 }, 
        mb: 3,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        {/* Main filters row - responsive layout */}
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2}
          alignItems={{ xs: 'stretch', md: 'flex-start' }}
        >
          {/* Search field - takes more space on desktop */}
          <Box sx={{ flex: { xs: 1, md: 2 } }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
              value={searchInput}
              onChange={(e) => onSearchInputChange(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: searchInput && (
                  <InputAdornment position="end">
                    <Button
                      size="small"
                      onClick={() => onSearchInputChange('')}
                      sx={{ minWidth: 'auto', p: 0.5 }}
                      aria-label="Clear search"
                    >
                      <ClearIcon fontSize="small" />
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'grey.50',
                },
              }}
            />
          </Box>

          {/* Sort selector */}
          <FormControl size="small" sx={{ minWidth: { xs: '100%', md: 200 } }}>
            <Select
              value={filters.sort}
              onChange={(e) => onChangeFilters({ sort: e.target.value as SortOption })}
              displayEmpty
              sx={{
                backgroundColor: 'grey.50',
              }}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Price range inputs */}
          <Stack 
            direction="row" 
            spacing={1} 
            alignItems="center"
            sx={{ minWidth: { xs: '100%', md: 240 } }}
          >
            <TextField
              size="small"
              type="number"
              placeholder="Min"
              value={filters.minPrice ?? ''}
              onChange={handleMinPriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 10, 'aria-label': 'Minimum price' }}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'grey.50',
                },
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ px: 0.5 }}>
              –
            </Typography>
            <TextField
              size="small"
              type="number"
              placeholder="Max"
              value={filters.maxPrice ?? ''}
              onChange={handleMaxPriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 10, 'aria-label': 'Maximum price' }}
              sx={{ 
                flex: 1,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'grey.50',
                },
              }}
            />
          </Stack>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
              sx={{ 
                minWidth: { xs: '100%', md: 'auto' },
                whiteSpace: 'nowrap',
              }}
            >
              Clear
            </Button>
          )}
        </Stack>

        {/* Category chips - second row */}
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {CATEGORIES.map((category) => (
            <Chip
              key={category.value}
              label={category.label}
              onClick={() => onChangeFilters({ category: category.value || undefined })}
              color={filters.category === category.value ? 'primary' : 'default'}
              variant={filters.category === category.value ? 'filled' : 'outlined'}
              size="small"
              sx={{ 
                fontWeight: filters.category === category.value ? 600 : 400,
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-1px)',
                },
              }}
            />
          ))}
        </Stack>

        {/* Active filters indicators - compact chips below */}
        {hasActiveFilters && (
          <Box 
            sx={{ 
              pt: 1,
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap alignItems="center">
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ mr: 0.5, fontWeight: 600 }}
              >
                Active:
              </Typography>
              {filters.q && (
                <Chip
                  label={`"${filters.q}"`}
                  size="small"
                  onDelete={() => {
                    onSearchInputChange('');
                    onChangeFilters({ q: undefined });
                  }}
                  sx={{ 
                    height: 24,
                    fontSize: '0.75rem',
                  }}
                />
              )}
              {filters.category && (
                <Chip
                  label={filters.category}
                  size="small"
                  onDelete={() => onChangeFilters({ category: undefined })}
                  sx={{ 
                    height: 24,
                    fontSize: '0.75rem',
                  }}
                />
              )}
              {filters.sort && filters.sort !== 'price_asc' && (
                <Chip
                  label={SORT_OPTIONS.find((o) => o.value === filters.sort)?.label.split(':')[0]}
                  size="small"
                  onDelete={() => onChangeFilters({ sort: 'price_asc' })}
                  sx={{ 
                    height: 24,
                    fontSize: '0.75rem',
                  }}
                />
              )}
              {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                <Chip
                  label={`$${filters.minPrice ?? '0'} – $${filters.maxPrice ?? '∞'}`}
                  size="small"
                  onDelete={() => onChangeFilters({ minPrice: undefined, maxPrice: undefined })}
                  sx={{ 
                    height: 24,
                    fontSize: '0.75rem',
                  }}
                />
              )}
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ ml: 1 }}
              >
                ({resultsCount} {resultsCount === 1 ? 'result' : 'results'})
              </Typography>
            </Stack>
          </Box>
        )}

        {/* Results count when no active filters */}
        {!hasActiveFilters && (
          <Typography variant="caption" color="text.secondary">
            Showing all <strong>{resultsCount}</strong> products
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}
