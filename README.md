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
1. Implement **infinite scroll** pagination (load more products as user scrolls) x 
2. Refactor the `Products` component for better maintainability x
3. Add proper loading states x TODO: add loading while debounce 
4. Fix the missing `key` prop warning (hint: check Grid vs Card placement) x
5. Handle edge cases (empty states, API errors) TODO

**Evaluation Focus**: 
- Clean component architecture
- Proper React hooks usage
- User experience during loading

**Completion** 

I implemented infinite scroll without external libs (would use Tanstack Query), it manually checks user scrolls and request subsequent pages of data. Loading and erros are properly handled. 

I used double variables for loading and allDataFetched flags, one with state and one with refs. (first is used for rendering, second for event listeners logic)
note: using refs when working with event listeners as they operate outside of react cycle

I decided to split products and cart into two separate features. It sounds like a good idea as for separation of concerns, as well as for future features (multistep cart).

I decided to use context for cart, as it should be global and either way connected in highest layer (app).

---

### Challenge #2: Advanced Search & Filtering ⭐⭐

**Context**: The UI has a search bar and category sidebar, but neither is functional.

**Your Tasks**:
1. Implement **real-time search** that filters products as user types x
2. Connect category buttons to filter products x
3. Allow **combining** search + category filters x
4. Add debouncing to search input (performance optimization) x
5. Update URL query parameters to make filters shareable x
6. Add a "Clear Filters" option x
7. Show active filter indicators x

**Bonus**:
- Add price range filter x
- Add sorting options (price low-to-high, name A-Z, etc.) 
- Show result count x

**Evaluation Focus**:
- State management strategy
- Performance optimization (debouncing, unnecessary re-renders)
- UX polish

**Completion** 
I moved categories and search inside the shop page, because they belong specifically there and to avoid creating more context for them. (locallity)

Search and Categories features could be implemented with Generics to apply to any type of data and moved to a separate feature. (more reusable, but less customizable). But I decided to make it domain-specific (products) and make it part of product logic for better customization in future. 

I implemented categories with a functional approach. I keep a set of all selected categories, which is used for sorting products needed to display. Then, I filter products through search first and use the resulting products array to filter by category. This allows combined search + category and any other potential filtering features together.

Added slider for price range + made it work with urls 
---

### Challenge #3: Performance Optimization ⭐⭐⭐

**Context**: The product list has serious performance issues:
- Each product renders a `HeavyComponent` (simulating slow components)
- Cart updates are sluggish
- Backend has 1000ms latency (realistic for slow APIs)

**Your Tasks**:
1. **Fix the rendering performance** (hint: memoization, virtualization)
   - ⚠️ Do NOT remove `HeavyComponent`—optimize around it
2. **Fix the cart update bug** (line 59: stale closure issue) x
3. Implement **optimistic UI updates** for add/remove cart actions x
4. Prevent unnecessary re-renders x
5. **Provide proof** of performance improvements (screenshots, metrics, profiler data) TODO 

**Bonus**:
- Implement virtual scrolling for large product lists
- Add request cancellation for outdated searches

**Evaluation Focus**:
- Understanding of React rendering behavior
- Profiling and measurement skills
- Real-world performance optimization techniques

**Completion** 
Split ShopPage into 3 parts - searchBar, Categories and ProductList. This allows them to memoize more precisely. 

Created custom memo for ProductList as it uses references (arrays) to improve performance. 
Added optimistic updates for ProductCard and Cart. 
Change addToCard to use product instead of productID so we can use in optimistic updates (save snapshot of state)

Before
![alt text](image-1.png)

After
![alt text](image.png)
Rendering cost dropped ~25–30%


---

### Challenge #4: Multi-Step Checkout Flow ⭐⭐⭐

**Context**: Not implemented yet. Build a complete checkout experience.

**Your Tasks**:

Build a **4-step checkout wizard**:

**Step 1: Cart Review**
- Display cart items with quantities x
- Show subtotal, tax (calculate as 10%), and total x
- Allow editing quantities or removing items x
- Show empty cart state x

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

**Completion** 
Tell about how i made stepper!!

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

Gleb Vassyutinskiy 🚀

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
