import { zodResolver } from "@hookform/resolvers/zod";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import {
    Alert,
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Radio,
    RadioGroup,
    TextField,
    Typography
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useStepperContext } from "../../../shared/hooks/useStepperContext";
import { useCartForm } from "../hooks/use-cart-form";

const paymentSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("credit_card"),
    cardNumber: z
      .string()
      .min(1, "Card number is required")
      .regex(/^\d{16}$/, "Card number must be 16 digits"),
    expiry: z
      .string()
      .min(1, "Expiry date is required")
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Format: MM/YY"),
    cvv: z
      .string()
      .min(1, "CVV is required")
      .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
  }),
  z.object({
    method: z.literal("paypal"),
  }),
  z.object({
    method: z.literal("cash"),
  }),
]);

type PaymentFormData = z.infer<typeof paymentSchema>;

export const CartStep3 = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      method: "credit_card",
      cardNumber: "",
      expiry: "",
      cvv: "",
    },
  });

  const { nextPage } = useStepperContext();
  const { setPayment } = useCartForm();
  const [isLoaded, setIsLoaded] = useState(false);

  const formData = watch();
  const paymentMethod = watch("method");

  useEffect(() => {
    const saved = localStorage.getItem("storage_key_payment_details");
    if (saved) {
      try {
        const parsedData = JSON.parse(saved);
        reset(parsedData);
      } catch (error) {
        console.error("Failed to parse saved payment details:", error);
      }
    }
    setIsLoaded(true);
  }, [reset]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(
        "storage_key_payment_details",
        JSON.stringify(formData)
      );
    }
  }, [formData, isLoaded]);

  const onSubmit = (data: PaymentFormData) => {
    console.log("Payment data:", data);
    setPayment(data);
    if (data.method === "paypal") {
      console.log("Redirecting to PayPal...");
    }
    nextPage();
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ maxHeight: "500px", overflowY: "auto", px: 1 }}
    >
      <Typography variant="h6" gutterBottom>
        Payment Method
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, mt: 2 }}>
        <Controller
          name="method"
          control={control}
          render={({ field }) => (
            <FormControl component="fieldset">
              <FormLabel component="legend">Select Payment Method *</FormLabel>
              <RadioGroup {...field}>
                <FormControlLabel
                  value="credit_card"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CreditCardIcon />
                      <span>Credit Card</span>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <CreditCardIcon color="primary" />
                      <span>PayPal</span>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="cash"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalAtmIcon />
                      <span>Cash on Delivery</span>
                    </Box>
                  }
                />
              </RadioGroup>
            </FormControl>
          )}
        />

        {paymentMethod === "credit_card" && (
          <>
            <Controller
              name="cardNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Card Number"
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber?.message}
                  fullWidth
                  required
                  placeholder="1234567812345678"
                  inputProps={{ maxLength: 16 }}
                />
              )}
            />

            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="expiry"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Expiry Date"
                    error={!!errors.expiry}
                    helperText={errors.expiry?.message}
                    fullWidth
                    required
                    placeholder="MM/YY"
                    inputProps={{ maxLength: 5 }}
                  />
                )}
              />

              <Controller
                name="cvv"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="CVV"
                    error={!!errors.cvv}
                    helperText={errors.cvv?.message}
                    fullWidth
                    required
                    placeholder="123"
                    inputProps={{ maxLength: 4 }}
                    type="password"
                  />
                )}
              />
            </Box>
          </>
        )}

        {paymentMethod === "paypal" && (
          <Alert severity="info">
            You will be redirected to PayPal to complete your payment securely.
          </Alert>
        )}

        {paymentMethod === "cash" && (
          <Alert severity="info">
            You will pay cash upon delivery. Please have exact change ready.
          </Alert>
        )}
      </Box>

      <Button
        variant="contained"
        color="primary"
        type="submit"
        sx={{ width: "100%", mt: 2 }}
      >
        Continue
      </Button>
    </Box>
  );
};