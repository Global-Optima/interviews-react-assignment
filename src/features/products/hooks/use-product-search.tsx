import { useEffect, useState } from "react"
import { Product } from "../model/types";

interface useProductSearchProps {
    unsearchedProducts: Product[];
}

export const useProductSearch = ({unsearchedProducts}: useProductSearchProps) => {
    const params = new URLSearchParams(window.location.search);

    const initialSearchValue = params.get("search") || "";

    const [searchValue, setSearchValue] = useState(initialSearchValue)

    const searchedProducts = unsearchedProducts.filter(product => 
        product.name.toLowerCase().includes(searchValue.toLowerCase())
    );


    useEffect(() => {
        params.set("search", searchValue);
        window.history.replaceState({}, "", `?${params.toString()}`); 

    }, [searchValue]);

    return {
        searchValue,
        setSearchValue,
        searchedProducts
    }
}