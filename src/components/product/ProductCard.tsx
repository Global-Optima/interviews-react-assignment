import { memo } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { HeavyComponent } from './HeavyComponent.tsx';
import { Product } from '../../types/types.ts';
import { AddToCart } from '../../hooks/useCart.ts';

export const ProductCard = memo(
  ({ product, addToCart }: { product: Product; addToCart: AddToCart }) => (
    <Box p={1}>
      {/* Do not remove this */}
      <HeavyComponent />

      <Card key={product.id} style={{ width: '100%' }}>
        <CardMedia component='img' height='150' image={product.imageUrl} />
        <CardContent>
          <Typography gutterBottom variant='h6' component='div'>
            {product.name}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          </Typography>
        </CardContent>

        <CardActions>
          <Typography variant='h6' component='div'>
            ${product.price}
          </Typography>
          <Box flexGrow={1} />
          <Box
            position='relative'
            display='flex'
            flexDirection='row'
            alignItems='center'
          >
            <Box
              position='absolute'
              left={0}
              right={0}
              top={0}
              bottom={0}
              textAlign='center'
            >
              {product.loading && <CircularProgress size={20} />}
            </Box>
            <IconButton
              disabled={product.loading}
              aria-label='delete'
              size='small'
              onClick={() => addToCart(product.id, -1)}
            >
              <RemoveIcon fontSize='small' />
            </IconButton>

            <Typography variant='body1' component='div' mx={1}>
              {product.itemInCart || 0}
            </Typography>

            <IconButton
              disabled={product.loading}
              aria-label='add'
              size='small'
              onClick={() => addToCart(product.id, 1)}
            >
              <AddIcon fontSize='small' />
            </IconButton>
          </Box>
        </CardActions>
      </Card>
    </Box>
  )
);
