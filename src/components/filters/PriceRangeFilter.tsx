import { Box, TextField, InputAdornment } from '@mui/material';
import { useState, useEffect } from 'react';

interface PriceRangeFilterProps {
    minPrice: number | null;
    maxPrice: number | null;
    onMinPriceChange: (value: number | null) => void;
    onMaxPriceChange: (value: number | null) => void;
}

export const PriceRangeFilter = ({
    minPrice,
    maxPrice,
    onMinPriceChange,
    onMaxPriceChange
}: PriceRangeFilterProps) => {
    const [minValue, setMinValue] = useState<string>(minPrice?.toString() || '');
    const [maxValue, setMaxValue] = useState<string>(maxPrice?.toString() || '');

    useEffect(() => {
        setMinValue(minPrice?.toString() || '');
    }, [minPrice]);

    useEffect(() => {
        setMaxValue(maxPrice?.toString() || '');
    }, [maxPrice]);

    const handleMinBlur = () => {
        const num = parseFloat(minValue);
        onMinPriceChange(isNaN(num) ? null : num);
    };

    const handleMaxBlur = () => {
        const num = parseFloat(maxValue);
        onMaxPriceChange(isNaN(num) ? null : num);
    };

    const handleMinKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleMinBlur();
        }
    };

    const handleMaxKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleMaxBlur();
        }
    };

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <TextField
                size="small"
                placeholder="Min"
                value={minValue}
                onChange={(e) => setMinValue(e.target.value)}
                onBlur={handleMinBlur}
                onKeyDown={handleMinKeyDown}
                type="number"
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ width: 100 }}
            />
            <Box component="span" color="text.secondary">–</Box>
            <TextField
                size="small"
                placeholder="Max"
                value={maxValue}
                onChange={(e) => setMaxValue(e.target.value)}
                onBlur={handleMaxBlur}
                onKeyDown={handleMaxKeyDown}
                type="number"
                InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ width: 100 }}
            />
        </Box>
    );
};
