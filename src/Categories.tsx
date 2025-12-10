import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const drawerWidth = 180;

interface CategoriesProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const Categories = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoriesProps) => {
  return (
    <Box
      minWidth={drawerWidth}
      sx={{ borderRight: "1px solid", borderColor: "divider" }}
    >
      <List>
        <ListItem disablePadding>
          <ListItemButton
            selected={selectedCategory === ""}
            onClick={() => onCategoryChange("")}
          >
            <ListItemText primary="All Products" />
          </ListItemButton>
        </ListItem>
        {categories.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={selectedCategory === text}
              onClick={() => onCategoryChange(text)}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
