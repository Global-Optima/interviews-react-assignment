import { createContext } from 'react';
import {
    CheckoutState,
    ShippingInfo,
    PaymentInfo,
    CartData,
    OrderStatus,
    ShippingFormErrors,
    CardFormErrors,
} from './types';

export interface CheckoutContextValue {
    cart: CartData | null;
    refreshCart: () => Promise<void>;
    updateCartItem: (productId: number, quantity: number) => Promise<void>;

    state: CheckoutState;

    currentStep: number;
    goToStep: (step: number) => void;
    goNext: () => void;
    goBack: () => void;
    canProceed: boolean;

    shippingInfo: ShippingInfo;
    setShippingInfo: (info: ShippingInfo) => void;
    shippingErrors: ShippingFormErrors;
    validateShipping: () => boolean;

    paymentInfo: PaymentInfo;
    setPaymentInfo: (info: PaymentInfo) => void;
    cardErrors: CardFormErrors;
    validatePayment: () => boolean;

    orderStatus: OrderStatus;
    orderTrackingNumber: string | undefined;
    orderError: string | undefined;
    submitOrder: () => Promise<void>;
    resetCheckout: () => void;
}

export const CheckoutContext = createContext<CheckoutContextValue | null>(null);
