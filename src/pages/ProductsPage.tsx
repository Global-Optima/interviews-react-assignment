import { useEffect, useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import { ProductModal } from '@/components/ProductModal'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useCart } from '@/context/CartContext'
import { urlParamsToFilters, filtersToUrlParams } from '@/utils/urlSync'
import type { SortOption, Product } from '@/types'

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedProduct, setSelectedProduct] = useState<{ id: string } | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Initialize filters from URL
  const urlFilters = urlParamsToFilters(searchParams)
  const {
    products,
    loading,
    error,
    filters,
    updateFilters,
    updateSort,
    resetFilters,
  } = useProducts({ initialFilters: urlFilters })

  const { categories } = useCategories()
  const { addItem, updateQuantity, items } = useCart()

  // Sync filters to URL
  useEffect(() => {
    const params = filtersToUrlParams(filters)
    setSearchParams(params, { replace: true })
  }, [filters, setSearchParams])

  const handleSearchChange = useCallback(
    (value: string) => {
      updateFilters({ search: value })
    },
    [updateFilters]
  )


  const handleCategoryChange = useCallback(
    (value: string) => {
      updateFilters({ category: value })
    },
    [updateFilters]
  )

  const handleSortChange = useCallback(
    (value: SortOption) => {
      updateSort(value)
    },
    [updateSort]
  )

  const handleReset = useCallback(() => {
    resetFilters()
    setSearchParams(new URLSearchParams(), { replace: true })
  }, [resetFilters, setSearchParams])

  const handleAddToCart = useCallback(
    (product: Product) => {
      // From card - always add/sum quantity
      addItem(product, 1)
    },
    [addItem]
  )

  const handleAddToCartFromModal = useCallback(
    (product: Product, quantity: number) => {
      // From modal - replace quantity if item exists
      const existingItem = items.find((item) => item.product.id === product.id)
      if (existingItem) {
        updateQuantity(product.id, quantity)
      } else {
        addItem(product, quantity)
      }
    },
    [addItem, updateQuantity, items]
  )

  const handleProductClick = useCallback((productId: string) => {
    setSelectedProduct({ id: productId })
    setModalOpen(true)
  }, [])

  return (
    <Container maxWidth="xl" sx={{ py: 4, px: { xs: 2, sm: 3 } }}>
      <Typography variant="h2" sx={{ mb: 3 }}>
        Products
      </Typography>

      <ProductFilters
        search={filters.search}
        category={filters.category}
        sort={filters.sort}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onReset={handleReset}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error.message}
        </Alert>
      )}

      {!loading && !error && products.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="body1" color="text.secondary">
            No products found
          </Typography>
        </Box>
      )}

      {!loading && !error && products.length > 0 && (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
              <Box onClick={() => handleProductClick(product.id)} sx={{ cursor: 'pointer' }}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
              </Box>
            </Grid>
          ))}
        </Grid>
      )}

      <ProductModal
        open={modalOpen}
        product={selectedProduct ? products.find((p) => p.id === selectedProduct.id) || null : null}
        onClose={() => {
          setModalOpen(false)
          setSelectedProduct(null)
        }}
        onAddToCart={handleAddToCartFromModal}
      />
    </Container>
  )
}

