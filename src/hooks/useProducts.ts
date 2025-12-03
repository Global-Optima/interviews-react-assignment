import { useEffect, useState, useRef, useCallback } from "react";
import { Product } from "../types/Product.types";

const LIMIT = 20;

export const useProducts = (search: string, category: string | null) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const loadingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchProducts = useCallback(async () => {
    if (loadingRef.current) return;


    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", String(LIMIT));
      if (search) {
        params.set("q", search);
      }
      if (category) {
        params.set("category", category);
      }

      const response = await fetch(`/products?${params.toString()}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();
      const newProducts = data.products || [];

      setProducts((prev) => [...prev, ...newProducts]);
      setTotal(data.total ?? newProducts.length);
      setHasMore(
        typeof data.hasMore === "boolean"
          ? data.hasMore
          : newProducts.length === LIMIT
      );
    } catch (err) {

      if ((err as DOMException).name === "AbortError") {
        return;
      }
      setError("Something went wrong. Retry please");
      setHasMore(false);
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  }, [page, search, category]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setProducts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
  }, [search, category]);


  useEffect(() => {
    return () => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, []);

  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return {
    products,
    setProducts,
    loading,
    hasMore,
    error,
    total,
    loadMore,
  };
};
