import { http, HttpResponse } from 'msw'
import type { Product, Order, ProductsResponse } from '@/types'

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&fit=crop&q=80',
    category: 'Electronics',
  },
  {
    id: '2',
    title: 'Smart Watch',
    description: 'Feature-rich smartwatch with health tracking',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&fit=crop&q=80',
    category: 'Electronics',
  },
  {
    id: '3',
    title: 'Laptop Stand',
    description: 'Ergonomic aluminum laptop stand',
    price: 49.99,
    image: '/images/laptop-stand.jpg',
    category: 'Accessories',
  },
  {
    id: '4',
    title: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 129.99,
    image: '/images/keyboard.jpg',
    category: 'Accessories',
  },
  {
    id: '5',
    title: 'USB-C Hub',
    description: 'Multi-port USB-C hub with HDMI and SD card reader',
    price: 79.99,
    image: '/images/usb-c-hub.jpg.jpg',
    category: 'Accessories',
  },
  {
    id: '6',
    title: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with long battery life',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&fit=crop&q=80',
    category: 'Accessories',
  },
  {
    id: '7',
    title: 'Monitor 27"',
    description: '4K 27-inch monitor with HDR support',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&fit=crop&q=80',
    category: 'Electronics',
  },
  {
    id: '8',
    title: 'Webcam HD',
    description: '1080p HD webcam with autofocus',
    price: 89.99,
    image: '/images/webcam-hd.jpg.jpg',
    category: 'Electronics',
  },
  {
    id: '9',
    title: 'Desk Lamp',
    description: 'LED desk lamp with adjustable brightness',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&fit=crop&q=80',
    category: 'Accessories',
  },
  {
    id: '10',
    title: 'Tablet Stand',
    description: 'Adjustable tablet stand for desk use',
    price: 34.99,
    image: '/images/tablet-stand.jpg',
    category: 'Accessories',
  },
  {
    id: '11',
    title: 'Chair',
    description: 'Ergonomic gaming chair with lumbar support',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&fit=crop&q=80',
    category: 'Furniture',
  },
  {
    id: '12',
    title: 'Standing Desk',
    description: 'Electric height-adjustable standing desk',
    price: 599.99,
    image: '/images/standing-desk.jpg',
    category: 'Furniture',
  },
]

const categories = Array.from(new Set(mockProducts.map((p) => p.category)))

export const handlers = [
  // GET /api/products
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url)
    const search = url.searchParams.get('search') || ''
    const category = url.searchParams.get('category') || ''
    const sort = url.searchParams.get('sort') || 'name_asc'
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '12', 10)

    let filtered = [...mockProducts]

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
      )
    }

    // Filter by category
    if (category) {
      filtered = filtered.filter((p) => p.category === category)
    }

    // Sort
    switch (sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'name_asc':
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'name_desc':
        filtered.sort((a, b) => b.title.localeCompare(a.title))
        break
    }

    // Paginate
    const start = (page - 1) * limit
    const end = start + limit
    const paginated = filtered.slice(start, end)
    const hasMore = end < filtered.length

    const response: ProductsResponse = {
      products: paginated,
      total: filtered.length,
      page,
      limit,
      hasMore,
    }

    return HttpResponse.json(response)
  }),

  // GET /api/products/:id
  http.get('/api/products/:id', ({ params }) => {
    const { id } = params
    const product = mockProducts.find((p) => p.id === id)
    if (!product) {
      return HttpResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    return HttpResponse.json(product)
  }),

  // GET /api/categories
  http.get('/api/categories', () => {
    return HttpResponse.json(categories)
  }),

  // POST /api/orders
  http.post('/api/orders', async ({ request }) => {
    const orderData = (await request.json()) as Omit<Order, 'id' | 'createdAt'>

    // 50% chance of error
    if (Math.random() > 0.5) {
      return HttpResponse.json(
        { error: 'Order creation failed. Please try again.' },
        { status: 500 }
      )
    }

    const order: Order = {
      ...orderData,
      id: `order-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    return HttpResponse.json(order, { status: 201 })
  }),
]

