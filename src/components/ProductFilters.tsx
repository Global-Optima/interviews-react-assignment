import { memo, useEffect } from 'react'
import {
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  SelectChangeEvent,
} from '@mui/material'
import { Search } from '@mui/icons-material'
import { useDebounce } from '@/hooks/useDebounce'
import type { SortOption } from '@/types'

interface ProductFiltersProps {
  search: string
  category: string
  sort: SortOption
  categories: string[]
  onSearchChange: (value: string) => void
  onCategoryChange: (value: string) => void
  onSortChange: (value: SortOption) => void
  onReset: () => void
}

export const ProductFilters = memo(function ProductFilters({
  search,
  category,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onSortChange,
  onReset,
}: ProductFiltersProps) {
  const debouncedSearch = useDebounce(search, 400)

  // Sync debounced search to parent
  useEffect(() => {
    if (debouncedSearch !== search) {
      onSearchChange(debouncedSearch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch])

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: { xs: 'wrap', md: 'nowrap' },
          }}
        >
          <TextField
            placeholder="Search products..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            fullWidth
            sx={{ flex: { xs: '1 1 100%', md: '1 1 0' }, minWidth: 0 }}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
          <FormControl sx={{ flex: { xs: '1 1 100%', md: '0 0 20%' } }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e: SelectChangeEvent) => onCategoryChange(e.target.value)}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ flex: { xs: '1 1 100%', md: '0 0 20%' } }}>
            <InputLabel>Sort</InputLabel>
            <Select
              value={sort}
              label="Sort"
              onChange={(e: SelectChangeEvent) => onSortChange(e.target.value as SortOption)}
            >
              <MenuItem value="name_asc">Name: A-Z</MenuItem>
              <MenuItem value="name_desc">Name: Z-A</MenuItem>
              <MenuItem value="price_asc">Price: Low to High</MenuItem>
              <MenuItem value="price_desc">Price: High to Low</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="outlined"
            onClick={onReset}
            sx={{
              alignSelf: 'stretch',
              minWidth: { xs: '100%', md: 'auto' },
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Reset
          </Button>
        </Box>
      </CardContent>
    </Card>
  )
})

