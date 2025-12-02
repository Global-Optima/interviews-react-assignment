import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Divider, Button } from '@mui/material';
import { useProductFilters } from './hooks/useProductFilters.ts';

const drawerWidth = 200;

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
      minWidth={drawerWidth} 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '0 16px 16px 0',
        m: 1,
        ml: 0,
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 700,
          }}
        >
          Категории
        </Typography>
        {hasActiveFilters && (
          <Button
            size="small"
            onClick={clearFilters}
            fullWidth
            variant="contained"
            sx={{ 
              mb: 1,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Сбросить фильтры
          </Button>
        )}
      </Box>
      <Divider />
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={!filters.category}
            onClick={() => updateFilters({ category: undefined })}
            sx={{
              '&.Mui-selected': {
                background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                borderLeft: '4px solid #667eea',
              },
              '&:hover': {
                background: 'rgba(102, 126, 234, 0.08)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            <ListItemText 
              primary="Все товары"
              primaryTypographyProps={{
                fontWeight: !filters.category ? 700 : 400
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
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                  borderLeft: '4px solid #667eea',
                },
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.08)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ListItemText 
                primary={category}
                primaryTypographyProps={{
                  fontWeight: filters.category === category ? 700 : 400
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
