import { Cart, ShippingDetails, PaymentDetails } from "../types/checkout";

const STORAGE_KEYS = {
  CART: "checkout_cart",
  SHIPPING: "checkout_shipping",
  PAYMENT: "checkout_payment",
} as const;

export const storage = {
  // Cart
  getCart: (): Cart | null => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveCart: (cart: Cart): void => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  clearCart: (): void => {
    localStorage.removeItem(STORAGE_KEYS.CART);
  },

  // Shipping
  getShipping: (): ShippingDetails => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SHIPPING);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      fullName: "",
      address: "",
      city: "",
      postalCode: "",
      phone: "",
      deliverySlot: "Morning",
    };
  },

  saveShipping: (shipping: ShippingDetails): void => {
    localStorage.setItem(STORAGE_KEYS.SHIPPING, JSON.stringify(shipping));
  },

  clearShipping: (): void => {
    localStorage.removeItem(STORAGE_KEYS.SHIPPING);
  },

  getPayment: (): PaymentDetails => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PAYMENT);
      if (data) return JSON.parse(data);
    } catch {}
    return { method: "Credit Card" };
  },

  savePayment: (payment: PaymentDetails): void => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT, JSON.stringify(payment));
  },

  clearPayment: (): void => {
    localStorage.removeItem(STORAGE_KEYS.PAYMENT);
  },

  // Clear all
  clearAll(): void {
    this.clearCart();
    this.clearShipping();
    this.clearPayment();
  },
};
