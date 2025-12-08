import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const drawerWidth = 180;

const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Audio', 'Gaming', 'Wearables', 'Cameras'];

export interface CategoriesProps {
  category: string | null, 
  setCategory: (value: string | null) => void,
}

export const Categories = ({
  category,
  setCategory,
}: CategoriesProps) => {
  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: '1px solid grey' }}>
      <List>
        {categories.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton selected={category === text} onClick={() => category !== text ? setCategory(text) : setCategory(null) }>
              <ListItemText primary={text}/>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
