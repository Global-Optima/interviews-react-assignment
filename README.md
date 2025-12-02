<!--
Hi! We're happy you opened this file, not everyone does!
To let us know you did, add a 🚀 emoji next to your name 
in the How to Run section 😊 
These will be extra points for you!
-->

# React Developer Interview Assignment

## Introduction

This is a technical interview exercise for **Gotech**'s Engineering team. In the following sections, you will find a number of challenges that test your React, TypeScript, and frontend development skills. You **DO NOT need to complete 100% of them**: choose the challenges that best demonstrate your expertise and complete them to a high standard.

⏱️ You have **1 week** to submit your solution. We understand you have other commitments, so work at your own pace. We evaluate based on **code quality, architecture, and problem-solving approach**, not speed.

### Deliverables

Fork this repository and treat it as a real-world project. We'll review your work in one week.

### Evaluation Criteria

Your submission will be assessed on:

* **Code Quality** - Clean, readable, maintainable code
* **Architecture & Design Patterns** - Proper separation of concerns, reusable components
* **Performance Optimization** - Efficient rendering, proper memoization
* **TypeScript Usage** - Strong typing, proper interfaces
* **Project Structure** - Logical organization, scalability
* **Git Workflow** - Meaningful commits, branch strategy
* **Testing** (bonus) - Unit tests, integration tests
* **Documentation** - Clear README, code comments where needed

#### Using AI Tools:

We encourage modern development practices, including AI-assisted coding tools (GitHub Copilot, ChatGPT, etc.). However, **you must understand every line of code you submit**. During the technical interview, you'll be asked to explain your decisions, trade-offs, and implementation details. Use AI as a productivity tool, but ensure the solutions reflect your expertise.

### Let's Get Started

Some challenges may be unfamiliar—that's intentional. Pick challenges that match your skill level and complete them thoroughly. We value quality over quantity.

⚠️ **Important**: Requirements are intentionally broad to give you creative freedom. Document your assumptions, decisions, and trade-offs. In a real-world scenario, what questions would you ask stakeholders?

---   

## Problem Domain

Build a web application for **TechHub**, gotech's consumer electronics e-commerce platform. Users can browse tech products (laptops, smartphones, accessories, etc.), filter by category, add items to cart, and complete checkout.

**Scope**: Focus on the **customer-facing** application only (no admin panel needed).

**Simplifications**: 
- No authentication required (single user)
- No real payment processing
- Single page application (SPA) is acceptable

---

## Challenges

### Challenge #1: Product List with Infinite Scroll ⭐

**Context**: A junior developer started building the product listing page but couldn't implement proper pagination. Currently, the app fetches ALL products at once (`limit=200`), which won't scale.

**Your Tasks**:
1. Implement **infinite scroll** pagination (load more products as user scrolls)
2. Refactor the `Products` component for better maintainability
3. Add proper loading states
4. Fix the missing `key` prop warning (hint: check Grid vs Card placement)
5. Handle edge cases (empty states, API errors)

**Evaluation Focus**: 
- Clean component architecture
- Proper React hooks usage
- User experience during loading

---

### Challenge #2: Advanced Search & Filtering ⭐⭐

**Context**: The UI has a search bar and category sidebar, but neither is functional.

**Your Tasks**:
1. Implement **real-time search** that filters products as user types
2. Connect category buttons to filter products
3. Allow **combining** search + category filters
4. Add debouncing to search input (performance optimization)
5. Update URL query parameters to make filters shareable
6. Add a "Clear Filters" option
7. Show active filter indicators

**Bonus**:
- Add price range filter
- Add sorting options (price low-to-high, name A-Z, etc.)
- Show result count

**Evaluation Focus**:
- State management strategy
- Performance optimization (debouncing, unnecessary re-renders)
- UX polish

---

### Challenge #3: Performance Optimization ⭐⭐⭐

**Context**: The product list has serious performance issues:
- Each product renders a `HeavyComponent` (simulating slow components)
- Cart updates are sluggish
- Backend has 1000ms latency (realistic for slow APIs)

**Your Tasks**:
1. **Fix the rendering performance** (hint: memoization, virtualization)
   - ⚠️ Do NOT remove `HeavyComponent`—optimize around it
2. **Fix the cart update bug** (line 59: stale closure issue)
3. Implement **optimistic UI updates** for add/remove cart actions
4. Prevent unnecessary re-renders
5. **Provide proof** of performance improvements (screenshots, metrics, profiler data)

**Bonus**:
- Implement virtual scrolling for large product lists
- Add request cancellation for outdated searches

**Evaluation Focus**:
- Understanding of React rendering behavior
- Profiling and measurement skills
- Real-world performance optimization techniques

---

### Challenge #4: Multi-Step Checkout Flow ⭐⭐⭐

**Context**: Not implemented yet. Build a complete checkout experience.

**Your Tasks**:

Build a **4-step checkout wizard**:

**Step 1: Cart Review**
- Display cart items with quantities
- Show subtotal, tax (calculate as 10%), and total
- Allow editing quantities or removing items
- Show empty cart state

**Step 2: Shipping Details**
- Form: Full name, address, city, postal code, phone
- Delivery time slot selection (Morning, Afternoon, Evening)
- Form validation with proper error messages
- Save to local storage (persist on refresh)

