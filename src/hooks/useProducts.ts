import { useEffect, useState, useCallback } from 'react';
import { Product } from '../types';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    const fetchProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(`/products?limit=${limit}&page=${page}`);
            const data = await response.json();

            if (data.products.length < limit) {
                setHasMore(false);
            }

            setProducts(prev => {
                const newProducts = data.products.filter(
                    (newP: Product) => !prev.some(existingP => existingP.id === newP.id)
                );
                return [...prev, ...newProducts];
            });

            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        if (page === 0) {
            fetchProducts();
        }
    }, [fetchProducts, page]);

    return {
        products,
        loading,
        hasMore,
        loadMore: fetchProducts,
        setProducts
    };
}
