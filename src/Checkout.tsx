import { useState, useMemo, useCallback } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Cart } from "./Products";

import { Step1CartReview } from "./Step1CartReview";
import { Step2ShippingDetails, ShippingDetails } from "./Step2ShippingDetails";

import {
  Step3PaymentMethod,
  validatePaymentDetails,
} from "./Step3PaymentMethod";
import { Step4OrderConfirmation } from "./Step4OrderConfirmation";
import {
  loadShippingDetails,
  saveShippingDetails,
  validateShippingDetails,
} from "./helper";

export type PaymentDetails = {
  method: "Credit Card" | "PayPal" | "Cash on Delivery" | "";
  cardNumber: string;
  expiry: string;
  cvv: string;
};

const steps = [
  "Cart Review",
  "Shipping Details",
  "Payment Method",
  "Order Confirmation",
];

export const Checkout = ({
  cart,
  onCartUpdate,
}: {
  cart: Cart;
  onCartUpdate: (newCart: Cart) => void;
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>(
    loadShippingDetails()
  );
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    method: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [orderStatus, setOrderStatus] = useState<
    "idle" | "loading" | "success" | "failure"
  >("idle");
  const [orderMessage, setOrderMessage] = useState<string>("");

  const subtotal = useMemo(() => cart.totalPrice, [cart.totalPrice]);
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);

  const isStepValid = useMemo(() => {
    switch (activeStep) {
      case 0:
        return cart.totalItems > 0;
      case 1:
        return validateShippingDetails(shippingDetails);
      case 2:
        return validatePaymentDetails(paymentDetails);
      case 3:
        return cart.totalItems > 0;
      default:
        return false;
    }
  }, [activeStep, cart.totalItems, shippingDetails, paymentDetails]);

  const handleNext = useCallback(() => {
    if (isStepValid) {
      if (activeStep === 1) {
        saveShippingDetails(shippingDetails);
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [activeStep, isStepValid, shippingDetails]);

  const handleBack = useCallback(() => {
    setOrderStatus("idle");
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  const handlePlaceOrder = useCallback(async () => {
    if (cart.totalItems === 0) return;

    setOrderStatus("loading");

    try {
      const response = await fetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("Order placement failed. Please try again.");
      }

      setOrderStatus("success");
      setOrderMessage("✅ Success! Your order has been placed and confirmed.");
      onCartUpdate({
        items: [],
        totalPrice: 0,
        totalItems: 0,
      });

      localStorage.removeItem("checkout_shipping_details");
      localStorage.removeItem("checkout_payment_details");
    } catch (error) {
      console.error("Order failed:", error);
      setOrderStatus("failure");
      setOrderMessage(
        `❌ Order failed. ${
          error instanceof Error
            ? error.message
            : "There was a server issue. Please try again."
        }`
      );
    }
  }, [cart.totalItems, onCartUpdate]);
  const handleRetryOrder = useCallback(() => {
    handlePlaceOrder();
  }, [handlePlaceOrder]);

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Step1CartReview
            cart={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onCartUpdate={onCartUpdate}
          />
        );
      case 1:
        return (
          <Step2ShippingDetails
            details={shippingDetails}
            onChange={setShippingDetails}
          />
        );
      case 2:
        return (
          <Step3PaymentMethod
            details={paymentDetails}
            onChange={setPaymentDetails}
          />
        );
      case 3:
        return (
          <Step4OrderConfirmation
            items={cart.items}
            shipping={shippingDetails}
            payment={paymentDetails}
            subtotal={subtotal}
            tax={tax}
            total={total}
            orderStatus={orderStatus}
            orderMessage={orderMessage}
            onPlaceOrder={handlePlaceOrder}
            onRetry={handleRetryOrder}
          />
        );
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box p={2} maxWidth="900px" mx="auto">
      <Typography variant="h4" gutterBottom>
        🛒 Checkout
      </Typography>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Paper elevation={3} sx={{ p: 3 }}>
        {getStepContent(activeStep)}
      </Paper>

      <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
        {activeStep !== 0 && activeStep !== steps.length && (
          <Button
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 1 }}
            aria-label="Back to previous step"
          >
            Back
          </Button>
        )}
        <Box sx={{ flex: "1 1 auto" }} />
        {activeStep < steps.length - 1 && (
          <Button
            onClick={handleNext}
            disabled={orderStatus === "loading" || !isStepValid}
            variant="contained"
            color="primary"
          >
            {activeStep === steps.length - 1 ? "Review Order" : "Next"}
          </Button>
        )}
      </Box>
    </Box>
  );
};
