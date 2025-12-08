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
import { Cart } from "./Products"; // Assuming Product and Cart are exported from Products.tsx

// Step Components
import { Step1CartReview } from "./Step1CartReview";
import {
  Step2ShippingDetails,
  ShippingDetails,
  saveShippingDetails,
  loadShippingDetails,
  validateShippingDetails,
} from "./Step2ShippingDetails";

import {
  Step3PaymentMethod,
  validatePaymentDetails,
} from "./Step3PaymentMethod";
import { Step4OrderConfirmation } from "./Step4OrderConfirmation";

// Define the structure for payment details
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

const TAX_RATE = 0.1; // 10% tax

// Mock API Call to simulate order placement
const placeOrder = async (
  _orderData: any
): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 50% failure rate
      const success = Math.random() > 0.5;

      if (success) {
        resolve({
          success: true,
          message: "Order placed successfully! Your order ID is #12345.",
        });
      } else {
        resolve({
          success: false,
          message: "Order failed to process. Please try again.",
        });
      }
    }, 1500); // Simulate network delay
  });
};

export const Checkout = ({
  cart,
  onCartUpdate, // Function to update cart in parent/global state
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

  // --- Calculations ---
  const subtotal = cart.totalPrice;
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  // --- Step Validation ---
  const isStepValid = useMemo(() => {
    switch (activeStep) {
      case 0:
        return cart.totalItems > 0;
      case 1:
        return validateShippingDetails(shippingDetails);
      case 2:
        return validatePaymentDetails(paymentDetails);
      case 3:
        return cart.totalItems > 0; // Should be valid if we reached here
      default:
        return false;
    }
  }, [activeStep, cart.totalItems, shippingDetails, paymentDetails]);

  // --- Navigation Handlers ---
  const handleNext = useCallback(() => {
    if (isStepValid) {
      if (activeStep === 1) {
        saveShippingDetails(shippingDetails); // Persist details on 'Next' from step 2
      }
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  }, [activeStep, isStepValid, shippingDetails]);

  const handleBack = useCallback(() => {
    setOrderStatus("idle"); // Clear status on back navigation
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  }, []);

  // --- Order Placement ---
  const handlePlaceOrder = useCallback(async () => {
    if (orderStatus === "loading") return;

    setOrderStatus("loading");
    setOrderMessage("");

    const orderData = {
      cart: cart.items.map((item) => ({
        id: item.id,
        quantity: item.itemInCart,
        price: item.price,
      })),
      shipping: shippingDetails,
      payment: {
        method: paymentDetails.method,
        // Only include non-sensitive or masked data for a real API
        details:
          paymentDetails.method === "Credit Card"
            ? { last4: paymentDetails.cardNumber.slice(-4) }
            : {},
      },
      subtotal,
      tax,
      total,
    };

    const result = await placeOrder(orderData);

    if (result.success) {
      setOrderStatus("success");
      setOrderMessage(result.message);
      // Clear cart on success
      onCartUpdate({ items: [], totalPrice: 0, totalItems: 0 });
    } else {
      setOrderStatus("failure");
      setOrderMessage(result.message);
    }
  }, [
    cart,
    shippingDetails,
    paymentDetails,
    subtotal,
    tax,
    total,
    orderStatus,
    onCartUpdate,
  ]);

  const handleRetryOrder = useCallback(() => {
    handlePlaceOrder(); // Simply retry the order placement
  }, [handlePlaceOrder]);

  // --- Render Current Step Content ---
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Step1CartReview
            cart={cart}
            subtotal={subtotal}
            tax={tax}
            total={total}
            onCartUpdate={onCartUpdate} // To allow editing/removing items
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
        🛒 Checkout Wizard
      </Typography>

      {/* Progress Indicator */}
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

      {/* Navigation and Actions */}
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
            disabled={!isStepValid}
            variant="contained"
            aria-label={`Continue to ${steps[activeStep + 1]}`}
          >
            Next
          </Button>
        )}
        {activeStep === steps.length - 1 && orderStatus !== "success" && (
          <Button
            onClick={handlePlaceOrder}
            disabled={orderStatus === "loading" || cart.totalItems === 0}
            variant="contained"
            color="success"
            aria-label="Place Order"
          >
            {orderStatus === "loading" ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={20} sx={{ mr: 1 }} color="inherit" />
                Placing Order...
              </Box>
            ) : (
              "Place Order"
            )}
          </Button>
        )}
      </Box>
    </Box>
  );
};
