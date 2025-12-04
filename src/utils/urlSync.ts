import type { ProductFilters, SortOption } from '@/types'

export function filtersToUrlParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.category) params.set('category', filters.category)
  if (filters.sort !== 'name_asc') params.set('sort', filters.sort)
  if (filters.page > 1) params.set('page', filters.page.toString())
  return params
}

export function urlParamsToFilters(searchParams: URLSearchParams): Partial<ProductFilters> {
  const filters: Partial<ProductFilters> = {}
  const search = searchParams.get('search')
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') as SortOption | null
  const page = searchParams.get('page')

  if (search) filters.search = search
  if (category) filters.category = category
  if (sort && ['price_asc', 'price_desc', 'name_asc', 'name_desc'].includes(sort)) {
    filters.sort = sort
  }
  if (page) {
    const pageNum = parseInt(page, 10)
    if (!isNaN(pageNum) && pageNum > 0) {
      filters.page = pageNum
    }
  }

  return filters
}


