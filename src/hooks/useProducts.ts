import { useEffect, useState, useCallback } from 'react';
import { Product } from '../types';

export type SortOption = '' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc';

export function useProducts({ searchTerm, category, sortBy = '' }: { searchTerm: string; category: string; sortBy?: SortOption }) {
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
    }, [searchTerm, category, sortBy]);

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
    }, [page, loading, hasMore, searchTerm, category, sortBy]);

    useEffect(() => {
        if (page === 0) {
            fetchProducts();
        }
    }, [page, searchTerm, category, sortBy, fetchProducts]);

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
