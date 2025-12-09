import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Alert,
  CircularProgress,
  Chip,
  Divider,
  Avatar,
  Paper,
} from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { Cart } from "../App";

// Single-file Checkout Wizard component implementing the 4-step flow requested.
// Uses controlled forms, localStorage for shipping persistence, basic validation,
// simulated /orders endpoint (50% failure), accessibility attributes, keyboard support
// and simple step transition animations using CSS classes and MUI's TransitionProps.

export type Shipping = {
  fullName: string;
  address: string;
  city: string;
  postal: string;
  phone: string;
  slot: "Morning" | "Afternoon" | "Evening";
};

export type Card = {
    number: string, 
    expiry: string, 
    cvv: string,
}

const STEPS = ["Cart Review", "Shipping", "Payment", "Confirmation"];

const TAX_RATE = 0.1;

function currency(n: number) {
  return `$${n.toFixed(2)}`;
}

const STORAGE_KEY = "checkout_shipping_v1";

const ShippingStep = React.memo(function ShippingStep({
    shipping, 
    setShipping, 
    errors
}: {
    shipping: Shipping;
    setShipping: React.Dispatch<React.SetStateAction<Shipping>>;
    errors: Record<string, string>;
}) {
    return (
        <Box component="form" noValidate sx={{ pt: 1}}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Full name"
                    value={shipping.fullName}
                    onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                    error={!!errors.fullName}
                    helperText={errors.fullName}
                    inputProps={{ "aria-label": "full name" }}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Phone"
                    value={shipping.phone}
                    onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                    error={!!errors.phone}
                    helperText={errors.phone}
                />
                </Grid>
                <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Address"
                    value={shipping.address}
                    onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                    error={!!errors.address}
                    helperText={errors.address}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="City"
                    value={shipping.city}
                    onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                    error={!!errors.city}
                    helperText={errors.city}
                />
                </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Postal code"
                    value={shipping.postal}
                    onChange={(e) => setShipping({ ...shipping, postal: e.target.value })}
                    error={!!errors.postal}
                    helperText={errors.postal || "e.g. 12345"}
                />
                </Grid>
                <Grid item xs={12}>
                <FormControl component="fieldset">
                    <InputLabel id="slot-label">Delivery slot</InputLabel>
                    <Select
                        labelId="slot-label"
                        value={shipping.slot}
                        label="Delivery slot"
                        onChange={(e) => setShipping({ ...shipping, slot: e.target.value as any })}
                    >
                        <MenuItem value="Morning">Morning</MenuItem>
                        <MenuItem value="Afternoon">Afternoon</MenuItem>
                        <MenuItem value="Evening">Evening</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
            </Grid>
        </Box>
    );
});

function PaymentStep({
    paymentMethod,
    setPaymentMethod,
    card,
    errors,
    setCard
}: {
    paymentMethod: "card" | "paypal" | "cod";
    setPaymentMethod: React.Dispatch<React.SetStateAction<"card" | "paypal" | "cod">>;
    card: Card;
    setCard: React.Dispatch<React.SetStateAction<Card>>;
    errors: Record<string, string>;
}) {
    return (
      <Box>
        <FormControl component="fieldset" fullWidth>
            <RadioGroup
                row
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                aria-label="payment method"
                name="payment-method"
            >
                <FormControlLabel value="card" control={<Radio />} label={<Box sx={{display: "flex", alignItems: "center"}}><CreditCardIcon sx={{ mr: 1 }} /> Credit Card</Box>} />
                <FormControlLabel value="paypal" control={<Radio />} label={<Box sx={{display: "flex", alignItems: "center"}}><AccountBalanceWalletIcon sx={{ mr: 1 }} /> PayPal</Box>} />
                <FormControlLabel value="cod" control={<Radio />} label={<Box sx={{display: "flex", alignItems: "center"}}><LocalShippingIcon sx={{ mr: 1 }} /> Cash on Delivery</Box>} />
            </RadioGroup>
            {paymentMethod === "card" && (
                <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Card number"
                        value={card.number}
                        onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        inputProps={{ inputMode: "numeric", "aria-label": "card number" }}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Expiry (MM/YY)"
                        value={card.expiry}
                        onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                        error={!!errors.cardExpiry}
                        helperText={errors.cardExpiry}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="CVV"
                        value={card.cvv}
                        onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                        error={!!errors.cardCvv}
                        helperText={errors.cardCvv}
                        inputProps={{ inputMode: "numeric" }}
                    />
                </Grid>
                </Grid>
            )}
            {paymentMethod === "paypal" && (
                <Alert severity="info" sx={{ mt: 2 }}>
                You will be redirected to PayPal (mock). Click "Place Order" to continue.
                </Alert>
            )}
          </FormControl>
        </Box>
    );
}

