import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CartProvider, useCart } from '../CartContext'
import type { Product } from '@/types'

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  description: 'Test Description',
  price: 99.99,
  image: 'test.jpg',
  category: 'Test',
}

describe('CartContext', () => {
  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    act(() => {
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].product.id).toBe('1')
    expect(result.current.items[0].quantity).toBe(1)
  })

  it('should increment quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem(mockProduct)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
  })

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.removeItem('1')
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.updateQuantity('1', 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
  })

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.updateQuantity('1', 0)
    })

    expect(result.current.items).toHaveLength(0)
  })

  it('should calculate total items correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    act(() => {
      result.current.addItem(mockProduct, 3)
      result.current.addItem({ ...mockProduct, id: '2' }, 2)
    })

    expect(result.current.getTotalItems()).toBe(5)
  })

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    act(() => {
      result.current.addItem(mockProduct, 2)
    })

    expect(result.current.getTotalPrice()).toBe(199.98)
  })

  it('should clear cart', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: CartProvider,
    })

    act(() => {
      result.current.addItem(mockProduct)
      result.current.addItem({ ...mockProduct, id: '2' })
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
  })
})


