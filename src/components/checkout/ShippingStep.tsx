import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  InputAdornment,
} from "@mui/material";
import { StepProps, ShippingDetails } from "../../types/checkout";

const deliverySlots = [
  { value: "Morning", label: "Morning (8 AM - 12 PM)" },
  { value: "Afternoon", label: "Afternoon (12 PM - 4 PM)" },
  { value: "Evening", label: "Evening (4 PM - 8 PM)" },
] as const;

const ShippingStep: React.FC<StepProps> = ({ shipping, setShipping }) => {
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingDetails, string>>
  >({});

  const validateField = (field: keyof ShippingDetails, value: string) => {
    let error = "";
    switch (field) {
      case "fullName":
        if (!value.trim()) error = "Full name is required";
        break;
      case "address":
        if (!value.trim()) error = "Address is required";
        break;
      case "city":
        if (!value.trim()) error = "City is required";
        break;
      case "postalCode":
        if (!/^\d{5}(-\d{4})?$/.test(value)) error = "Invalid postal code";
        break;
      case "phone":
        const cleaned = value.replace(/\D/g, "");
        if (!/^7[0-9]{9}$/.test(cleaned)) {
          error = "Invalid phone number";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  };

  const handleChange =
    (field: keyof ShippingDetails) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setShipping({ ...shipping, [field]: value });
      if (errors[field]) validateField(field, value);
    };

  const handleBlur = (field: keyof ShippingDetails) => () =>
    validateField(field, shipping[field]);

  return (
    <Box component="form" noValidate>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Full Name"
            value={shipping.fullName}
            onChange={handleChange("fullName")}
            onBlur={handleBlur("fullName")}
            error={!!errors.fullName}
            helperText={errors.fullName}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            value={shipping.address}
            onChange={handleChange("address")}
            onBlur={handleBlur("address")}
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            value={shipping.city}
            onChange={handleChange("city")}
            onBlur={handleBlur("city")}
            error={!!errors.city}
            helperText={errors.city}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Postal Code"
            value={shipping.postalCode}
            onChange={handleChange("postalCode")}
            onBlur={handleBlur("postalCode")}
            error={!!errors.postalCode}
            helperText={errors.postalCode}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Phone Number"
            value={shipping.phone}
            onChange={handleChange("phone")}
            onBlur={handleBlur("phone")}
            error={!!errors.phone}
            helperText={errors.phone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">+7</InputAdornment>
              ),
            }}
            inputProps={{ inputMode: "tel" }}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend" sx={{ mb: 1 }}>
              Delivery Time Slot
            </FormLabel>
            <RadioGroup
              value={shipping.deliverySlot}
              onChange={(e) =>
                setShipping({
                  ...shipping,
                  deliverySlot: e.target
                    .value as ShippingDetails["deliverySlot"],
                })
              }
            >
              {deliverySlots.map((slot) => (
                <FormControlLabel
                  key={slot.value}
                  value={slot.value}
                  control={<Radio />}
                  label={slot.label}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ShippingStep;
