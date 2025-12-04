export interface Product {
  id: string
  title: string
  description: string
  price: number
  image: string
  category: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface ShippingDetails {
  fullName: string
  phone: string
  address: string
  city: string
  zipCode: string
  country: string
}

export type PaymentMethod = 'credit_card' | 'paypal' | 'cash_on_delivery'

export interface PaymentDetails {
  method: PaymentMethod
  cardNumber?: string
  expiration?: string
  cvv?: string
}

export interface Order {
  id: string
  items: CartItem[]
  shipping: ShippingDetails
  payment: PaymentDetails
  total: number
  subtotal: number
  tax: number
  createdAt: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export type SortOption = 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'

export interface ProductFilters {
  search: string
  category: string
  sort: SortOption
  page: number
  limit: number
}


