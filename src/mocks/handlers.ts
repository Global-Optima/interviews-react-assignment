import { delay, http, HttpResponse } from 'msw';
import { names } from './names.ts';

type Product = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  category: string;
  itemInCart?: number;
};

const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Audio', 'Gaming', 'Wearables', 'Cameras'];

function randomTechCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

// generate a rondom list of product with approriate library
const LS_KEY_PRODUCTS = 'mock_products_storage';

function loadProducts(): Product[] {
  try {
    const stored = localStorage.getItem(LS_KEY_PRODUCTS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }

  // Generate if not found
  const generated = names.map((name, index) => ({
    id: index,
    name: name,
    imageUrl: `https://placehold.co/150x150?text=Product+${index}`,
    price: parseFloat((Math.random() * 2970 + 29).toFixed(2)), // $29 - $2999
    category: randomTechCategory(),
  }));

  try {
    localStorage.setItem(LS_KEY_PRODUCTS, JSON.stringify(generated));
  } catch {
    // ignore
  }

  return generated;
}

const products: Product[] = loadProducts();

const LS_KEY = 'mock_cart_storage';

const loadCart = (): Record<number, number> => {
  try {
    const stored = localStorage.getItem(LS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

let cart: Record<number, number> = loadCart();

const saveCart = () => {
  localStorage.setItem(LS_KEY, JSON.stringify(cart));
};

function computeCart() {
  const detailedCart = Object.entries(cart)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, quantity]) => quantity > 0)
    .map(([productId, quantity]) => {
      const product = products.find((p) => p.id === parseInt(productId, 10))!;
      return {
        product,
        quantity,
      };
    });
  const totalPrice = detailedCart.reduce((acc, { product, quantity }) => acc + product.price * quantity, 0);
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

    // Read the URL query parameters
    const searchQuery = url.searchParams.get('q');
    const category = url.searchParams.get('category');
    const sortBy = url.searchParams.get('sortBy') || '';
    const minPrice = url.searchParams.get('minPrice');
    const maxPrice = url.searchParams.get('maxPrice');
    const page = url.searchParams.get('page') || '0';
    const limit = url.searchParams.get('limit') || '10';

    let filteredProducts = products.filter((product) => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      if (category && product.category !== category) {
        return false;
      }
      if (minPrice && product.price < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && product.price > parseFloat(maxPrice)) {
        return false;
      }
      return true;
    });

    // Apply sorting
    if (sortBy) {
      filteredProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'name-asc':
            return a.name.localeCompare(b.name);
          case 'name-desc':
            return b.name.localeCompare(a.name);
          default:
            return 0;
        }
      });
    }

    const realPage = parseInt(page, 10) || 0;
    const realLimit = parseInt(limit, 10) || 10;
    const pageList = filteredProducts
      .slice(realPage * realLimit, (realPage + 1) * realLimit)
      .map((product) => ({
        ...product,
        itemInCart: cart[product.id] || 0,
      }));

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
    saveCart();
    return computeCart();
  }),
  http.get('/cart', async () => {
    await delay();
    return computeCart();
  }),
  http.post('/orders', async () => {
    await delay(1500);

    cart = {};
    saveCart();

    return new HttpResponse(undefined, Math.random() > 0.5 ? { status: 200 } : { status: 500 });
  }),
];
