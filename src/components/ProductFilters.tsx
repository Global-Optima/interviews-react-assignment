import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
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
      elevation={0} 
      sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: '20px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.15)',
      }}
    >
      <Stack spacing={3}>
        {/* Header с результатами и кнопкой очистки */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography 
            variant="h5" 
            component="div"
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700,
            }}
          >
            Filters
          </Typography>
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="body2" color="text.secondary">
              <strong>{resultsCount}</strong> {resultsCount === 1 ? 'result' : 'results'}
            </Typography>
            {hasActiveFilters && (
              <Button
                size="small"
                variant="contained"
                startIcon={<ClearIcon />}
                onClick={onClearFilters}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  px: 2,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
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
          <Typography variant="subtitle2" gutterBottom>
            Category
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {CATEGORIES.map((category) => (
              <Chip
                key={category.value}
                label={category.label}
                onClick={() => onChangeFilters({ category: category.value || undefined })}
                variant={filters.category === category.value ? 'filled' : 'outlined'}
                sx={{ 
                  mb: 1,
                  borderRadius: '12px',
                  fontWeight: filters.category === category.value ? 700 : 400,
                  ...(filters.category === category.value ? {
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                  } : {
                    borderColor: '#667eea',
                    color: '#667eea',
                  }),
                  '&:hover': {
                    background: filters.category === category.value 
                      ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                      : 'rgba(102, 126, 234, 0.08)',
                  },
                  transition: 'all 0.2s ease',
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Сортировка */}
        <FormControl size="small" fullWidth>
          <InputLabel id="sort-label">Sort By</InputLabel>
          <Select
            labelId="sort-label"
            label="Sort By"
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

        {/* Диапазон цен */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
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
