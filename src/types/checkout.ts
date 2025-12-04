export type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart: number;
  loading: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Cart = {
  items: CartItem[];
  totalPrice: number;
  totalItems: number;
};

export type ShippingDetails = {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  deliverySlot: "Morning" | "Afternoon" | "Evening";
};

export type PaymentDetails = {
  method: "Credit Card" | "PayPal" | "Cash on Delivery";
  cardNumber?: string;
  expiryDate?: string;
  cvv?: string;
};

export type OrderStatus = {
  loading: boolean;
  success: boolean;
  error: string | null;
  orderId?: string;
};

export type StepProps = {
  cart: Cart | undefined;
  setCart: (cart: Cart) => void;
  shipping: ShippingDetails;
  setShipping: (shipping: ShippingDetails) => void;
  payment: PaymentDetails;
  setPayment: (payment: PaymentDetails) => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
};
