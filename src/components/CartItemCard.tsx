import { memo } from 'react'
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Card,
  CardContent,
  Avatar,
  useTheme,
} from '@mui/material'
import { Delete, Add, Remove } from '@mui/icons-material'
import { useCart } from '@/context/CartContext'
import type { CartItem } from '@/types'

interface CartItemCardProps {
  item: CartItem
}

export const CartItemCard = memo(function CartItemCard({ item }: CartItemCardProps) {
  const theme = useTheme()
  const { updateQuantity, removeItem } = useCart()

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(item.product.id)
    } else {
      updateQuantity(item.product.id, newQuantity)
    }
  }

  return (
    <Card
      sx={{
        mb: 2,
        '&:last-child': { mb: 0 },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Avatar
            src={item.product.image}
            alt={item.product.title}
            variant="rounded"
            sx={{
              width: 64,
              height: 64,
              objectFit: 'contain',
              flexShrink: 0,
              backgroundColor: theme.palette.gray[100],
            }}
          />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
              {item.product.title}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {item.product.category}
            </Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              ${item.product.price.toFixed(2)}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity - 1)}
            >
              <Remove />
            </IconButton>
            <TextField
              value={item.quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10)
                if (!isNaN(val)) {
                  handleQuantityChange(val)
                }
              }}
              inputProps={{
                style: { textAlign: 'center', width: 50 },
                min: 1,
                type: 'number',
              }}
              size="small"
            />
            <IconButton
              size="small"
              onClick={() => handleQuantityChange(item.quantity + 1)}
            >
              <Add />
            </IconButton>
            <IconButton
              color="error"
              onClick={() => removeItem(item.product.id)}
              sx={{ ml: 1 }}
            >
              <Delete />
            </IconButton>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
})


