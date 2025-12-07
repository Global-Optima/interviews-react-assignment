import { Cart, Product } from './types';

export const calculateOptimisticCart = (updatedProducts: Product[]): Cart => {
  const items = updatedProducts.filter((p) => p.itemInCart > 0);
  const totalItems = items.reduce((sum, p) => sum + p.itemInCart, 0);
  const totalPrice = items.reduce((sum, p) => sum + p.price * p.itemInCart, 0);

  return { items, totalItems, totalPrice };
};
