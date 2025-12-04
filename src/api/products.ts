import type { Product, ProductsResponse, ProductFilters } from '@/types'

const API_BASE = '/api'

export const productsApi = {
  async getProducts(filters: ProductFilters): Promise<ProductsResponse> {
    const params = new URLSearchParams()
    if (filters.search) params.append('search', filters.search)
    if (filters.category) params.append('category', filters.category)
    params.append('sort', filters.sort)
    params.append('page', filters.page.toString())
    params.append('limit', filters.limit.toString())

    const response = await fetch(`${API_BASE}/products?${params.toString()}`)
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    return response.json()
  },

  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE}/products/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch product')
    }
    return response.json()
  },
}