export default function CheckoutWizard({
    cart,
    removeItem,
    addToCart,
    resetCart,
    handleCloseCheckout,
}: {
    cart: Cart | undefined,
    removeItem: (productId: number) => void,
    addToCart: (productId: number, delta: number) => void,
    resetCart: () => void,
    handleCloseCheckout: () => void,
}) {
  const [shipping, setShipping] = useState<Shipping>(() => {
  const saved = localStorage.getItem("shipping");
    if (saved) {
        try {
            return JSON.parse(saved) as Shipping;
        } catch {
            console.warn("Invalid shipping data in localStorage");
        }
    }
    return {
        fullName: "",
        address: "",
        city: "",
        postal: "",
        phone: "",
        slot: "Morning",
    };
  });
  const subtotal = useMemo(
    () => cart ? cart.items?.reduce((s, i) => s + i.price * i.itemInCart, 0) ?? 0 : 0,
    [cart]
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  const [activeStep, setActiveStep] = useState(0);
  const [cartCopy, setCartCopy] = useState<Cart | undefined>(undefined);

  // Shipping state (controlled) persisted to localStorage


  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setShipping((s) => ({ ...s, ...JSON.parse(raw) }));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    // persist on changes
    const toStore = { ...shipping };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [shipping]);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<"card" | "paypal" | "cod">("card");
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Order API state
  const [placing, setPlacing] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    id: string;
    tracking?: string;
  } | null>(null);

  // Validation helpers for each step
  function validateStep(step: number) {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if ((cart?.items?.length || 0) === 0) newErrors.cart = "Cart is empty";
    }
    if (step === 1) {
      if (!shipping.fullName.trim()) newErrors.fullName = "Full name is required";
      if (!shipping.address.trim()) newErrors.address = "Address is required";
      if (!shipping.city.trim()) newErrors.city = "City is required";
      if (!/^[0-9A-Za-z\- ]{3,10}$/.test(shipping.postal))
        newErrors.postal = "Postal code invalid";
      if (!/^[+0-9 ()-]{7,20}$/.test(shipping.phone)) newErrors.phone = "Phone invalid";
    }
    if (step === 2) {
      if (paymentMethod === "card") {
        if (!/^\d{12,19}$/.test(card.number.replace(/\s+/g, ""))) newErrors.cardNumber = "Card number invalid";
        if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(card.expiry)) newErrors.cardExpiry = "Expiry format MM/YY";
        if (!/^\d{3,4}$/.test(card.cvv)) newErrors.cardCvv = "CVV invalid";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function goNext() {
    if (!validateStep(activeStep)) return;
    setActiveStep((s) => Math.min(STEPS.length - 1, s + 1));
  }
  function goBack() {
    if (activeStep === 0) handleCloseCheckout();
    else setActiveStep((s) => Math.max(0, s - 1));
  }

  async function placeOrder() {
    if (!validateStep(0) || !validateStep(1) || !validateStep(2)) return;
    setPlacing(true);
    setOrderError(null);
    try {
      // attempt to call real endpoint first
      let res;
      const resp = await fetch("/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cart, shipping, paymentMethod, total }),
      });
      if (!resp.ok) throw new Error("Server returned error");
      res = { id: Math.floor(Math.random() * 1e6).toString(), tracking: `TRK-${Math.random().toString(36).slice(2, 9).toUpperCase()}` };
      setOrderSuccess({ id: res.id, tracking: res.tracking });
      localStorage.removeItem(STORAGE_KEY);
      setActiveStep(3);
      setCartCopy(cart)
      resetCart()
    } catch (err: any) {
      setOrderError(err.message || "Order failed, try again");
    } finally {
      setPlacing(false);
    }
  }

  // Small animated container class
  const stepStyle: React.CSSProperties = {
    transition: "transform 300ms ease, opacity 300ms ease",
  };

  // Renderers for steps
  function CartStep() {
    const totalsBox = useRef<HTMLDivElement>();
    const [totalsHeight, setTotalsHeight] = useState(0);

    useLayoutEffect(() => {
        if (totalsBox.current) {
            setTotalsHeight(totalsBox.current.offsetHeight); 
        }
    }, []);

    return (
      <Box>
        {(cart?.items?.length || 0) === 0 ? (
          <Paper variant="outlined" sx={{ p: 3 }} aria-live="polite">
            <Typography variant="h6">Your cart is empty</Typography>
            <Typography color="text.secondary">Add items to the cart to continue.</Typography>
          </Paper>
        ) : (
          <Box>
            <Box
                sx={{
                    lr: 1,
                    height:`Calc(55vh - ${totalsHeight}px - 24px)`,
                    overflowY: "scroll",
                }}
            >
                <Grid container spacing={2}>
                    {cart?.items?.map((it) => (
                        <Grid item xs={12} md={6} key={it.id}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardContent>
                                <Box display="flex" alignItems="center">
                                    <Avatar variant="rounded" sx={{ width: 64, height: 64, mr: 2 }}>
                                        {it.name[0]}
                                    </Avatar>
                                    <Box sx={{ flex: 1 }}>
                                        <Typography noWrap>{it.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {currency(it.price)}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center" }}>
                                        <IconButton aria-label={`decrease ${it.name}`} onClick={() => addToCart(it.id, -1)}>
                                            <RemoveIcon />
                                        </IconButton>
                                        <Typography sx={{ mx: 1 }}>{it.itemInCart}</Typography>
                                        <IconButton aria-label={`increase ${it.name}`} onClick={() => addToCart(it.id, 1)}>
                                            <AddIcon />
                                        </IconButton>
                                    </Box>
                                </Box>
                                </CardContent>
                                <Box sx={{ p: 2, pt: 0 }}>
                                    <Button fullWidth color="error" onClick={() => removeItem(it.id)}>
                                        Remove
                                    </Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Box ref={totalsBox} sx={{ mt: 3 }}>
              <Typography>Subtotal: {currency(subtotal)}</Typography>
              <Typography>Tax (10%): {currency(tax)}</Typography>
              <Typography variant="h6">Total: {currency(total)}</Typography>
            </Box>
          </Box>
        )}

        {errors.cart && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.cart}
          </Alert>
        )}
      </Box>
    );
  }

  function ConfirmationStep() {
    return (
      <Box>
        {orderError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {orderError}
          </Alert>
        )}
        {orderSuccess ? (
          <Box>
            <Alert severity="success">Order placed! Reference: <strong>{orderSuccess.id}</strong></Alert>
            {orderSuccess.tracking && (
              <Chip label={`Tracking: ${orderSuccess.tracking}`} sx={{ mt: 2 }} />
            )}
            <Paper sx={{ p: 2, mt: 2 }}>
              <Typography variant="h6">Email Preview</Typography>
              <Divider sx={{ my: 1 }} />
              <Typography variant="subtitle2">To: you@example.com</Typography>
              <Typography variant="body2">Subject: Order Confirmation #{orderSuccess.id}</Typography>
              <Box sx={{ mt: 1 }}>
                <Typography><strong>Items</strong></Typography>
                {(cartCopy?.items?.length || 0) === 0 ? (
                  <Typography color="text.secondary">(cart cleared)</Typography>
                ) : (
                  cartCopy?.items?.map((it) => <Typography key={it.id}>{it.itemInCart} × {it.name} — {currency(it.price)}</Typography>)
                )}
                <Divider sx={{ my: 1 }} />
                <Typography><strong>Ship to</strong></Typography>
                <Typography>{shipping.fullName}</Typography>
                <Typography>{shipping.address}, {shipping.city} {shipping.postal}</Typography>
              </Box>
            </Paper>
          </Box>
        ) : (
          <Box>
            <Typography variant="h6">Order summary</Typography>
            <Box sx={{ mt: 1 }}>
              <Typography>Items: {(cart?.items?.length || 0)}</Typography>
              <Typography>Shipping: {shipping.slot}</Typography>
              <Typography>Payment: {paymentMethod}</Typography>
              <Typography variant="h6">Total: {currency(total)}</Typography>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                onClick={placeOrder}
                disabled={placing}
                startIcon={placing ? <CircularProgress size={16} /> : null}
                aria-disabled={placing}
              >
                {placing ? "Placing order..." : "Place Order"}
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 2}}>
        <Typography variant="h5" sx={{ mb: 2 }}>Checkout</Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
            {STEPS.map((s) => (
            <Step key={s}>
                <StepLabel>{s}</StepLabel>
            </Step>
            ))}
        </Stepper>
        <Box sx={{ mt: 3 }}>
            <Card variant="outlined">
                <CardContent>
                    <Box sx={{ minHeight: 240, height: "55vh", overflowY: "auto" }}>
                        <div style={{ ...(stepStyle as any), transform: activeStep === 0 ? "none" : "translateX(-10px)", opacity: activeStep === 0 ? 1 : 0.7 }} aria-hidden={activeStep !== 0}>
                            {activeStep === 0 && <CartStep />}
                        </div>

                        <div style={{ ...(stepStyle as any), transform: activeStep === 1 ? "none" : "translateX(-10px)", opacity: activeStep === 1 ? 1 : 0.7 }} aria-hidden={activeStep !== 1}>
                            {activeStep === 1 && <ShippingStep shipping={shipping} setShipping={setShipping} errors={errors}/>}
                        </div>

                        <div style={{ ...(stepStyle as any), transform: activeStep === 2 ? "none" : "translateX(-10px)", opacity: activeStep === 2 ? 1 : 0.7 }} aria-hidden={activeStep !== 2}>
                            {activeStep === 2 && <PaymentStep card={card} setCard={setCard} paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} errors={errors} />}
                        </div>

                        <div style={{ ...(stepStyle as any), transform: activeStep === 3 ? "none" : "translateX(-10px)", opacity: activeStep === 3 ? 1 : 0.7 }} aria-hidden={activeStep !== 3}>
                            {activeStep === 3 && <ConfirmationStep />}
                        </div>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                        <Button onClick={goBack} disabled={placing || orderSuccess !== null} aria-label="back">Back</Button>
                        <Box>
                            {activeStep < STEPS.length - 1 && (
                            <Button type="submit" variant="contained" onClick={goNext} aria-label="next">
                                Next
                            </Button>
                            )}
                            {activeStep === STEPS.length - 1 && (orderSuccess !== null) && (
                                <Button variant="contained" color="primary" onClick={() => {
                                    handleCloseCheckout();
                                }}>
                                    Return to the store
                                </Button>
                            )}
                        </Box>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    </Box>
  );
}
