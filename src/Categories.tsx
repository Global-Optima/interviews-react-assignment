import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";

const drawerWidth = 180;

const categories = [
  "Laptops",
  "Smartphones",
  "Tablets",
  "Accessories",
  "Audio",
  "Gaming",
  "Wearables",
  "Cameras",
];

export const Categories = ({
  activeCategory,
  onCategoryChange,
}: {
  activeCategory: string | null;
  onCategoryChange: (category: string) => void;
}) => {
  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: "1px solid grey" }}>
      <List>
        {categories.map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton
              selected={activeCategory === text}
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
