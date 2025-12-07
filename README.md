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

## Key decisions and trade-offs
1st challenge: 
   For infinite scrolling an useInfinteSCroll hook was created which works with IntersectionObserver.
   Product component was refactored (using sx over style, center loader) and separated to another file.
   Missing key problem was solved just by passing the unique product id value to the "key" prop. If fetching products fails, then we show him the error text and retry button. I think that helps the user experience a lot.

## How to test my features
Fetching products fails:
   Uncomment the block in onLoadMore function for it to randomly throw errors and try to fetch again.
 

## Some asumptions made by me