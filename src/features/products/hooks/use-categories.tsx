import { useMemo, useState } from "react";
import { Product } from "../model/types";

interface useCategoriesProps {
  unfilteredProducts?: Product[];
}

export const useCategories = ({unfilteredProducts}: useCategoriesProps) => {
  const params = new URLSearchParams(window.location.search);
  const urlCategories = params.getAll("category");

  const [categories, setCategories] = useState<string[]>(urlCategories || []);



  const toggleCategory = (category: string) => {  
    const params = new URLSearchParams(window.location.search);

    setCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        params.delete("category", category);
        window.history.replaceState({}, "", `?${params.toString()}`); 

        return prevCategories.filter((cat) => cat !== category);
      } else {
        params.append("category", category);
        window.history.replaceState({}, "", `?${params.toString()}`); 

        return [...prevCategories, category];
      }
    });
  }

  const filteredProducts = useMemo(() => {
    if (!unfilteredProducts) return [];
    return unfilteredProducts.filter(
      (product) =>
        categories.length === 0 || categories.includes(product.category)
    );
  }, [unfilteredProducts, categories]);



  return {
    categories,
    setCategories,
    toggleCategory,
    filteredProducts
  };
};
