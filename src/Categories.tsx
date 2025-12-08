import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Divider, Button } from '@mui/material';
import { useProductFilters } from './hooks/useProductFilters.ts';

const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Audio', 'Gaming', 'Wearables', 'Cameras'];

export const Categories = () => {
  const { filters, updateFilters, clearFilters } = useProductFilters();

  const handleCategoryClick = (category: string) => {
    // Если уже выбрана эта категория, снимаем фильтр
    if (filters.category === category) {
      updateFilters({ category: undefined });
    } else {
      updateFilters({ category });
    }
  };

  // Проверяем наличие активных фильтров
  const hasActiveFilters = !!(filters.q || filters.category || filters.sort !== 'price_asc' || filters.minPrice || filters.maxPrice);

  return (
    <Box 
      sx={{ 
        backgroundColor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
        display: 'flex', 
        flexDirection: 'column',
        height: 'fit-content',
        position: { xs: 'relative', md: 'sticky' },
        top: { md: 24 },
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box sx={{ p: 2, pb: 1 }}>
        <Typography 
          variant="h6" 
          gutterBottom
          color="primary.main"
          sx={{ fontWeight: 700, mb: 1 }}
        >
          Категории
        </Typography>
        {hasActiveFilters && (
          <Button
            size="small"
            onClick={clearFilters}
            fullWidth
            variant="contained"
            color="primary"
            sx={{ 
              mb: 1,
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            Сбросить фильтры
          </Button>
        )}
      </Box>
      <Divider />
      
      <List sx={{ py: 0 }}>
        <ListItem disablePadding>
          <ListItemButton
            selected={!filters.category}
            onClick={() => updateFilters({ category: undefined })}
            sx={{
              py: 1.5,
              px: 2,
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                borderLeft: '3px solid',
                borderLeftColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              },
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <ListItemText 
              primary="Все товары"
              primaryTypographyProps={{
                fontWeight: !filters.category ? 600 : 400,
                fontSize: '0.9375rem',
              }}
            />
          </ListItemButton>
        </ListItem>
        
        {categories.map((category) => (
          <ListItem key={category} disablePadding>
            <ListItemButton
              selected={filters.category === category}
              onClick={() => handleCategoryClick(category)}
              sx={{
                py: 1.5,
                px: 2,
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  borderLeft: '3px solid',
                  borderLeftColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.light',
                  },
                },
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <ListItemText 
                primary={category}
                primaryTypographyProps={{
                  fontWeight: filters.category === category ? 600 : 400,
                  fontSize: '0.9375rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
