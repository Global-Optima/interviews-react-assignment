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
import { PHONE_BASE_PREFIX, PHONE_TOTAL_DIGITS } from "./helper";

export type ShippingDetails = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  timeSlot: "Morning" | "Afternoon" | "Evening" | "";
};
type ShippingErrors = Record<keyof ShippingDetails, string>;

const getValidationErrors = (details: ShippingDetails): ShippingErrors => {
  const strippedPhone = details.phone.replace(/\D/g, "");
  return {
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
        let digits = value.replace(/\D/g, "");

        if (!digits.startsWith(PHONE_BASE_PREFIX)) {
          digits = PHONE_BASE_PREFIX;
        }

        digits = digits.slice(0, PHONE_TOTAL_DIGITS);

        let formattedPhone = "8";
        if (digits.length > 1) {
          formattedPhone += " (" + digits.substring(1, 2);
        }
        if (digits.length > 2) {
          formattedPhone += digits.substring(2, 4);
        }
        if (digits.length > 4) {
          formattedPhone += ") " + digits.substring(4, 7);
        }
        if (digits.length > 7) {
          formattedPhone += " " + digits.substring(7, 9);
        }
        if (digits.length > 9) {
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
