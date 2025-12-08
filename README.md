## How to Run and my name

gassyrdaulet 🚀

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

## Which challenges I completed:
Challenge #1: Product List with Infinite Scroll ⭐
Challenge #2: Advanced Search & Filtering ⭐⭐

## Key decisions and trade-offs
1st challenge: 
   For infinite scrolling an useInfinteSCroll hook was created which works with IntersectionObserver.
   Product component was refactored (using sx over style, center loader) and separated to another file.
   Missing key problem was solved just by passing the unique product id value to the "key" prop. If fetching products fails, then we show him the error text and retry button. I think that helps the user experience a lot.

2nd challenge:
   Had to do some separatings, for the code to be more readable. 
   Search and category filtering was added.
   Special hook useDebounce was created to make a delay between searches.
   Chips were used to show which filter is active. They also have button to remove them.

## How to test my features
Fetching products fails:
   Uncomment the block in onLoadMore function for it to randomly throw errors and try to fetch again.
Clear filter functionality:
   To see clear filter functionality simply select some category and type something in search input.
 

## Some asumptions made by me