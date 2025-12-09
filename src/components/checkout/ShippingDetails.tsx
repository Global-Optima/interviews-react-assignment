import { Box, Typography, Card, CardContent, TextField } from '@mui/material';

interface ShippingData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  deliverySlot: string;
}

interface ShippingDetailsProps {
  shippingData: ShippingData;
  shippingErrors: Record<string, string>;
  onShippingChange: (field: keyof ShippingData, value: string) => void;
}

const deliverySlots = [
  { value: 'morning', label: 'Morning (8 AM - 12 PM)' },
  { value: 'afternoon', label: 'Afternoon (12 PM - 5 PM)' },
  { value: 'evening', label: 'Evening (5 PM - 9 PM)' },
];

export function ShippingDetails({
  shippingData,
  shippingErrors,
  onShippingChange,
}: ShippingDetailsProps) {
  return (
    <Box>
      <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>
        Shipping Details
      </Typography>

      <Box component='form' sx={{ maxWidth: 600 }}>
        <TextField
          fullWidth
          label='Full Name'
          value={shippingData.fullName}
          onChange={(e) => onShippingChange('fullName', e.target.value)}
          error={!!shippingErrors.fullName}
          helperText={shippingErrors.fullName}
          required
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': 'Full name' }}
        />

        <TextField
          fullWidth
          label='Address'
          value={shippingData.address}
          onChange={(e) => onShippingChange('address', e.target.value)}
          error={!!shippingErrors.address}
          helperText={shippingErrors.address}
          required
          multiline
          rows={2}
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': 'Address' }}
        />

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            label='City'
            value={shippingData.city}
            onChange={(e) => onShippingChange('city', e.target.value)}
            error={!!shippingErrors.city}
            helperText={shippingErrors.city}
            required
            inputProps={{ 'aria-label': 'City' }}
          />

          <TextField
            fullWidth
            label='Postal Code'
            value={shippingData.postalCode}
            onChange={(e) => onShippingChange('postalCode', e.target.value)}
            error={!!shippingErrors.postalCode}
            helperText={shippingErrors.postalCode}
            required
            placeholder='12345'
            inputProps={{ 'aria-label': 'Postal code' }}
          />
        </Box>

        <TextField
          fullWidth
          label='Phone Number'
          value={shippingData.phone}
          onChange={(e) => onShippingChange('phone', e.target.value)}
          error={!!shippingErrors.phone}
          helperText={shippingErrors.phone}
          required
          placeholder='+1 (555) 123-4567'
          sx={{ mb: 3 }}
          inputProps={{ 'aria-label': 'Phone number' }}
        />

        <Typography
          variant='subtitle1'
          gutterBottom
          sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}
        >
          Delivery Time Slot *
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {deliverySlots.map((slot) => (
            <Card
              key={slot.value}
              sx={{
                cursor: 'pointer',
                border: 2,
                borderColor:
                  shippingData.deliverySlot === slot.value
                    ? 'primary.main'
                    : 'grey.300',
                bgcolor:
                  shippingData.deliverySlot === slot.value
                    ? 'primary.50'
                    : 'white',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'primary.50',
                },
              }}
              onClick={() => onShippingChange('deliverySlot', slot.value)}
            >
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: 2,
                      borderColor:
                        shippingData.deliverySlot === slot.value
                          ? 'primary.main'
                          : 'grey.400',
                      bgcolor:
                        shippingData.deliverySlot === slot.value
                          ? 'primary.main'
                          : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {shippingData.deliverySlot === slot.value && (
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: 'white',
                        }}
                      />
                    )}
                  </Box>
                  <Typography>{slot.label}</Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
        {shippingErrors.deliverySlot && (
          <Typography
            color='error'
            variant='caption'
            sx={{ mt: 1, display: 'block' }}
          >
            {shippingErrors.deliverySlot}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
