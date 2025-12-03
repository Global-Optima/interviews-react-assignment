import { delay, http, HttpResponse } from 'msw';
import { names } from './names.ts';

type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
};

const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Audio', 'Gaming', 'Wearables', 'Cameras'];

// Тематические изображения для каждой категории
const categoryImages: Record<string, string[]> = {
  'Laptops': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=300&fit=crop',
  ],
  'Smartphones': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1592286927505-c0d0c63d5cb1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=300&fit=crop',
  ],
  'Tablets': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1587033411391-5d9e51cce126?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=400&h=300&fit=crop',
  ],
  'Accessories': [
    'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1624823183493-ed5832f48f18?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=400&h=300&fit=crop',
  ],
  'Audio': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1558756520-22cfe5d382ca?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop',
  ],
  'Gaming': [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&h=300&fit=crop',
  ],
  'Wearables': [
    'https://images.unsplash.com/photo-1523475496153-3d6cc0f0bf19?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1557438159-51eec7a6c9e8?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1434493651957-4715a86b2f6e?w=400&h=300&fit=crop',
  ],
  'Cameras': [
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1512790182412-b531d3c3cb9f?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  ],
};

function randomTechCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

function getCategoryImage(category: string, index: number): string {
  const images = categoryImages[category];
  if (!images || images.length === 0) {
    return `https://via.placeholder.com/400x300/1976d2/ffffff?text=${encodeURIComponent(category)}`;
  }
  // Выбираем изображение циклично, чтобы каждый товар имел уникальное фото
  return images[index % images.length];
}

// generate a rondom list of product with approriate library
const products: Product[] = names.map((name, index) => {
  const category = randomTechCategory();
  return {
    id: index,
    name: name,
    imageUrl: getCategoryImage(category, index),
    price: parseFloat((Math.random() * 2970 + 29).toFixed(2)), // $29 - $2999
    category: category,
  };
});

let cart: Record<number, number> = {};

function computeCart() {
  const detailedCart = Object.entries(cart)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, quantity]) => quantity > 0)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === parseInt(productId, 10))!;
      return {
        id: product.id,
        quantity,
      };
    });
  const totalPrice = Object.entries(cart)
    .filter(([_, quantity]) => quantity > 0)
    .reduce((acc, [productId, quantity]) => {
      const product = products.find((p) => p.id === parseInt(productId, 10))!;
      return acc + product.price * quantity;
    }, 0);
  const totalItems = detailedCart.reduce((acc, { quantity }) => acc + quantity, 0);
  return HttpResponse.json({
    items: detailedCart,
    totalPrice,
    totalItems,
  });
}

export const handlers = [
  http.get('/products', async ({ request }) => {
    await delay();
    // Construct a URL instance out of the intercepted request.
    const url = new URL(request.url);

    // Read the "id" URL query parameter using the "URLSearchParams" API.
    // Given "/product?id=1", "productId" will equal "1".
    const searchQuery = url.searchParams.get('q');
    const category = url.searchParams.get('category');
    const page = url.searchParams.get('page') || '0';
    const limit = url.searchParams.get('limit') || '10';

    const filteredProducts = products.filter((product) => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (category && product.category !== category) {
        return false;
      }
      return true;
    });
    const realPage = parseInt(page, 10) || 0;
    const realLimit = parseInt(limit, 10) || 10;
    const pageList = filteredProducts.slice(realPage * realLimit, (realPage + 1) * realLimit);

    return HttpResponse.json({
      products: pageList,
      total: filteredProducts.length,
      hasMore: realPage * realLimit + realLimit < filteredProducts.length,
    });
  }),
  http.post<never, { productId: number; quantity: number }>('/cart', async ({ request }) => {
    await delay(1000);
    const { productId, quantity } = await request.json();
    const currentQuantity = cart[productId] || 0;
    cart[productId] = currentQuantity + quantity;
    return computeCart();
  }),
  http.get('/cart', async () => {
    await delay();
    return HttpResponse.json(computeCart());
  }),
  http.post('/orders', async () => {
    await delay(1500);

    cart = {};

    return new HttpResponse(undefined, Math.random() > 0.5 ? { status: 200 } : { status: 500 });
  }),
];
