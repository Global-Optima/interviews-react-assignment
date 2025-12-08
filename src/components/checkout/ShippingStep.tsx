import React from 'react';
import {
    Box,
    TextField,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Typography,
    Paper,
    Fade,
    Grid,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useCheckout } from './useCheckout';
import { DELIVERY_TIME_SLOTS, DeliveryTimeSlot, ShippingInfo } from './types';

export function ShippingStep() {
    const { shippingInfo, setShippingInfo, shippingErrors, validateShipping } = useCheckout();

    const handleChange = (field: keyof ShippingInfo) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setShippingInfo({
            ...shippingInfo,
            [field]: event.target.value,
        });
    };

    const handleBlur = () => {
        validateShipping();
    };

    const handleTimeSlotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShippingInfo({
            ...shippingInfo,
            deliveryTimeSlot: event.target.value as DeliveryTimeSlot,
        });
    };

    return (
        <Fade in timeout={400}>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Shipping Information
                </Typography>

                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Full Name"
                            value={shippingInfo.fullName}
                            onChange={handleChange('fullName')}
                            onBlur={handleBlur}
                            error={!!shippingErrors.fullName}
                            helperText={shippingErrors.fullName}
                            required
                            inputProps={{
                                'aria-label': 'Full Name',
                                'aria-required': true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Address"
                            value={shippingInfo.address}
                            onChange={handleChange('address')}
                            onBlur={handleBlur}
                            error={!!shippingErrors.address}
                            helperText={shippingErrors.address}
                            required
                            multiline
                            rows={2}
                            inputProps={{
                                'aria-label': 'Address',
                                'aria-required': true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="City"
                            value={shippingInfo.city}
                            onChange={handleChange('city')}
                            onBlur={handleBlur}
                            error={!!shippingErrors.city}
                            helperText={shippingErrors.city}
                            required
                            inputProps={{
                                'aria-label': 'City',
                                'aria-required': true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            label="Postal Code"
                            value={shippingInfo.postalCode}
                            onChange={handleChange('postalCode')}
                            onBlur={handleBlur}
                            error={!!shippingErrors.postalCode}
                            helperText={shippingErrors.postalCode || 'e.g., 12345'}
                            required
                            inputProps={{
                                'aria-label': 'Postal Code',
                                'aria-required': true,
                            }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={shippingInfo.phone}
                            onChange={handleChange('phone')}
                            onBlur={handleBlur}
                            error={!!shippingErrors.phone}
                            helperText={shippingErrors.phone || 'e.g., +1 234 567 8900'}
                            required
                            inputProps={{
                                'aria-label': 'Phone Number',
                                'aria-required': true,
                                type: 'tel',
                            }}
                        />
                    </Grid>
                </Grid>

                <Box mt={4}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTimeIcon fontSize="small" />
                            Delivery Time Slot
                        </FormLabel>
                        <RadioGroup
                            value={shippingInfo.deliveryTimeSlot}
                            onChange={handleTimeSlotChange}
                            aria-label="Delivery time slot"
                        >
                            <Grid container spacing={2}>
                                {DELIVERY_TIME_SLOTS.map((slot) => (
                                    <Grid item xs={12} sm={4} key={slot.value}>
                                        <Paper
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                cursor: 'pointer',
                                                borderColor: shippingInfo.deliveryTimeSlot === slot.value
                                                    ? 'primary.main'
                                                    : 'divider',
                                                borderWidth: shippingInfo.deliveryTimeSlot === slot.value ? 2 : 1,
                                                bgcolor: shippingInfo.deliveryTimeSlot === slot.value
                                                    ? 'primary.50'
                                                    : 'background.paper',
                                                transition: 'all 0.2s',
                                                '&:hover': {
                                                    borderColor: 'primary.main',
                                                },
                                            }}
                                            onClick={() => setShippingInfo({
                                                ...shippingInfo,
                                                deliveryTimeSlot: slot.value,
                                            })}
                                        >
                                            <FormControlLabel
                                                value={slot.value}
                                                control={<Radio />}
                                                label={
                                                    <Box>
                                                        <Typography fontWeight={500}>{slot.label}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {slot.time}
                                                        </Typography>
                                                    </Box>
                                                }
                                                sx={{ m: 0, width: '100%' }}
                                            />
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </RadioGroup>
                    </FormControl>
                </Box>
            </Box>
        </Fade>
    );
}
