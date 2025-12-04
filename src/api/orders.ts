import type { Order } from '@/types'

const API_BASE = '/api'

export const ordersApi = {
  async createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to create order' }))
      throw new Error(error.message || 'Failed to create order')
    }

    return response.json()
  },
}


