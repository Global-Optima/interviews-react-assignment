import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react'
import type { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; product: Product; quantity?: number }
  | { type: 'REMOVE_ITEM'; productId: string }
  | { type: 'UPDATE_QUANTITY'; productId: string; quantity: number }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; items: CartItem[] }

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'global-optima-cart'

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.product.id === action.product.id)
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + (action.quantity || 1) }
              : item
          ),
        }
      }
      return {
        items: [...state.items, { product: action.product, quantity: action.quantity || 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return {
        items: state.items.filter((item) => item.product.id !== action.productId),
      }
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return {
          items: state.items.filter((item) => item.product.id !== action.productId),
        }
      }
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId ? { ...item, quantity: action.quantity } : item
        ),
      }
    case 'CLEAR_CART':
      return { items: [] }
    case 'LOAD_CART':
      return { items: action.items }
    default:
      return state
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const items = JSON.parse(saved) as CartItem[]
        dispatch({ type: 'LOAD_CART', items })
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage', error)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items))
    } catch (error) {
      console.error('Failed to save cart to localStorage', error)
    }
  }, [state.items])

  const addItem = useCallback((product: Product, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', product, quantity })
  }, [])

  const removeItem = useCallback((productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', productId })
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', productId, quantity })
  }, [])

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' })
  }, [])

  const getTotalItems = useCallback(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [state.items])

  const getTotalPrice = useCallback(() => {
    return state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  }, [state.items])

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}


