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
  borderRadius: '24px',
  backgroundColor: 'rgba(102, 126, 234, 0.08)',
  border: '2px solid rgba(102, 126, 234, 0.2)',
  '&:hover': {
    backgroundColor: 'rgba(102, 126, 234, 0.12)',
    borderColor: 'rgba(102, 126, 234, 0.4)',
  },
  '&:focus-within': {
    borderColor: '#667eea',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
  },
  marginLeft: 0,
  marginRight: theme.spacing(2),
  width: '100%',
  transition: 'all 0.3s ease',
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
  color: '#1a1a1a',
  width: '100%',
  fontWeight: 500,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1.2, 1, 1.2, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    '&::placeholder': {
      color: 'rgba(102, 126, 234, 0.6)',
      opacity: 1,
    },
    [theme.breakpoints.up('sm')]: {
      width: '14ch',
      '&:focus': {
        width: '24ch',
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
        position="relative"
        elevation={0}
        sx={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          color: '#1a1a1a',
          borderBottom: '1px solid rgba(102, 126, 234, 0.1)',
        }}
      >
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'none', sm: 'block' }, 
              mr: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            🛒 TechHub
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

          <FormControl size="small" sx={{ minWidth: 150, ml: 2 }}>
            <Select
              value={filters.sort}
              onChange={(e) => updateFilters({ sort: e.target.value as typeof filters.sort })}
              displayEmpty
              sx={{ 
                color: '#1a1a1a',
                borderRadius: '12px',
                background: 'rgba(102, 126, 234, 0.08)',
                fontWeight: 500,
                '.MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'rgba(102, 126, 234, 0.2)',
                  borderWidth: '2px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': { 
                  borderColor: 'rgba(102, 126, 234, 0.4)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
                  borderColor: '#667eea',
                },
                '.MuiSvgIcon-root': { color: '#667eea' }
              }}
            >
              <MenuItem value="price_asc">Цена (по возрастанию)</MenuItem>
              <MenuItem value="price_desc">Цена (по убыванию)</MenuItem>
              <MenuItem value="name_asc">Название (А-Я)</MenuItem>
              <MenuItem value="name_desc">Название (Я-А)</MenuItem>
            </Select>
          </FormControl>

          {hasActiveFilters && (
            <IconButton
              color="inherit"
              onClick={clearFilters}
              sx={{ ml: 1 }}
              title="Очистить все фильтры"
            >
              <FilterListIcon />
            </IconButton>
          )}

          <Box flexGrow={1} />

          <Box display="flex" flexDirection="row" mx={2}>
            <Typography variant="h6" noWrap component="div" mr={2}>
              Итого:
            </Typography>
            <Typography variant="h6" noWrap component="div">
              $ {(price || 0).toFixed(2)}
            </Typography>
          </Box>
          <Badge 
            badgeContent={quantity || 0}
            sx={{
              '& .MuiBadge-badge': {
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 700,
              }
            }}
          >
            <ShoppingCartIcon sx={{ color: '#667eea', fontSize: '28px' }} />
          </Badge>
        </Toolbar>
        
        {/* Индикаторы активных фильтров */}
        {hasActiveFilters && (
          <Box sx={{ px: 2, pb: 1, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {filters.q && (
              <Chip
                label={`Поиск: "${filters.q}"`}
                size="small"
                onDelete={handleClearSearch}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
            )}
            {filters.category && (
              <Chip
                label={`Категория: ${filters.category}`}
                size="small"
                onDelete={() => updateFilters({ category: undefined })}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
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
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                />
              );
            })()}
            {filters.minPrice && (
              <Chip
                label={`Мин: $${filters.minPrice}`}
                size="small"
                onDelete={() => updateFilters({ minPrice: undefined })}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
            )}
            {filters.maxPrice && (
              <Chip
                label={`Макс: $${filters.maxPrice}`}
                size="small"
                onDelete={() => updateFilters({ maxPrice: undefined })}
                sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
              />
            )}
          </Box>
        )}
      </AppBar>
    </Box>
  );
}
