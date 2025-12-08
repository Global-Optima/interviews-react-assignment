import {
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  TextField,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PayPalIcon from "@mui/icons-material/GitHub"; // Use an alternative icon for mock PayPal
import PaidIcon from "@mui/icons-material/Paid";
import { PaymentDetails } from "./Checkout";

// Client-side validation
export const validatePaymentDetails = (details: PaymentDetails): boolean => {
  if (!details.method) return false;

  if (details.method === "Credit Card") {
    // Basic validation for Credit Card fields
    return (
      /^\d{16}$/.test(details.cardNumber.replace(/\s/g, "")) && // 16 digits card number
      /^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiry) && // MM/YY format
      /^\d{3,4}$/.test(details.cvv) // 3 or 4 digits CVV
    );
  }
  // PayPal and Cash on Delivery are considered valid if selected
  return true;
};

// Validation state for error messages
const getValidationErrors = (details: PaymentDetails) => ({
  cardNumber:
    details.method === "Credit Card" &&
    !/^\d{16}$/.test(details.cardNumber.replace(/\s/g, ""))
      ? "Invalid card number (16 digits)"
      : "",
  expiry:
    details.method === "Credit Card" &&
    !/^(0[1-9]|1[0-2])\/\d{2}$/.test(details.expiry)
      ? "Invalid expiry (MM/YY)"
      : "",
  cvv:
    details.method === "Credit Card" && !/^\d{3,4}$/.test(details.cvv)
      ? "Invalid CVV (3 or 4 digits)"
      : "",
});

export const Step3PaymentMethod = ({
  details,
  onChange,
}: {
  details: PaymentDetails;
  onChange: (details: PaymentDetails) => void;
}) => {
  const errors = getValidationErrors(details);

  const handleMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...details,
      method: event.target.value as PaymentDetails["method"],
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    // Simple formatting for card number
    let formattedValue = value;
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s/g, "")
        .slice(0, 16)
        .replace(/(\d{4})/g, "$1 ")
        .trim();
    }
    onChange({ ...details, [name]: formattedValue });
  };

  const handleBlur = (_name: keyof PaymentDetails) => () => {
    // Re-trigger validation on blur for fields
    onChange({ ...details });
  };

  const getErrorProps = (name: keyof PaymentDetails) => {
    return {
      error: !!(errors as any)[name],
      helperText: (errors as any)[name] || undefined,
    };
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Payment Method
      </Typography>
      <RadioGroup
        name="method"
        value={details.method}
        onChange={handleMethodChange}
        sx={{ mb: 3 }}
        aria-label="Payment method selection"
      >
        <FormControlLabel
          value="Credit Card"
          control={<Radio />}
          label={
            <Box display="flex" alignItems="center">
              <CreditCardIcon sx={{ mr: 1 }} />
              <Typography>Credit Card</Typography>
            </Box>
          }
        />
        {details.method === "Credit Card" && (
          <Box sx={{ ml: 4, my: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Card Number"
                  name="cardNumber"
                  value={details.cardNumber}
                  onChange={handleChange}
                  onBlur={handleBlur("cardNumber")}
                  placeholder="XXXX XXXX XXXX XXXX"
                  inputProps={{ maxLength: 19, "aria-required": true }} // 16 digits + 3 spaces
                  {...getErrorProps("cardNumber")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="Expiry (MM/YY)"
                  name="expiry"
                  value={details.expiry}
                  onChange={handleChange}
                  onBlur={handleBlur("expiry")}
                  placeholder="01/25"
                  inputProps={{ maxLength: 5, "aria-required": true }}
                  {...getErrorProps("expiry")}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  label="CVV"
                  name="cvv"
                  type="password"
                  value={details.cvv}
                  onChange={handleChange}
                  onBlur={handleBlur("cvv")}
                  inputProps={{ maxLength: 4, "aria-required": true }}
                  {...getErrorProps("cvv")}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        <FormControlLabel
          value="PayPal"
          control={<Radio />}
          label={
            <Box display="flex" alignItems="center">
              <PayPalIcon sx={{ mr: 1 }} />
              <Typography>PayPal</Typography>
            </Box>
          }
        />
        {details.method === "PayPal" && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 4 }}>
            You will be redirected to PayPal's website to complete your purchase
            after placing the order.
          </Typography>
        )}

        <FormControlLabel
          value="Cash on Delivery"
          control={<Radio />}
          label={
            <Box display="flex" alignItems="center">
              <PaidIcon sx={{ mr: 1 }} />
              <Typography>Cash on Delivery</Typography>
            </Box>
          }
        />
      </RadioGroup>
      {!details.method && (
        <Typography color="error" variant="caption">
          Please select a payment method to proceed.
        </Typography>
      )}
    </Box>
  );
};
