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

function randomTechCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

// generate a rondom list of product with approriate library
const products: Product[] = names.map((name, index) => ({
  id: index,
  name: name,
  imageUrl: `https://via.nplaceholder.com/150?text=Product+${index}`,
  price: parseFloat((Math.random() * 2970 + 29).toFixed(2)), // $29 - $2999
  category: randomTechCategory(),
}));

let cart: Record<number, number> = {};

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
    const url = new URL(request.url);
    const searchQuery = url.searchParams.get('q');
    const category = url.searchParams.get('category');
    const page = url.searchParams.get('page') || '0';
    const limit = url.searchParams.get('limit') || '10';
    const sortBy = url.searchParams.get('sortBy');
    const sortOrder = url.searchParams.get('sortOrder') || 'asc';
    const minPrice = parseFloat(url.searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(url.searchParams.get('maxPrice') || 'Infinity');
    let filteredProducts = products.filter(product => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (category && product.category !== category) return false;
      if (product.price < minPrice || product.price > maxPrice) return false;
      return true;
    });
    if (sortBy === 'name') {
      filteredProducts.sort((a, b) => {
        const res = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? res : -res;
      });
    } else if (sortBy === 'price') {
      filteredProducts.sort((a, b) => {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      });
    }
    const realPage = parseInt(page, 10) || 0;
    const realLimit = parseInt(limit, 10) || 10;
    const pageList = filteredProducts.slice(realPage * realLimit, (realPage + 1) * realLimit);
    const maxPriceChange = filteredProducts.reduce((max, p) => Math.max(max, p.price), 0);
    return HttpResponse.json({
      products: pageList,
      total: filteredProducts.length,
      hasMore: realPage * realLimit + realLimit < filteredProducts.length,
      maxPriceChange
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
