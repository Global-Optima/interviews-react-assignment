import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { Badge, IconButton, Chip, Select, MenuItem, FormControl } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useState, useEffect } from 'react';
import { useProductFilters } from './hooks/useProductFilters.ts';
import { useDebouncedValue } from './hooks/useDebouncedValue.ts';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.grey[100],
  border: `1px solid ${theme.palette.divider}`,
  '&:hover': {
    backgroundColor: theme.palette.grey[200],
    borderColor: theme.palette.primary.light,
  },
  '&:focus-within': {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.main}20`,
  },
  marginLeft: 0,
  marginRight: theme.spacing(2),
  width: '100%',
  transition: 'all 0.2s ease',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.text.primary,
  width: '100%',
  fontWeight: 400,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    '&::placeholder': {
      color: theme.palette.text.secondary,
      opacity: 0.7,
    },
    [theme.breakpoints.up('sm')]: {
      width: '16ch',
      '&:focus': {
        width: '28ch',
      },
    },
  },
}));

export default function SearchAppBar({ quantity, price }: { quantity: number, price: number }) {
  const { filters, updateFilters, clearFilters } = useProductFilters();
  
  // Локальное состояние для контролируемого input (обновляется моментально)
  const [searchInput, setSearchInput] = useState(filters.q);
  
  // Debounced версия поискового запроса (задержка 400ms)
  const debouncedSearchInput = useDebouncedValue(searchInput, 400);

  // Обновляем URL только когда debounced значение меняется
  useEffect(() => {
    if (debouncedSearchInput !== filters.q) {
      updateFilters({ q: debouncedSearchInput || undefined });
    }
  }, [debouncedSearchInput, filters.q, updateFilters]);

  // Синхронизируем локальное состояние с URL при внешних изменениях
  useEffect(() => {
    if (filters.q !== searchInput && filters.q !== debouncedSearchInput) {
      setSearchInput(filters.q);
    }
  }, [filters.q]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Обновляем локальное состояние моментально для отзывчивости UI
    setSearchInput(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateFilters({ q: undefined });
  };

  // Проверяем наличие активных фильтров
  const hasActiveFilters = !!(filters.q || filters.category || filters.sort !== 'price_asc' || filters.minPrice || filters.maxPrice);

  return (
    <Box>
      <AppBar 
        position="sticky"
        elevation={1}
        sx={{
          backgroundColor: 'background.paper',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              mr: 3,
              color: 'primary.main',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            ⚡ TechHub
          </Typography>
          
          <Search>
            <SearchIconWrapper>
              <SearchIcon/>
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Поиск товаров…"
              inputProps={{ 'aria-label': 'поиск' }}
              value={searchInput}
              onChange={handleSearchChange}
            />
            {searchInput && (
              <IconButton
                size="small"
                onClick={handleClearSearch}
                sx={{ 
                  position: 'absolute', 
                  right: 8, 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'inherit'
                }}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            )}
          </Search>

          <FormControl 
            size="small" 
            sx={{ 
              minWidth: { xs: 120, sm: 160 }, 
              ml: { xs: 1, sm: 2 },
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Select
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value as typeof filters.sort })}
              displayEmpty
              sx={{ 
                borderRadius: 2,
                backgroundColor: 'grey.100',
                '& .MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'divider',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'primary.light',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'primary.main',
                },
              }}
            >
              <MenuItem value="price_asc">Цена ↑</MenuItem>
              <MenuItem value="price_desc">Цена ↓</MenuItem>
              <MenuItem value="name_asc">А-Я</MenuItem>
              <MenuItem value="name_desc">Я-А</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <IconButton
              color="primary"
              onClick={clearFilters}
              sx={{ 
                ml: 1,
                '&:hover': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                },
              }}
              title="Очистить все фильтры"
            >
              <FilterListIcon />
            </IconButton>
          )}

          <Box flexGrow={1} />

          <Box 
            display="flex" 
            alignItems="center"
            gap={1}
            sx={{ 
              display: { xs: 'none', md: 'flex' },
              px: 2,
              py: 1,
              backgroundColor: 'grey.100',
              borderRadius: 2,
              mr: 2,
            }}
          >
            <Typography variant="body2" color="text.secondary" fontWeight={500}>
              Итого:
            </Typography>
            <Typography variant="h6" color="primary.main" fontWeight={700}>
              ${(price || 0).toFixed(2)}
            </Typography>
          </Box>
          
          <IconButton
            color="primary"
            sx={{
              position: 'relative',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
              },
            }}
          >
            <Badge 
              badgeContent={quantity || 0}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontWeight: 700,
                  fontSize: '0.75rem',
                },
              }}
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
        
        {/* Active Filters Chips */}
        {hasActiveFilters && (
          <Box 
            sx={{ 
              px: { xs: 2, sm: 3 }, 
              pb: 1.5, 
              pt: 0.5,
              display: 'flex', 
              gap: 1, 
              flexWrap: 'wrap',
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'grey.50',
            }}
          >
            {filters.q && (
              <Chip
                label={`Поиск: "${filters.q}"`}
                size="small"
                onDelete={handleClearSearch}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.category && (
              <Chip
                label={`Категория: ${filters.category}`}
                size="small"
                onDelete={() => updateFilters({ category: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.sort && filters.sort !== 'price_asc' && (() => {
              const labels: Record<string, string> = {
                name_asc: 'А-Я',
                name_desc: 'Я-А',
                price_asc: 'Цена ↑',
                price_desc: 'Цена ↓',
              };
              return (
                <Chip
                  label={`Сортировка: ${labels[filters.sort] ?? 'Цена ↑'}`}
                  size="small"
                  onDelete={() => updateFilters({ sort: 'price_asc' })}
                  color="primary"
                  variant="outlined"
                />
              );
            })()}
            {filters.minPrice && (
              <Chip
                label={`Мин: $${filters.minPrice}`}
                size="small"
                onDelete={() => updateFilters({ minPrice: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
            {filters.maxPrice && (
              <Chip
                label={`Макс: $${filters.maxPrice}`}
                size="small"
                onDelete={() => updateFilters({ maxPrice: undefined })}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        )}
      </AppBar>
    </Box>
  );
}
