import { useRef } from "react";
import { useState } from "react";
import { Product } from "../model/types";
import { useEffect } from "react";
import { fetchProducts } from "../api/product-api";

export const useInfiniteProducts = () => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const fetchedPagesRef = useRef<Set<number>>(new Set()); //to avoid dublicate fetches, strict mode bug

  const allFetchedRef = useRef(false); // stop fetching when all products are fetched
  const [allFetched, setAllFetched] = useState(false); // used for rendering logic (show message when all fetched)

  const loadingRef = useRef(false); //used for internal logic 
  const [loading, setLoading] = useState(false); //used for rendering loading logic

  // todo: debounce? 
  const handleScroll = () => {
      if (loadingRef.current || allFetchedRef.current || !elementRef.current) return;

      const lowestFrame = elementRef.current?.scrollHeight! - elementRef.current?.clientHeight!
      const threshold = elementRef.current?.clientHeight! * 0.3

      if (elementRef.current?.scrollTop! >= lowestFrame - threshold) {
        setPage((prevPage) => prevPage + 1);
        loadingRef.current = true;
        setLoading(true);
      }
  }
  
  useEffect(() => {
      elementRef.current?.addEventListener('scroll', handleScroll);
    return () => elementRef.current?.removeEventListener('scroll', handleScroll)
  }, []);

  useEffect(() => {
    fetchProducts(page).then(newProducts => {
      //check if page was already fetched
      if( fetchedPagesRef.current.has(page)) {
        setLoading(false);
        loadingRef.current = false;
        return;
      }

      //handle last fetch
      if (newProducts.length === 0) {
        allFetchedRef.current = true;
        setAllFetched(true);
        
        loadingRef.current = false;
        setLoading(false);
        return;
      }

      setProducts(prevProducts => [...prevProducts, ...newProducts]);
      fetchedPagesRef.current.add(page);
      
      setLoading(false);
      loadingRef.current = false;
    });
  }, [page]);


  return { products, loading, allFetched, elementRef };
}