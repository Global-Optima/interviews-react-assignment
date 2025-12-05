import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const categories_const = [
  "Laptops",
  "Smartphones",
  "Tablets",
  "Accessories",
  "Audio",
  "Gaming",
  "Wearables",
  "Cameras",
];

const drawerWidth = 180;

interface CategoriesProps {
  categories: string[];
  onCategorySelect?: (category: string) => void;
  onCategoryClear?: () => void;
}

export const Categories = ({
  categories,
  onCategorySelect,
  onCategoryClear
}: CategoriesProps) => {
  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: "1px solid grey" }}>
      <List>
        {categories_const?.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              onClick={() => onCategorySelect?.(text)}
              style={{
                backgroundColor: categories.includes(text)
                  ? "dodgerblue"
                  : "white",
                color: categories.includes(text) ? "white" : "black"
              }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider></Divider>
    <ListItemButton onClick={() => onCategoryClear?.()} style={{color: 'dodgerblue'}}>Clear All</ListItemButton>
    </Box>
  );
};  