**Step 3: Payment Method**
- Radio selection: Credit Card, PayPal, Cash on Delivery
- If Credit Card: show card number, expiry, CVV inputs (validation only, no real processing)
- If PayPal: show mock redirect message
- Visual payment method icons

**Step 4: Order Confirmation**
- Summary of: items, shipping address, payment method, total
- "Place Order" button (calls `/orders` endpoint)
- Handle success/failure (backend has 50% failure rate)
- On success: clear cart, show confirmation message
- On failure: show error, allow retry

**Requirements**:
- Progress indicator showing current step
- Back/Next navigation
- Validate each step before proceeding
- Responsive design
- Accessibility (keyboard navigation, ARIA labels)

**Bonus**:
- Animate step transitions
- Add order tracking number on success
- Email preview/summary

**Evaluation Focus**:
- Form management (controlled vs uncontrolled)
- State management across steps
- Validation strategy
- UX and accessibility
- Error handling

---

## Technical Stack

The project uses:
- **React 18** + **TypeScript**
- **Material-UI (MUI)** v5
- **Vite** (build tool)
- **MSW** (Mock Service Worker) for API mocking
- **pnpm** (package manager)

## API Endpoints (Mocked)

All endpoints are mocked with MSW:

- `GET /products?q=search&category=Laptops&page=0&limit=10` - Fetch products
- `POST /cart` - Add/remove items (1000ms delay)
- `GET /cart` - Get current cart
- `POST /orders` - Submit order (50% random success/failure)

## How to Run

<!-- Add your name and 🚀 emoji here if you read the hidden message! -->
**Akylbek 🚀**

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Lint
pnpm lint
```

---

## Completed Challenges

### ✅ Challenge #1: Product List with Infinite Scroll ⭐

**Реализованные функции:**

1. **Бесконечная прокрутка (Infinite Scroll)**
   - Загрузка товаров порциями по 20 элементов
   - Автоматическая подгрузка при приближении к концу списка (за 200px)
   - Использован `useRef` для отслеживания элемента прокрутки
   - Предотвращение дублирования запросов через `loadingRef`

2. **Рефакторинг компонента Products**
   - Добавлено управление состоянием: `page`, `hasMore`, `isLoading`, `error`
   - Использованы хуки: `useCallback` для оптимизации функций
   - Вынесена логика загрузки в отдельную функцию `loadProducts`
   - Правильное разделение ответственности компонента

3. **Состояния загрузки**
   - Индикатор загрузки первой страницы
   - Индикатор подгрузки следующих страниц внизу списка
   - Состояние загрузки для каждого товара при добавлении в корзину
   - Сообщение "Все товары загружены" при достижении конца

4. **Исправлен key prop warning**
   - `key={product.id}` перемещен с `<Card>` на `<Grid item>`
   - Это соответствует best practices React - key должен быть на верхнем элементе при map()

5. **Обработка крайних случаев**
   - **Пустое состояние**: Сообщение "Товары не найдены" при пустом списке
   - **Ошибки API**: Alert компонент с возможностью закрытия
   - **Ошибки сети**: Обработка ошибок fetch с откатом loading состояния
   - **Блокировка кнопок**: Кнопка "минус" отключена при нулевом количестве

6. **Исправлена критическая ошибка stale closure (line 59)**
   - Заменено `setProducts(products.map(...))` на `setProducts(prev => prev.map(...))`
   - Использовано функциональное обновление состояния для корректной работы с актуальным состоянием
   - Это исправляет баг с неправильным обновлением корзины

**Технические решения:**

- **Scroll detection**: Обработчик `scroll` события с порогом 200px для плавной подгрузки
- **Performance**: `useCallback` для предотвращения пересоздания функций
- **State management**: Централизованное управление состоянием пагинации
- **Error handling**: Graceful degradation при ошибках API
- **TypeScript**: Строгая типизация всех состояний и функций
- **Accessibility**: Добавлены aria-labels для кнопок на русском языке
- **Responsive**: Grid адаптируется под разные размеры экранов (xs=12, sm=6, md=4)

**Тестирование:**

1. Откройте http://localhost:5173
2. Прокрутите страницу вниз - новые товары должны подгружаться автоматически
3. Проверьте добавление/удаление товаров из корзины
4. Убедитесь, что индикаторы загрузки работают корректно
5. Проверьте работу при медленном интернете (Network throttling в DevTools)

**Допущения:**

- Размер страницы установлен в 20 товаров для баланса производительности и UX
- Порог подгрузки (200px) подобран эмпирически для комфортного восприятия
- Используется нативный scroll вместо виртуализации на данном этапе

## Submission Guidelines

1. **Fork** this repository
2. Create a new branch: `solution/your-name`
3. Commit regularly with clear messages
4. Update this README with:
   - Your name
   - Which challenges you completed
   - Key decisions and trade-offs
   - How to test your features
   - Any assumptions made
5. **Submit a Pull Request** to the original repo

---

## Notes

- Focus on **code quality** over completing all challenges
- **Document your decisions** in code comments or this README
- If you skip a challenge, briefly explain why
- Treat this like production code you'd ship to real users

**Questions?** In a real scenario, you'd ask your team lead. For this assignment, document your assumptions and move forward.

Good luck! 🚀
