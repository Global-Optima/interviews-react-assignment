# React Developer Interview Assignment Solution

## Anuarbekov Meir 🚀

### 🏆 Completed Challenges
| Challenge | Status | Details |
| :--- | :--- | :--- |
| **#1: Product List with Infinite Scroll** | ✅ | Implemented Intersection Observer for seamless loading. |
| **#2: Advanced Search & Filtering** | ✅ | Implemented debounced search, category filtering, URL synchronization, and filter indicators. |
| **#4: Multi-Step Checkout Flow** | ✅ | Fully implemented 4-step flow including form validation, local storage persistence, and order processing. |

---

## 🛠️ Key Architectural Decisions

### 1. Performance Optimization

* **Debouncing (`useDebounce` Hook):** The `searchTerm` is debounced by 500ms using a custom hook within `SearchAppBar.tsx`. This prevents unnecessary API calls and server load while the user is actively typing.
* **Memoization (`memo`, `useCallback`):**
    * `ProductItem` is wrapped in `React.memo` to prevent re-rendering of all product cards when only the `itemInCart` count of a single item changes, or when the overall `Products` list state is updated.
    * All shared callback functions (`onCartChange`, `handleCheckoutClick`, etc.) are wrapped in `useCallback` to ensure stable references and prevent unnecessary re-renders in child components.

### 2. Infinite Scroll and Filtering Integration

* **Filter Reset Logic:** A key decision in `Products.tsx` was to reset both `page` to `1` and clear the `products` array (`setProducts([])`) whenever `searchTerm` or `activeCategory` changes. This ensures that new filtered results always start from the top, avoiding the issue of appending new results to an irrelevant old list.
* **URL Synchronization:** Native browser APIs (`URLSearchParams` and `window.history.pushState`) were used in `App.tsx` to handle filter synchronization, making the filtered views shareable without requiring a third-party routing library.

### 3. Checkout Flow Design

* **Local Storage Persistence:** Shipping details are saved to `localStorage` in **Step 2**. This is critical for good UX, ensuring the user doesn't lose complex form data if they accidentally refresh the page or navigate away.
* **Controlled Form Components:** All checkout forms use controlled inputs, managed by local state within the respective step components.

---

## 🧪 How to Test Features

### General Setup
1.  Run `pnpm install` and `pnpm dev`.
2.  Open the application in your browser.

### 1. Infinite Scroll & Performance
* **Test:** Scroll down the page.
* **Expected:** Products should load in batches of 20 (based on `ITEMS_PER_PAGE` in `Products.tsx`) using the Intersection Observer. The spinner should appear briefly at the bottom.

### 2. Advanced Search & Filtering
* **Test Debouncing:** Open the Network tab in DevTools. Type a 5-letter word quickly into the search bar.
* **Expected:** Only one API call to `/products` should occur, approximately 500ms after you stop typing.
* **Test Combined Filters:**
    1.  Click the "Laptops" category.
    2.  Type "Mac" into the search bar.
    * **Expected:** Only products that are **both** in the "Laptops" category **AND** contain "Mac" in their name should appear.
* **Test URL Sync:** Apply a category filter and a search term.
    * **Expected:** The URL should update (e.g., `?q=Mac&category=Laptops`). If you refresh the page, the filters should remain applied.
* **Test Clear Filters:**
    1.  Apply both filters.
    2.  Click the "Clear All Filters" chip.
    * **Expected:** Both the search input and the category selection are cleared, the product list reloads, and the URL returns to the base path.

### 3. Multi-Step Checkout Flow
* **Test Step 1 (Cart Review):** Click the shopping cart icon.
    * **Expected:** The cart review screen shows subtotals, tax (10%), and the correct `Total Due`.
* **Test Step 2 (Validation & Persistence):**
    1.  Click "Next" without filling out the Shipping Form.
    2.  **Expected:** Validation errors appear for required fields.
    3.  Fill out the form partially and refresh the browser.
    4.  **Expected:** The saved form data should reappear from local storage.
* **Test Step 4 (Order Handling):**
    1.  On the Confirmation step, click "Place Order".
    2.  **Expected:** Approximately 50% of attempts will show "Success! Your order has been placed," and the cart is cleared (`totalItems: 0`).
    3.  The other 50% will show a failure alert with a "Retry" button.
       
# Thank you!
