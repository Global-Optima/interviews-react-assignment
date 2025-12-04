import { useState, useCallback } from 'react'
import {
  Card,
  CardContent,
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material'
import type { ShippingDetails } from '@/types'

interface CheckoutStep2Props {
  initialData: ShippingDetails | null
  onSubmit: (data: ShippingDetails) => void
  onBack: () => void
}

export function CheckoutStep2({ initialData, onSubmit, onBack }: CheckoutStep2Props) {
  const [formData, setFormData] = useState<ShippingDetails>(
    initialData || {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
    }
  )

  const [errors, setErrors] = useState<Partial<Record<keyof ShippingDetails, string>>>({})

  const validate = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof ShippingDetails, string>> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required'
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required'
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required'
    }
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required'
    }
    if (!formData.country.trim()) {
      newErrors.country = 'Country is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (validate()) {
        onSubmit(formData)
      }
    },
    [formData, validate, onSubmit]
  )

  const handleChange = useCallback((field: keyof ShippingDetails, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }, [errors])

  return (
    <Card>
      <CardContent>
        <Typography variant="h3" sx={{ mb: 3 }}>
          Shipping Details
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Full Name"
              required
              fullWidth
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              error={!!errors.fullName}
              helperText={errors.fullName}
            />
            <TextField
              label="Phone"
              required
              fullWidth
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              error={!!errors.phone}
              helperText={errors.phone}
            />
            <TextField
              label="Address"
              required
              fullWidth
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              error={!!errors.address}
              helperText={errors.address}
            />
            <TextField
              label="City"
              required
              fullWidth
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              error={!!errors.city}
              helperText={errors.city}
            />
            <TextField
              label="ZIP Code"
              required
              fullWidth
              value={formData.zipCode}
              onChange={(e) => handleChange('zipCode', e.target.value)}
              error={!!errors.zipCode}
              helperText={errors.zipCode}
            />
            <TextField
              label="Country"
              required
              fullWidth
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
              error={!!errors.country}
              helperText={errors.country}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
            <Button variant="outlined" onClick={onBack}>
              Back
            </Button>
            <Button type="submit" variant="contained">
              Continue
            </Button>
          </Box>
        </form>
      </CardContent>
    </Card>
  )
}


