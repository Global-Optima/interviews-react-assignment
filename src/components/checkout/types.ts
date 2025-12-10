import { Product } from '../../types';

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface CartData {
    items: CartItem[];
    totalPrice: number;
    totalItems: number;
}

export type DeliveryTimeSlot = 'morning' | 'afternoon' | 'evening';

export interface ShippingInfo {
    fullName: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    deliveryTimeSlot: DeliveryTimeSlot;
}

export type PaymentMethod = 'creditCard' | 'paypal' | 'cashOnDelivery';

export interface CardDetails {
    cardNumber: string;
    expiry: string;
    cvv: string;
}

export interface PaymentInfo {
    method: PaymentMethod;
    cardDetails?: CardDetails;
}

export type OrderStatus = 'idle' | 'submitting' | 'success' | 'error';

export interface CheckoutState {
    currentStep: number;
    shippingInfo: ShippingInfo;
    paymentInfo: PaymentInfo;
    orderStatus: OrderStatus;
    orderTrackingNumber?: string;
    orderError?: string;
}

export interface ShippingFormErrors {
    fullName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    phone?: string;
    deliveryTimeSlot?: string;
}

export interface CardFormErrors {
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
}

export const DELIVERY_TIME_SLOTS: { value: DeliveryTimeSlot; label: string; time: string }[] = [
    { value: 'morning', label: 'Morning', time: '9:00 AM - 12:00 PM' },
    { value: 'afternoon', label: 'Afternoon', time: '12:00 PM - 5:00 PM' },
    { value: 'evening', label: 'Evening', time: '5:00 PM - 9:00 PM' },
];

export const INITIAL_SHIPPING_INFO: ShippingInfo = {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    deliveryTimeSlot: 'morning',
};

export const INITIAL_PAYMENT_INFO: PaymentInfo = {
    method: 'creditCard',
    cardDetails: {
        cardNumber: '',
        expiry: '',
        cvv: '',
    },
};

export const CHECKOUT_STEPS = ['Cart Review', 'Shipping', 'Payment', 'Confirmation'];
