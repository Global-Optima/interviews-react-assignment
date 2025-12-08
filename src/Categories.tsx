import {
  Box,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
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
  onCategorySelect,
  onClearFilters,
  searchTerm,
}: {
  activeCategory: string;
  onCategorySelect: (category: string) => void;
  onClearFilters: (key?: "searchTerm" | "activeCategory") => void;
  searchTerm: string;
}) => {
  const isFilterActive = activeCategory !== "" || searchTerm !== "";
  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: "1px solid grey", p: 1 }}>
      {isFilterActive && (
        <Box mb={2} px={1}>
          <Chip
            label="Clear All Filters"
            onClick={() => onClearFilters()}
            onDelete={() => onClearFilters()}
            deleteIcon={<ClearIcon />}
            size="small"
            color="error"
          />

          <Box display="flex" flexWrap="wrap" gap={0.5}>
            {searchTerm && (
              <Chip
                label={`Search: "${searchTerm}"`}
                size="small"
                onDelete={() => onClearFilters("searchTerm")}
                sx={{ mt: 1 }}
              />
            )}

            {activeCategory && (
              <Chip
                label={`${activeCategory}`}
                size="small"
                color="primary"
                onDelete={() => onCategorySelect("")}
                sx={{ mt: 1 }}
              />
            )}
          </Box>
        </Box>
      )}
      <List disablePadding>
        {categories.map((text) => (
          <ListItem
            key={text}
            disablePadding
            onClick={() => onCategorySelect(text)}
          >
            <ListItemButton
              selected={activeCategory === text}
              sx={{ borderRadius: 1 }}
            >
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
