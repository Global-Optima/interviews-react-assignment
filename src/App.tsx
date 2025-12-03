import { Products } from './Products.tsx';
import { Box, Container, Stack } from '@mui/material';
import SearchAppBar from './SearchAppBar.tsx';
import { Categories } from './Categories.tsx';
import { useCart } from './hooks/useCart.ts';

function App() {
  const { cart } = useCart();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      {/* Header */}
      <SearchAppBar quantity={cart?.totalItems || 0} price={cart?.totalPrice || 0} />
      
      {/* Main Content */}
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          py: 3,
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 2, md: 3 }}
          sx={{
            minHeight: 'calc(100vh - 80px)',
          }}
        >
          {/* Sidebar - Categories */}
          <Box
            sx={{
              width: { xs: '100%', md: 260 },
              flexShrink: 0,
            }}
          >
            <Categories />
          </Box>

          {/* Main Content - Products */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <Products />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
