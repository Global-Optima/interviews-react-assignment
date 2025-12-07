import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from '@mui/material';
import { ShoppingCart, Delete } from '@mui/icons-material';

import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
} from '../../utils/utils';
import { AddToCart, RemoveFromCart } from '../../hooks/useCart';
import { Cart } from '../../types/types';

export function CartReview({
  cart,
  addToCart,
  removeFromCart,
}: {
  cart: Cart;
  addToCart: AddToCart;
  removeFromCart: RemoveFromCart;
}) {
  if (cart.items.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
        <Typography variant='h5' gutterBottom>
          Your cart is empty
        </Typography>
        <Typography color='text.secondary'>
          Add some items to get started
        </Typography>
      </Box>
    );
  }

  const subtotal = calculateSubtotal(cart);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(cart);

  return (
    <Box>
      <Typography variant='h5' gutterBottom sx={{ mb: 3 }}>
        Review Your Cart
      </Typography>
      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'grey.50' }}>
              <TableCell>Item</TableCell>
              <TableCell align='center'>Quantity</TableCell>
              <TableCell align='right'>Price</TableCell>
              <TableCell align='right'>Total</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cart.items.map((item) => (
              <TableRow key={item.id} hover>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      component='img'
                      src={item.imageUrl}
                      alt={item.name}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: 'cover',
                        borderRadius: 1,
                      }}
                    />
                    <Box>
                      <Typography sx={{ fontWeight: 'medium' }}>
                        {item.name}
                      </Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {item.category}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align='center'>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                    }}
                  >
                    <IconButton
                      disabled={item.loading}
                      aria-label='delete'
                      size='small'
                      onClick={() => addToCart(item.id, -1)}
                    >
                      <RemoveIcon fontSize='small' />
                    </IconButton>
                    <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                      {item.itemInCart}
                    </Typography>
                    <IconButton
                      disabled={item.loading}
                      aria-label='add'
                      size='small'
                      onClick={() => addToCart(item.id, 1)}
                    >
                      <AddIcon fontSize='small' />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align='right'>${item.price.toFixed(2)}</TableCell>
                <TableCell align='right' sx={{ fontWeight: 'medium' }}>
                  ${(item.price * item.itemInCart).toFixed(2)}
                </TableCell>
                <TableCell align='center'>
                  <IconButton
                    color='error'
                    onClick={() => removeFromCart(item.id)}
                    aria-label='remove item'
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Card sx={{ maxWidth: 400, ml: 'auto' }}>
        <CardContent>
          <Typography variant='h6' gutterBottom>
            Order Summary
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color='text.secondary'>Subtotal:</Typography>
            <Typography>${subtotal.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography color='text.secondary'>Tax (10%):</Typography>
            <Typography>${tax.toFixed(2)}</Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant='h6'>Total:</Typography>
            <Typography variant='h6'>${total.toFixed(2)}</Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
