import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Box,
  TextField,
  Typography,
  Paper,
  Alert,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { StepProps, PaymentDetails } from "../../types/checkout";

const paymentMethods = [
  {
    value: "Credit Card",
    label: "Credit Card",
    icon: <CreditCardIcon sx={{ mr: 1 }} />,
  },
  {
    value: "PayPal",
    label: "PayPal",
    icon: <AccountBalanceWalletIcon sx={{ mr: 1 }} />,
  },
  {
    value: "Cash on Delivery",
    label: "Cash on Delivery",
    icon: <LocalShippingIcon sx={{ mr: 1 }} />,
  },
] as const;

const PaymentStep: React.FC<StepProps> = ({ payment, setPayment }) => {
  const [cardErrors, setCardErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const validateCard = () => {
    const errors = { cardNumber: "", expiryDate: "", cvv: "" };
    if (payment.method === "Credit Card") {
      if (!payment.cardNumber?.replace(/\s/g, "").match(/^\d{12,19}$/))
        errors.cardNumber = "Invalid card number";
      if (!payment.expiryDate?.match(/^(0[1-9]|1[0-2])\/\d{2}$/))
        errors.expiryDate = "Invalid expiry date";
      if (!payment.cvv?.match(/^\d{3,4}$/)) errors.cvv = "Invalid CVV";
    }
    setCardErrors(errors);
    return !Object.values(errors).some((error) => error);
  };

  useEffect(() => {
    if (payment.method === "Credit Card") validateCard();
  }, [payment]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4)
      parts.push(match.substring(i, i + 4));
    return parts.length ? parts.join(" ") : value;
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <FormControl component="fieldset" fullWidth>
          <FormLabel component="legend" sx={{ mb: 2 }}>
            Select Payment Method
          </FormLabel>
          <RadioGroup
            value={payment.method}
            onChange={(e) =>
              setPayment({
                ...payment,
                method: e.target.value as PaymentDetails["method"],
              })
            }
          >
            {paymentMethods.map((method) => (
              <Card
                key={method.value}
                variant="outlined"
                sx={{
                  mb: 2,
                  cursor: "pointer",
                  borderColor:
                    payment.method === method.value
                      ? "primary.main"
                      : "divider",
                  bgcolor:
                    payment.method === method.value
                      ? "action.selected"
                      : "background.paper",
                }}
                onClick={() =>
                  setPayment({
                    ...payment,
                    method: method.value as PaymentDetails["method"],
                  })
                }
              >
                <CardContent sx={{ py: 2 }}>
                  <FormControlLabel
                    value={method.value}
                    control={<Radio />}
                    label={
                      <Box display="flex" alignItems="center">
                        {method.icon}
                        {method.label}
                      </Box>
                    }
                    sx={{ width: "100%", m: 0 }}
                  />
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>
        {payment.method === "Credit Card" && (
          <Box sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Card Number"
              value={payment.cardNumber || ""}
              onChange={(e) =>
                setPayment({
                  ...payment,
                  cardNumber: formatCardNumber(e.target.value),
                })
              }
              error={!!cardErrors.cardNumber}
              helperText={cardErrors.cardNumber}
              sx={{ mb: 2 }}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Expiry Date (MM/YY)"
                  value={payment.expiryDate || ""}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      expiryDate: e.target.value
                        .replace(/\D/g, "")
                        .replace(/(\d{2})(\d)/, "$1/$2")
                        .substring(0, 5),
                    })
                  }
                  error={!!cardErrors.expiryDate}
                  helperText={cardErrors.expiryDate}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="CVV"
                  type="password"
                  value={payment.cvv || ""}
                  onChange={(e) =>
                    setPayment({
                      ...payment,
                      cvv: e.target.value.replace(/\D/g, "").substring(0, 4),
                    })
                  }
                  error={!!cardErrors.cvv}
                  helperText={cardErrors.cvv}
                />
              </Grid>
            </Grid>
          </Box>
        )}
        {payment.method === "PayPal" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Redirecting to PayPal
          </Alert>
        )}
        {payment.method === "Cash on Delivery" && (
          <Alert severity="info" sx={{ mt: 2 }}>
            Have exact change ready
          </Alert>
        )}
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Security
          </Typography>
          <Typography variant="body2" paragraph>
            <CheckCircleIcon
              color="success"
              sx={{ mr: 1, verticalAlign: "middle" }}
            />
            Secure encryption
          </Typography>
          <Typography variant="body2" paragraph>
            <CheckCircleIcon
              color="success"
              sx={{ mr: 1, verticalAlign: "middle" }}
            />
            No data stored
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default PaymentStep;
