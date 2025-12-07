import {  useState } from 'react';
import { SetCart } from './useCart';

export function useOrderConfirmation(setCart: SetCart) {
  const [, setOrderStatus] = useState('pending');

  const handleOrderSuccess = () => {
    setCart({
      items: [],
      totalPrice: 0,
      totalItems: 0,
    });
    localStorage.removeItem('checkout_cart');
    localStorage.removeItem('checkout_shipping');
    localStorage.removeItem('checkout_payment');
    setOrderStatus('success');
  };

  return {
    setOrderStatus,
    handleOrderSuccess,
  };
}
