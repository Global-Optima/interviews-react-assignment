import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ShippingFormData {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  deliveryTimeSlot: 'morning' | 'afternoon' | 'evening' | undefined;
}

export type PaymentFormData =
  | {
      method: 'credit_card';
      cardNumber: string;
      expiry: string;
      cvv: string;
    }
  | {
      method: 'paypal';
    }
  | {
      method: 'cash';
    };

interface CartFormState {
  shipping: ShippingFormData | null;
  payment: PaymentFormData | null;
  setShipping: (data: ShippingFormData) => void;
  setPayment: (data: PaymentFormData) => void;
  clearForm: () => void;
}

export const useCartForm = create<CartFormState>()(
  persist(
    (set) => ({
      shipping: null,
      payment: null,
      setShipping: (data) => set({ shipping: data }),
      setPayment: (data) => set({ payment: data }),
      clearForm: () => set({ shipping: null, payment: null }),
    }),
    {
      name: 'cart-form-storage',
    }
  )
);