import { useEffect, useState, useCallback } from 'react';
import { Product } from '../types';

export function useProducts({ searchTerm, category }: { searchTerm: string; category: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const limit = 20;

    useEffect(() => {
        setProducts([]);
        setPage(0);
        setHasMore(true);
    }, [searchTerm, category]);

    const fetchProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                limit: limit.toString(),
                page: page.toString(),
                q: searchTerm,
                category: category,
            });

            const response = await fetch(`/products?${queryParams.toString()}`);
            const data = await response.json();

            if (data.products.length < limit) {
                setHasMore(false);
            }

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
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore, searchTerm, category]);

    useEffect(() => {
        if (page === 0) {
            fetchProducts();
        }
    }, [page, searchTerm, category]);

    return {
        products,
        loading,
        hasMore,
        loadMore: fetchProducts,
        setProducts
    };
}
