import { useState } from "react"
import { Product } from "../model/types";

interface useProductSearchProps {
    unsearchedProducts: Product[];
}

export const useProductSearch = ({unsearchedProducts}: useProductSearchProps) => {
    const [searchValue, setSearchValue] = useState("")

    const searchedProducts = unsearchedProducts.filter(product => 
        product.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return {
        searchValue,
        setSearchValue,
        searchedProducts
    }
}