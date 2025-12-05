import { useState } from "react";
import { Product } from "../model/types";

interface useCategoriesProps {
  unfilteredProducts?: Product[];
}

export const useCategories = ({unfilteredProducts}: useCategoriesProps) => {
  const [categories, setCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {  
    setCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        return prevCategories.filter((cat) => cat !== category);
      } else {
        return [...prevCategories, category];
      }
    });
  }

  const filteredProducts = unfilteredProducts?.filter(product => 
    categories.length === 0 || categories.includes(product.category)
  ) || [];

  return {
    categories,
    setCategories,
    toggleCategory,
    filteredProducts
  };
};
