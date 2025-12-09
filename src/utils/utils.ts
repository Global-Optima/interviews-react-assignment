import { Cart, Product } from '../types/types';

export const calculateOptimisticCart = (updatedProducts: Product[]): Cart => {
  const items = updatedProducts.filter((p) => p.itemInCart > 0);
  const totalItems = items.reduce((sum, p) => sum + p.itemInCart, 0);
  const totalPrice = items.reduce((sum, p) => sum + p.price * p.itemInCart, 0);

  return { items, totalItems, totalPrice };
};

export const formatCardNumber = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  const chunks = cleaned.match(/.{1,4}/g) || [];
  return chunks.join(' ').substring(0, 19); // Max 16 digits + 3 spaces
};

export const formatExpiry = (value: string) => {
  const cleaned = value.replace(/\D/g, '');
  if (cleaned.length >= 2) {
    return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
  }
  return cleaned;
};

export const calculateSubtotal = (cart: Cart) => {
  return cart.totalPrice;
};

export const calculateTax = (subtotal: number) => {
  return subtotal * 0.1;
};

export const calculateTotal = (cart: Cart) => {
  const subtotal = calculateSubtotal(cart);
  return subtotal + calculateTax(subtotal);
};
