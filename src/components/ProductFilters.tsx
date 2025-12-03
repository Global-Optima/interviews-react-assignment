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
  Divider,
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
      elevation={1} 
      sx={{ 
        p: { xs: 2, sm: 3 }, 
        mb: 3,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={3}>
        {/* Header с результатами и кнопкой очистки */}
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography 
              variant="h5" 
              component="div"
              color="primary.main"
              sx={{ fontWeight: 700, mb: 0.5 }}
            >
              Filters
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>{resultsCount}</strong> {resultsCount === 1 ? 'product' : 'products'} found
            </Typography>
          </Box>
          {hasActiveFilters && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
            >
              Clear Filters
            </Button>
          )}
        </Box>

        <Divider />

        {/* Поле поиска */}
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchInput && (
              <InputAdornment position="end">
                <Button
                  size="small"
                  onClick={() => onSearchInputChange('')}
                  sx={{ minWidth: 'auto', p: 0.5 }}
                >
                  <ClearIcon fontSize="small" />
                </Button>
              </InputAdornment>
            ),
          }}
        />

        {/* Категории */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600} color="text.primary">
            Category
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {CATEGORIES.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                onClick={() => onChangeFilters({ category: category.value || undefined })}
                color={filters.category === category.value ? 'primary' : 'default'}
                variant={filters.category === category.value ? 'filled' : 'outlined'}
                sx={{ 
                  mb: 1,
                  fontWeight: filters.category === category.value ? 600 : 400,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Сортировка */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600} color="text.primary">
            Sort By
          </Typography>
          <FormControl size="small" fullWidth>
            <Select
              value={filters.sort}
              onChange={(e) => onChangeFilters({ sort: e.target.value as SortOption })}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Диапазон цен */}
        <Box>
          <Typography variant="subtitle1" gutterBottom fontWeight={600} color="text.primary">
            Price Range
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              size="small"
              type="number"
              placeholder="Min"
              value={filters.minPrice ?? ''}
              onChange={handleMinPriceChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
              }}
              inputProps={{ min: 0, step: 10 }}
              sx={{ flex: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
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
              inputProps={{ min: 0, step: 10 }}
              sx={{ flex: 1 }}
            />
          </Stack>
        </Box>

        {/* Индикаторы активных фильтров */}
        {hasActiveFilters && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>
              Active Filters
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {filters.q && (
                <Chip
                  label={`Search: "${filters.q}"`}
                  size="small"
                  onDelete={() => {
                    onSearchInputChange('');
                    onChangeFilters({ q: undefined });
                  }}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.category && (
                <Chip
                  label={`Category: ${filters.category}`}
                  size="small"
                  onDelete={() => onChangeFilters({ category: undefined })}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.sort && filters.sort !== 'price_asc' && (
                <Chip
                  label={`Sort: ${SORT_OPTIONS.find((o) => o.value === filters.sort)?.label}`}
                  size="small"
                  onDelete={() => onChangeFilters({ sort: 'price_asc' })}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.minPrice !== undefined && (
                <Chip
                  label={`Min: $${filters.minPrice}`}
                  size="small"
                  onDelete={() => onChangeFilters({ minPrice: undefined })}
                  color="primary"
                  variant="outlined"
                />
              )}
              {filters.maxPrice !== undefined && (
                <Chip
                  label={`Max: $${filters.maxPrice}`}
                  size="small"
                  onDelete={() => onChangeFilters({ maxPrice: undefined })}
                  color="primary"
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
