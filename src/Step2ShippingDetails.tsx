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
type ShippingErrors = Record<keyof ShippingDetails, string>;
const STORAGE_KEY = "checkout_shipping_details";
const PHONE_BASE_PREFIX = "87";
const PHONE_TOTAL_DIGITS = 11;

// Helper to load details from local storage
export const loadShippingDetails = (): ShippingDetails => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const details = JSON.parse(saved);
      // Ensure the phone is initialized with at least the fixed prefix '8 (7'
      if (!details.phone || details.phone.replace(/\D/g, "").length < 2) {
        details.phone = "8 (7";
      }
      return details;
    } catch (e) {
      console.error("Could not parse shipping details from local storage", e);
    }
  }
  return {
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "8 (7", // Initialize phone with the fixed part of the prefix: '8 (7'
    timeSlot: "Morning",
  };
};

// Helper to save details to local storage
export const saveShippingDetails = (details: ShippingDetails) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(details));
};

// Client-side validation
export const validateShippingDetails = (details: ShippingDetails): boolean => {
  const { fullName, address, city, postalCode, phone, timeSlot } = details;
  const strippedPhone = phone.replace(/\D/g, "");

  // 1. Check if all basic fields are valid
  const baseValid = !!fullName && !!address && !!city && !!timeSlot;

  // 2. Validate Postal Code: exactly 6 digits
  const isPostalCodeValid = /^\d{6}$/.test(postalCode);

  // 3. Validate Phone: Must be 11 digits total AND start with '87'
  const isPhoneValid =
    strippedPhone.length === PHONE_TOTAL_DIGITS &&
    strippedPhone.startsWith(PHONE_BASE_PREFIX);

  return baseValid && isPostalCodeValid && isPhoneValid;
};

// Validation state for error messages
const getValidationErrors = (details: ShippingDetails): ShippingErrors => {
  // ⭐️ Return type added
  const strippedPhone = details.phone.replace(/\D/g, "");

  return {
    // Ensure all 6 fields from ShippingDetails are present here!
    fullName: !details.fullName ? "Full name is required" : "",
    address: !details.address ? "Address is required" : "",
    city: !details.city ? "City is required" : "",
    postalCode: !/^\d{6}$/.test(details.postalCode)
      ? "Postal code must be 6 digits (e.g., 010000)"
      : "",
    phone:
      strippedPhone.length !== 11
        ? "Phone number must be complete (11 digits required)"
        : "",
    timeSlot: !details.timeSlot ? "A time slot must be selected" : "",
  };
};

export const Step2ShippingDetails = ({
  details,
  onChange,
}: {
  details: ShippingDetails;
  onChange: (details: ShippingDetails) => void;
}) => {
  const [errors, setErrors] = useState<ShippingErrors>(
    getValidationErrors(details)
  );
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
      let { name, value } = event.target;
      let newValue = value;

      if (name === "postalCode") {
        newValue = value.replace(/\D/g, "").slice(0, 6);
      } else if (name === "phone") {
        // 1. Remove non-digits from the value
        let digits = value.replace(/\D/g, "");

        // 2. Enforce the fixed prefix '87'
        if (!digits.startsWith(PHONE_BASE_PREFIX)) {
          digits = PHONE_BASE_PREFIX;
        }

        // 3. Limit total length to 11 digits
        digits = digits.slice(0, PHONE_TOTAL_DIGITS);

        // 4. Format the number: 8 (7XX) XXX XXXX
        let formattedPhone = "8";
        if (digits.length > 1) {
          // 8 (7
          formattedPhone += " (" + digits.substring(1, 2);
        }
        if (digits.length > 2) {
          // 8 (7XX
          formattedPhone += digits.substring(2, 4);
        }
        if (digits.length > 4) {
          // 8 (7XX) XXX
          formattedPhone += ") " + digits.substring(4, 7);
        }
        if (digits.length > 7) {
          // 8 (7XX) XXX XXX
          formattedPhone += " " + digits.substring(7, 9);
        }
        if (digits.length > 9) {
          // 8 (7XX) XXX XXXX
          formattedPhone += " " + digits.substring(9, 11);
        }

        newValue = formattedPhone;
      }

      onChange({ ...details, [name]: newValue });
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
            placeholder="010000 (6 digits)"
            inputProps={{ "aria-required": true, maxLength: 6 }}
            {...getErrorProps("postalCode")}
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
            placeholder="8 (7XX) XXX XXXX"
            inputProps={{ "aria-required": true }}
            {...getErrorProps("phone")}
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
