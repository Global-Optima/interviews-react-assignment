import { Box, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const drawerWidth = 180;

const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Audio', 'Gaming', 'Wearables', 'Cameras'];

export const Categories = ({
    selectedCategory,
    onSelectCategory
}: {
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}) => {
    return (
        <Box minWidth={drawerWidth} sx={{ borderRight: '1px solid grey' }}>
            <List>
                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedCategory === ''}
                        onClick={() => onSelectCategory('')}
                    >
                        <ListItemText primary="All Products" />
                    </ListItemButton>
                </ListItem>
                {categories.map((text) => (
                    <ListItem key={text} disablePadding>
                        <ListItemButton
                            selected={selectedCategory === text}
                            onClick={() => onSelectCategory(text)}
                        >
                            <ListItemText primary={text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};
