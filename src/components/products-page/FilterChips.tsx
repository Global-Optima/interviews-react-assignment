import { Box, Chip } from "@mui/material";

interface FilterChipsProps {
  searchText: string;
  category: string | null;
  clearSearch: () => void;
  clearCategory: () => void;
}

export function FilterChips({
  searchText,
  category,
  clearSearch,
  clearCategory,
}: FilterChipsProps) {
  const hasFilters = Boolean(searchText || category);

  if (!hasFilters) return null;

  return (
    <Box 
      display="flex" 
      gap={1} 
      alignItems="center" 
      p={1} 
      flexWrap="wrap"
    >
      {category && (
        <Chip 
          label={`Category: ${category}`} 
          onDelete={clearCategory}
          color="primary"
          variant="outlined"
        />
      )}
      {searchText && (
        <Chip 
          label={`Search: "${searchText}"`} 
          onDelete={clearSearch}
          color="primary"
          variant="outlined"
        />
      )}
    </Box>
  );
}
