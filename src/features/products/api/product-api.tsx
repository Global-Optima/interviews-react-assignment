import { Product } from "../model/types";

export const fetchProducts = async (page: number): Promise<Product[]> => {
  const response = await fetch(`/products?page=${page}&limit=20`);
  const data = await response.json();
  return data.products;
}