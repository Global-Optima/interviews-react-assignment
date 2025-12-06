import { useEffect, useState, useCallback } from 'react';
import { Product } from '../types';

export type SortOption = '' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

interface UseProductsParams {
    searchTerm: string;
    category: string;
    sortBy?: SortOption;
    minPrice?: number | null;
    maxPrice?: number | null;
}

export function useProducts({ searchTerm, category, sortBy = '', minPrice = null, maxPrice = null }: UseProductsParams) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState<number | null>(null);
    const limit = 20;

    useEffect(() => {
        setProducts([]);
        setPage(0);
        setHasMore(true);
        setError(null);
        setTotalCount(null);
    }, [searchTerm, category, sortBy, minPrice, maxPrice]);

    const fetchProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                limit: limit.toString(),
                page: page.toString(),
                q: searchTerm,
                category: category,
                sortBy: sortBy,
            });

            if (minPrice !== null) {
                queryParams.set('minPrice', minPrice.toString());
            }
            if (maxPrice !== null) {
                queryParams.set('maxPrice', maxPrice.toString());
            }

            const response = await fetch(`/products?${queryParams.toString()}`);
            const data = await response.json();

            if (data.products.length < limit) {
                setHasMore(false);
            }

            setTotalCount(data.total);

            setProducts(prev => {
                if (page === 0) {
                    return data.products;
                }

                const newProducts = data.products.filter(
                    (newP: Product) => !prev.some(existingP => existingP.id === newP.id)
                );
                return [...prev, ...newProducts];
            });

            setPage(prev => prev + 1);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, searchTerm, category, sortBy, minPrice, maxPrice]);

    useEffect(() => {
        if (page === 0) {
            fetchProducts();
        }
    }, [page, searchTerm, category, sortBy, minPrice, maxPrice, fetchProducts]);

    const resetError = useCallback(() => {
        setError(null);
    }, []);

    return {
        products,
        loading,
        hasMore,
        error,
        totalCount,
        loadMore: fetchProducts,
        setProducts,
        resetError
    };
}
