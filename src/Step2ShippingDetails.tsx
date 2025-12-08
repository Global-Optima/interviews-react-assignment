import { useState, useCallback, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  FormControl,
} from "@mui/material";

export type ShippingDetails = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  timeSlot: "Morning" | "Afternoon" | "Evening" | "";
};

const STORAGE_KEY = "checkout_shipping_details";

// Helper to load details from local storage
export const loadShippingDetails = (): ShippingDetails => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error("Could not parse shipping details from local storage", e);
    }
  }
  return {
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    timeSlot: "Morning", // Default to Morning
  };
};

// Helper to save details to local storage
export const saveShippingDetails = (details: ShippingDetails) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
};

// Client-side validation
export const validateShippingDetails = (details: ShippingDetails): boolean => {
  const { fullName, address, city, postalCode, phone, timeSlot } = details;
  // Simple validation: check if all fields are non-empty/valid
  return (
    !!fullName &&
    !!address &&
    !!city &&
    /^\d{5}(-\d{4})?$/.test(postalCode) && // Basic postal code format (US-centric, adjust as needed)
    /^\d{10}$/.test(phone.replace(/\D/g, "")) && // 10 digits phone number
    !!timeSlot
  );
};

// Validation state for error messages
const getValidationErrors = (details: ShippingDetails) => ({
  fullName: !details.fullName ? "Full name is required" : "",
  address: !details.address ? "Address is required" : "",
  city: !details.city ? "City is required" : "",
  postalCode: !/^\d{5}(-\d{4})?$/.test(details.postalCode)
    ? "Invalid postal code"
    : "",
  phone: !/^\d{10}$/.test(details.phone.replace(/\D/g, ""))
    ? "Invalid phone number (10 digits required)"
    : "",
  timeSlot: !details.timeSlot ? "A time slot must be selected" : "",
});

export const Step2ShippingDetails = ({
  details,
  onChange,
}: {
  details: ShippingDetails;
  onChange: (details: ShippingDetails) => void;
}) => {
  const [errors, setErrors] = useState(getValidationErrors(details));
  const [touched, setTouched] = useState<
    Record<keyof ShippingDetails, boolean>
  >({
    fullName: false,
    address: false,
    city: false,
    postalCode: false,
    phone: false,
    timeSlot: false,
  });

  // Update validation errors whenever details change
  useEffect(() => {
    setErrors(getValidationErrors(details));
  }, [details]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = event.target;
      onChange({ ...details, [name]: value });
    },
    [details, onChange]
  );

  const handleBlur = useCallback(
    (name: keyof ShippingDetails) => () => {
      setTouched((prev) => ({ ...prev, [name]: true }));
    },
    []
  );

  const getErrorProps = (name: keyof ShippingDetails) => {
    const hasError = touched[name] && !!errors[name];
    return {
      error: hasError,
      helperText: hasError ? errors[name] : undefined,
    };
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Shipping Details
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="fullName"
            value={details.fullName}
            onChange={handleChange}
            onBlur={handleBlur("fullName")}
            {...getErrorProps("fullName")}
            inputProps={{ "aria-required": true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Address"
            name="address"
            value={details.address}
            onChange={handleChange}
            onBlur={handleBlur("address")}
            {...getErrorProps("address")}
            inputProps={{ "aria-required": true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="City"
            name="city"
            value={details.city}
            onChange={handleChange}
            onBlur={handleBlur("city")}
            {...getErrorProps("city")}
            inputProps={{ "aria-required": true }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            fullWidth
            label="Postal Code"
            name="postalCode"
            value={details.postalCode}
            onChange={handleChange}
            onBlur={handleBlur("postalCode")}
            {...getErrorProps("postalCode")}
            inputProps={{ "aria-required": true }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Phone"
            name="phone"
            value={details.phone}
            onChange={handleChange}
            onBlur={handleBlur("phone")}
            {...getErrorProps("phone")}
            inputProps={{ "aria-required": true }}
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl required error={touched.timeSlot && !!errors.timeSlot}>
            <FormLabel component="legend">Delivery Time Slot</FormLabel>
            <RadioGroup
              row
              name="timeSlot"
              value={details.timeSlot}
              onChange={(e) =>
                onChange({ ...details, timeSlot: e.target.value as any })
              }
              onBlur={handleBlur("timeSlot")}
              aria-required="true"
            >
              <FormControlLabel
                value="Morning"
                control={<Radio />}
                label="Morning (8am-12pm)"
              />
              <FormControlLabel
                value="Afternoon"
                control={<Radio />}
                label="Afternoon (12pm-5pm)"
              />
              <FormControlLabel
                value="Evening"
                control={<Radio />}
                label="Evening (5pm-9pm)"
              />
            </RadioGroup>
            {touched.timeSlot && errors.timeSlot && (
              <Typography color="error" variant="caption">
                {errors.timeSlot}
              </Typography>
            )}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};
