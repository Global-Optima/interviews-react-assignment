import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { SortOption } from '../../hooks/useProducts';

interface SortSelectProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: '', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
];

export const SortSelect = ({ value, onChange }: SortSelectProps) => {
    const handleChange = (event: SelectChangeEvent<string>) => {
        onChange(event.target.value as SortOption);
    };

    return (
        <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel id="sort-select-label">Sort by</InputLabel>
            <Select
                labelId="sort-select-label"
                id="sort-select"
                value={value}
                label="Sort by"
                onChange={handleChange}
            >
                {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};
