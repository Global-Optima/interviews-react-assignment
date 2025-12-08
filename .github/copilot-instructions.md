# GitHub Copilot Instructions for TechHub React Interview Assignment

## Project Overview

This is a React 18 + TypeScript e-commerce interview assignment simulating a consumer electronics store. The codebase intentionally contains performance issues, incomplete features, and bugs to be solved as challenges. **Do not "fix" everything automatically** - respect that some issues are deliberate learning opportunities.

## Architecture & Key Concepts

### Mock API Architecture (MSW)
- All API calls are intercepted by Mock Service Worker (MSW v2)
- MSW worker initializes in `src/mocks/browser.ts` before React renders (`src/main.tsx`)
- API handlers in `src/mocks/handlers.ts` simulate realistic delays (1000ms for cart, 1500ms for orders)
- Backend intentionally simulates failure scenarios (orders have 50% failure rate)
- No real backend - all data stored in-memory in handlers

### State Management Pattern
- Currently uses local component state (`useState`) - candidates may refactor to Context/Redux
- Cart state flows from `Products.tsx` → `App.tsx` → `SearchAppBar.tsx` via callback pattern
- Known issue: **Stale closure bug in line 59 of `Products.tsx`** - `addToCart` captures old `products` state
- Cart updates must be optimistic (update UI immediately, rollback on failure)

### Component Structure
```
App.tsx (layout orchestrator)
├── SearchAppBar.tsx (header with search + cart summary) - Search NOT functional
├── Categories.tsx (sidebar filters) - Filters NOT functional  
└── Products.tsx (main product grid)
    └── HeavyComponent.tsx (performance bottleneck - DO NOT REMOVE)
```

### Performance Bottlenecks (Intentional)
1. **HeavyComponent** - Blocks rendering for 2ms per product. Must be optimized via memoization/virtualization, NOT removed
2. **No pagination** - Currently fetches `limit=200` products at once
3. **No debouncing** - Search will trigger requests on every keystroke
4. **Stale closure bug** - Cart updates reference old state causing incorrect quantities

## Development Workflows

### Commands
```bash
pnpm dev          # Start dev server (Vite on port 5173)
pnpm build        # TypeScript check + production build
pnpm lint         # ESLint with strict rules (max-warnings 0)
pnpm preview      # Preview production build
```

### Running the App
1. MSW worker must initialize first (see `main.tsx`) - dev server will fail without MSW
2. Check browser console for MSW activation message: `[MSW] Mocking enabled`
3. No backend server needed - everything mocked in-browser

### TypeScript Configuration
- Strict mode enabled (`strict: true`)
- No unused locals/parameters allowed
- All `src/**/*.tsx` files must have explicit types
- Import paths use `.tsx` extensions due to `allowImportingTsExtensions`

## API Contracts (Mocked)

### GET /products
```typescript
// Query params: q (search), category, page, limit
// Returns: { products: Product[], total: number, hasMore: boolean }
```

### POST /cart
```typescript
// Body: { productId: number, quantity: number }
// Delay: 1000ms
// Returns: { items: CartItem[], totalPrice: number, totalItems: number }
```

### POST /orders
```typescript
// Delay: 1500ms
// Random success/failure (50% each)
// On success: Clears cart state in handlers.ts
```

## Code Conventions

### Material-UI (MUI) Usage
- Use `Box` with flex layout props (not CSS classes): `<Box display="flex" flexDirection="row">`
- Icons from `@mui/icons-material` (already includes `AddIcon`, `RemoveIcon`, `ShoppingCartIcon`)
- Emotion styled components available via `@emotion/styled`
- Always import from `@mui/material` or `@mui/icons-material`

### Component Patterns
- Functional components only (no class components)
- Props typing: Use explicit inline types or interfaces, e.g., `({ onCartChange }: { onCartChange: (cart: Cart) => void })`
- Export types when shared: `export type Product = { ... }` (see `Products.tsx`)
- Async operations: Use `fetch` with `.then()` (existing pattern) or refactor to `async/await`

### State Updates
- When updating cart: Always show loading state via `product.loading` flag
- Disable buttons during async operations to prevent double-clicks
- Use spread operators for immutable updates: `products.map(p => p.id === id ? { ...p, loading: true } : p)`

## Challenge-Specific Guidance

### Challenge #1: Infinite Scroll
- Must implement pagination using `page` and `limit` query params
- Detect scroll position in `Products.tsx` scrollable `<Box overflow="scroll">`
- Append new products to existing array (not replace)
- Fix React key warning: Key prop should be on `<Grid item>`, not `<Card>`

### Challenge #2: Search & Filtering
- Search input in `SearchAppBar.tsx` currently has no `onChange` handler
- Category buttons in `Categories.tsx` have no click handlers
- Must lift state to `App.tsx` or use Context to share search/category between components
- API supports combining filters: `/products?q=laptop&category=Gaming`
- Implement debouncing (300-500ms recommended) to avoid excessive API calls

### Challenge #3: Performance
- `HeavyComponent` must remain in render tree - wrap `Card` in `React.memo()` instead
- Use React DevTools Profiler to measure improvements
- Cart update bug (line 59): `setProducts(products.map(...))` uses stale `products` - use functional update: `setProducts(prev => prev.map(...))`
- Consider `useMemo` for filtered products, `useCallback` for event handlers
- Virtual scrolling: Look into `react-window` or `react-virtualized`

### Challenge #4: Multi-Step Checkout
- Not implemented - full creative freedom
- Must handle `/orders` endpoint's 50% failure rate with retry logic
- Cart is cleared on backend after successful order (see `handlers.ts`)
- Store form data in localStorage for persistence across refreshes
- Use MUI Stepper component for step indicator

## Common Pitfalls

1. **Don't remove MSW setup** - App won't work without it
2. **Don't remove HeavyComponent** - Performance challenge requires working around it
3. **Don't ignore intentional bugs** - Stale closure and missing keys are part of challenges
4. **Don't add real backend** - Everything must use MSW handlers
5. **Don't skip TypeScript types** - Strict mode enforced

## Testing Approach (Bonus)

- No test framework installed - candidates may add Jest/Vitest + React Testing Library
- Test MSW handlers by importing `handlers.ts` and using `http.get('/products').test()`
- Focus on: cart updates, search filtering, pagination logic, checkout form validation

## Assumptions & Decision Points

When implementing features, document these decisions:
- State management approach (local vs Context vs Redux)
- Scroll detection strategy (Intersection Observer vs scroll event)
- Form library choice for checkout (React Hook Form, Formik, or plain controlled inputs)
- Debounce implementation (custom hook vs lodash/use-debounce)
- Virtualization library selection (if applicable)

## Interview Focus Areas

Code reviews will emphasize:
1. **React rendering optimization** - Proper use of memo/useMemo/useCallback
2. **Type safety** - No `any` types, proper interfaces for all data
3. **Error handling** - Loading states, error states, retry logic
4. **Code organization** - Separation of concerns, reusable hooks
5. **Git history** - Meaningful commits showing iterative progress

## Resources

- [MSW v2 Docs](https://mswjs.io/docs/) - API mocking patterns
- [MUI v5 Components](https://mui.com/material-ui/) - Component library reference
- [React 18 Docs](https://react.dev/) - Hooks, performance, patterns
