import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { categories } from '../../App';

const drawerWidth = 180;

export interface CategoriesProps {
  category: string | null, 
  setCategory: (value: string | null) => void,
}

export const Categories = ({
  category,
  setCategory,
}: CategoriesProps) => {
  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: '1px solid grey' }} display={{ xs: "none", sm: "block" }}>
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
