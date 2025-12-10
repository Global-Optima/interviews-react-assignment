import { useState, useCallback, useEffect, ReactNode } from 'react';
import {
    CheckoutState,
    ShippingInfo,
    PaymentInfo,
    CartData,
    OrderStatus,
    INITIAL_SHIPPING_INFO,
    INITIAL_PAYMENT_INFO,
    ShippingFormErrors,
    CardFormErrors,
} from './types';
import { CheckoutContext, CheckoutContextValue } from './checkoutContextValue';

const SHIPPING_STORAGE_KEY = 'checkout_shipping_info';

interface CheckoutProviderProps {
    children: ReactNode;
    initialCart: CartData | null;
    onCartChange: (cart: CartData) => void;
    onClose: () => void;
}

export function CheckoutProvider({
    children,
    initialCart,
    onCartChange,
    onClose
}: CheckoutProviderProps) {
    const [cart, setCart] = useState<CartData | null>(initialCart);
    const [currentStep, setCurrentStep] = useState(0);
    const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle');
    const [orderTrackingNumber, setOrderTrackingNumber] = useState<string>();
    const [orderError, setOrderError] = useState<string>();

    const loadShippingFromStorage = (): ShippingInfo => {
        try {
            const stored = localStorage.getItem(SHIPPING_STORAGE_KEY);
            if (stored) {
                return { ...INITIAL_SHIPPING_INFO, ...JSON.parse(stored) };
            }
        } catch {
        }
        return INITIAL_SHIPPING_INFO;
    };

    const [shippingInfo, setShippingInfoState] = useState<ShippingInfo>(loadShippingFromStorage);
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>(INITIAL_PAYMENT_INFO);
    const [shippingErrors, setShippingErrors] = useState<ShippingFormErrors>({});
    const [cardErrors, setCardErrors] = useState<CardFormErrors>({});

    useEffect(() => {
        setCart(initialCart);
    }, [initialCart]);

    const setShippingInfo = useCallback((info: ShippingInfo) => {
        setShippingInfoState(info);
        try {
            localStorage.setItem(SHIPPING_STORAGE_KEY, JSON.stringify(info));
        } catch {
        }
    }, []);

    const refreshCart = useCallback(async () => {
        try {
            const response = await fetch('/cart');
            const data = await response.json();
            setCart(data);
            onCartChange(data);
        } catch {
        }
    }, [onCartChange]);

    const updateCartItem = useCallback(async (productId: number, quantity: number) => {
        try {
            const response = await fetch('/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, quantity }),
            });
            const data = await response.json();
            setCart(data);
            onCartChange(data);
        } catch {
        }
    }, [onCartChange]);

    const validateShipping = useCallback((): boolean => {
        const errors: ShippingFormErrors = {};

        if (!shippingInfo.fullName.trim()) {
            errors.fullName = 'Full name is required';
        }
        if (!shippingInfo.address.trim()) {
            errors.address = 'Address is required';
        }
        if (!shippingInfo.city.trim()) {
            errors.city = 'City is required';
        }
        if (!shippingInfo.postalCode.trim()) {
            errors.postalCode = 'Postal code is required';
        } else if (!/^[0-9]{5,6}$/.test(shippingInfo.postalCode.replace(/\s/g, ''))) {
            errors.postalCode = 'Invalid postal code format';
        }
        if (!shippingInfo.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!/^[+]?[0-9\s-]{10,15}$/.test(shippingInfo.phone.replace(/\s/g, ''))) {
            errors.phone = 'Invalid phone number format';
        }

        setShippingErrors(errors);
        return Object.keys(errors).length === 0;
    }, [shippingInfo]);

    const validatePayment = useCallback((): boolean => {
        if (paymentInfo.method !== 'creditCard') {
            setCardErrors({});
            return true;
        }

        const errors: CardFormErrors = {};
        const card = paymentInfo.cardDetails;

        if (!card?.cardNumber.trim()) {
            errors.cardNumber = 'Card number is required';
        } else if (!/^[0-9]{16}$/.test(card.cardNumber.replace(/\s/g, ''))) {
            errors.cardNumber = 'Card number must be 16 digits';
        }

        if (!card?.expiry.trim()) {
            errors.expiry = 'Expiry date is required';
        } else if (!/^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(card.expiry)) {
            errors.expiry = 'Use MM/YY format';
        }

        if (!card?.cvv.trim()) {
            errors.cvv = 'CVV is required';
        } else if (!/^[0-9]{3,4}$/.test(card.cvv)) {
            errors.cvv = 'CVV must be 3-4 digits';
        }

        setCardErrors(errors);
        return Object.keys(errors).length === 0;
    }, [paymentInfo]);

    const canProceed = useCallback((): boolean => {
        switch (currentStep) {
            case 0:
                return (cart?.items?.length ?? 0) > 0;
            case 1:
                return !!(
                    shippingInfo.fullName.trim() &&
                    shippingInfo.address.trim() &&
                    shippingInfo.city.trim() &&
                    shippingInfo.postalCode.trim() &&
                    shippingInfo.phone.trim()
                );
            case 2:
                if (paymentInfo.method !== 'creditCard') return true;
                return !!(
                    paymentInfo.cardDetails?.cardNumber.trim() &&
                    paymentInfo.cardDetails?.expiry.trim() &&
                    paymentInfo.cardDetails?.cvv.trim()
                );
            case 3:
                return true;
            default:
                return false;
        }
    }, [currentStep, cart, shippingInfo, paymentInfo]);

    const goNext = useCallback(() => {
        if (currentStep < 3 && canProceed()) {
            setCurrentStep(prev => prev + 1);
        }
    }, [currentStep, canProceed]);

    const goBack = useCallback(() => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    }, [currentStep]);

    const goToStep = useCallback((step: number) => {
        if (step >= 0 && step <= currentStep) {
            setCurrentStep(step);
        }
    }, [currentStep]);

    const submitOrder = useCallback(async () => {
        setOrderStatus('submitting');
        setOrderError(undefined);

        try {
            const response = await fetch('/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart?.items,
                    shipping: shippingInfo,
                    payment: { method: paymentInfo.method },
                }),
            });

            if (response.ok) {
                const trackingNumber = `TRK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
                setOrderTrackingNumber(trackingNumber);
                setOrderStatus('success');
                localStorage.removeItem(SHIPPING_STORAGE_KEY);
                await refreshCart();
            } else {
                setOrderError('Order failed. Please try again.');
                setOrderStatus('error');
            }
        } catch {
            setOrderError('Network error. Please check your connection and try again.');
            setOrderStatus('error');
        }
    }, [cart, shippingInfo, paymentInfo.method, refreshCart]);

    const resetCheckout = useCallback(() => {
        setCurrentStep(0);
        setOrderStatus('idle');
        setOrderTrackingNumber(undefined);
        setOrderError(undefined);
        setShippingErrors({});
        setCardErrors({});
        onClose();
    }, [onClose]);

    const state: CheckoutState = {
        currentStep,
        shippingInfo,
        paymentInfo,
        orderStatus,
        orderTrackingNumber,
        orderError,
    };

    const value: CheckoutContextValue = {
        cart,
        refreshCart,
        updateCartItem,
        state,
        currentStep,
        goToStep,
        goNext,
        goBack,
        canProceed: canProceed(),
        shippingInfo,
        setShippingInfo,
        shippingErrors,
        validateShipping,
        paymentInfo,
        setPaymentInfo,
        cardErrors,
        validatePayment,
        orderStatus,
        orderTrackingNumber,
        orderError,
        submitOrder,
        resetCheckout,
    };

    return (
        <CheckoutContext.Provider value={value}>
            {children}
        </CheckoutContext.Provider>
    );
}
