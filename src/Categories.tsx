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
  onClearFilters: () => void;
  searchTerm: string;
}) => {
  const isFilterActive = activeCategory !== "" || searchTerm !== "";
  return (
    <Box minWidth={drawerWidth} sx={{ borderRight: "1px solid grey", p: 1 }}>
      <Box mb={2} px={1}>
        <Typography variant="subtitle2" color="text.secondary" mb={1}>
          {isFilterActive ?? "Active Filters:"}
        </Typography>
        {isFilterActive ?? (
          <Chip
            label="Clear Filters"
            onClick={onClearFilters}
            onDelete={onClearFilters}
            deleteIcon={<ClearIcon />}
            size="small"
            color="error"
            sx={{ mb: 1 }}
          />
        )}

        {searchTerm && (
          <Chip
            label={`Search: "${searchTerm}"`}
            size="small"
            onDelete={() => onClearFilters()}
            sx={{ mt: 1, mr: 0.5 }}
          />
        )}
        {activeCategory && (
          <Chip
            label={`Category: ${activeCategory}`}
            size="small"
            color="primary"
            onDelete={() => onCategorySelect("")}
            sx={{ mt: 1 }}
          />
        )}
      </Box>

      <Typography variant="subtitle1" component="h3" px={1} mb={0.5}>
        Product Categories
      </Typography>
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
