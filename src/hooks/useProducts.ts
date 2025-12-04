import { useState, useEffect, useCallback } from 'react'
import { productsApi } from '@/api/products'
import type { Product, ProductFilters, SortOption } from '@/types'

interface UseProductsOptions {
  initialFilters?: Partial<ProductFilters>
}

export function useProducts({ initialFilters = {} }: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: '',
    sort: 'name_asc',
    page: 1,
    limit: 12,
    ...initialFilters,
  })
  const [hasMore, setHasMore] = useState(false)
  const [total, setTotal] = useState(0)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await productsApi.getProducts(filters)
      setProducts(response.products)
      setHasMore(response.hasMore)
      setTotal(response.total)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch products'))
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const updateFilters = useCallback((newFilters: Partial<ProductFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }))
  }, [])

  const updateSort = useCallback((sort: SortOption) => {
    setFilters((prev) => ({ ...prev, sort, page: 1 }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      sort: 'name_asc',
      page: 1,
      limit: 12,
    })
  }, [])

  return {
    products,
    loading,
    error,
    filters,
    hasMore,
    total,
    updateFilters,
    updateSort,
    resetFilters,
    refetch: fetchProducts,
  }
}


