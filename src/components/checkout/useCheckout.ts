import { useContext } from 'react';
import { CheckoutContext, CheckoutContextValue } from './checkoutContextValue';

export function useCheckout(): CheckoutContextValue {
    const context = useContext(CheckoutContext);
    if (!context) {
        throw new Error('useCheckout must be used within a CheckoutProvider');
    }
    return context;
}
