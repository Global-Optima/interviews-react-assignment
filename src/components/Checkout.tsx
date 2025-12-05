import React, { useState, useEffect, SetStateAction, Dispatch } from "react";
import {
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Paper,
} from "@mui/material";
import CartStep from "./checkout/CartStep";
import ShippingStep from "./checkout/ShippingStep";
import PaymentStep from "./checkout/PaymentStep";
import ConfirmationStep from "./checkout/ConfirmationStep";
import { Cart, OrderStatus } from "../types/checkout";
import { storage } from "../utils/storage";

const steps = [
  "Cart Review",
  "Shipping Details",
  "Payment Method",
  "Confirmation",
];

interface CheckoutWizardProps {
  cart: Cart | undefined;
  setCart: Dispatch<SetStateAction<Cart | undefined>>;
}

const Checkout: React.FC<CheckoutWizardProps> = ({ cart, setCart }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [shipping, setShipping] = useState(() => storage.getShipping());
  const [payment, setPayment] = useState(() => storage.getPayment());
  const [orderStatus, setOrderStatus] = useState<OrderStatus>({
    loading: false,
    success: false,
    error: null,
  });

  useEffect(() => {
    const savedCart = storage.getCart();
    if (savedCart && (!cart || cart.items.length === 0)) setCart(savedCart);
  }, []);

  useEffect(() => {
    if (cart) storage.saveCart(cart);
  }, [cart]);

  useEffect(() => storage.saveShipping(shipping), [shipping]);
  useEffect(() => storage.savePayment(payment), [payment]);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0:
        return !!cart && cart.items.length > 0;
      case 1:
        return (
          shipping.fullName.trim() !== "" &&
          shipping.address.trim() !== "" &&
          shipping.city.trim() !== "" &&
          /^\d{5}(-\d{4})?$/.test(shipping.postalCode) &&
          /^[\+]?[1-9][\d]{9,14}$/.test(shipping.phone.replace(/\D/g, ""))
        );
      case 2:
        if (payment.method === "Credit Card") {
          return (
            !!payment.cardNumber?.replace(/\s/g, "").match(/^\d{12,19}$/) &&
            !!payment.expiryDate?.match(/^(0[1-9]|1[0-2])\/\d{2}$/) &&
            !!payment.cvv?.match(/^\d{3,4}$/)
          );
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () =>
    validateStep(activeStep) &&
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  const handlePlaceOrder = async () => {
    setOrderStatus({ loading: true, success: false, error: null });
    try {
      const response = await fetch("/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart?.items || [],
          shipping,
          payment,
          total: cart ? cart.totalPrice * 1.1 : 0,
        }),
      });

      if (response.ok) {
        const orderId = `ORD-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 6)
          .toUpperCase()}`;
        setOrderStatus({ loading: false, success: true, error: null, orderId });
        setCart({ items: [], totalPrice: 0, totalItems: 0 });
        storage.clearAll();
      } else {
        throw new Error("Order failed. Please try again.");
      }
    } catch (error) {
      setOrderStatus({
        loading: false,
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Order failed. Please try again.",
      });
    }
  };

  const stepProps = {
    cart,
    setCart,
    shipping,
    setShipping,
    payment,
    setPayment,
    activeStep,
    setActiveStep,
  };

  return (
    <Box sx={{ width: "100%", p: { xs: 2, md: 4 } }}>
      <Paper sx={{ p: { xs: 2, md: 4 }, mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {activeStep === 0 && <CartStep {...stepProps} />}
        {activeStep === 1 && <ShippingStep {...stepProps} />}
        {activeStep === 2 && <PaymentStep {...stepProps} />}
        {activeStep === 3 && (
          <ConfirmationStep
            {...stepProps}
            placeOrder={handlePlaceOrder}
            orderStatus={orderStatus}
          />
        )}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0}
            variant="outlined"
          >
            Back
          </Button>
          {activeStep < steps.length - 1 && (
            <Button
              onClick={handleNext}
              variant="contained"
              disabled={!validateStep(activeStep)}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default Checkout;
