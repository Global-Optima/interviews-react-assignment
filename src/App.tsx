import { Box, CssBaseline } from "@mui/material";
import { ShopPage } from "./pages/shop/shop-page.tsx";

function App() {
  return (
    <Box height="100vh" display="flex" flexDirection="column">
      <CssBaseline />
      <ShopPage />
    </Box>
  );
}

export default App;
