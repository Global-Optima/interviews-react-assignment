import { Box, CssBaseline } from "@mui/material";
import { Categories } from "./Categories.tsx";
import { Products } from "./pages/shop/shop-page.tsx";
import SearchAppBar from "./SearchAppBar.tsx";

function App() {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <SearchAppBar

      /> 
      <Box flex={1} display="flex" flexDirection="row">
        <Categories />
        <Box flex={1}>
          <Products />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
