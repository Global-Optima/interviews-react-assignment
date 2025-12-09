import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { Box, Divider, IconButton, Slider, Typography } from "@mui/material";
import { useCallback } from "react";
import { useCategories } from "../../features/products/hooks/use-categories";
import { useInfiniteProducts } from "../../features/products/hooks/use-infinite-products";
import { usePriceRange } from "../../features/products/hooks/use-price-range";
import { useProductSearch } from "../../features/products/hooks/use-product-search";
import { Categories } from "../../features/products/ui/Categories";
import { ProductList } from "../../features/products/ui/product-list";
import { ProductSearchBar } from "../../features/products/ui/product-search-bar";

const marks = [
  {
    value: 0,
    label: "$0",
  },
  {
    value: 2500,
    label: "$2,500",
  },
  {
    value: 5000,
    label: "$5,000",
  },
];

export const ShopPage = () => {
  const { products, loading, allFetched, elementRef } = useInfiniteProducts();
  const { searchValue, setSearchValue, searchedProducts } = useProductSearch({
    unsearchedProducts: products,
  });

  const {
    categories,
    toggleCategory,
    filteredProducts: categoryFilteredProducts,
    setCategories,
  } = useCategories({ unfilteredProducts: searchedProducts });

  const {
    priceRange,
    filteredProducts: priceFilteredProducts,
    handlePriceChange,
    setPriceRange,
  } = usePriceRange({
    products: categoryFilteredProducts,
    initialMin: 0,
    initialMax: 5000,
  });

  const handleResetPriceRange = () => {
    setPriceRange([0, 5000]);
  };

  const handleCategorySelect = useCallback(
    (selectedCategory: string) => toggleCategory(selectedCategory),
    [toggleCategory]
  );

  const handleCategoryClear = useCallback(
    () => setCategories([]),
    [setCategories]
  );

  return (
    <Box>
      <ProductSearchBar
        onSearchChange={setSearchValue}
        searchValue={searchValue}
      />
      <Box
        flex={1}
        display="flex"
        flexDirection="row"
        height="calc(100vh - 80px)"
      >
        <Categories
          categories={categories}
          onCategorySelect={handleCategorySelect}
          onCategoryClear={handleCategoryClear}
        />
        <Box flex={1} display="flex" flexDirection="column">
          <Box display="flex" gap={1} p={2}>
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width={200}
            >
              Total products: {priceFilteredProducts.length}
            </Box>
            <Divider orientation="vertical" />
            <Box
              width={400}
              display="flex"
              gap={3}
              justifyContent="center"
              alignItems="center"
            >
              <Typography>Price range:</Typography>
              <Slider
                getAriaLabel={() => "Price range"}
                min={0}
                max={5000}
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                marks={marks}
              />
              <IconButton
                style={{ marginBottom: 15 }}
                children={<RestartAltIcon />}
                onClick={handleResetPriceRange}
              ></IconButton>
            </Box>
          </Box>
          <Box
            flex={1}
            ref={elementRef}
            overflow="auto"
            sx={{
              paddingRight: 2,
            }}
          >
            <ProductList
              products={priceFilteredProducts}
              loading={loading}
              allFetched={allFetched}
              searchValue={searchValue}
              searchedProducts={searchedProducts}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
