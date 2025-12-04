import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  SelectChangeEvent,
  useTheme,
} from '@mui/material'
import { Close } from '@mui/icons-material'
import { useState } from 'react'
import type { Product } from '@/types'

interface ProductModalProps {
  open: boolean
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
}

export function ProductModal({ open, product, onClose, onAddToCart }: ProductModalProps) {
  const theme = useTheme()
  const [quantity, setQuantity] = useState(1)

  if (!product) return null

  const handleAddToCart = () => {
    onAddToCart(product, quantity)
    onClose()
    setQuantity(1)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3">{product.title}</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3 }}>
          <Box
            component="img"
            src={product.image}
            alt={product.title}
            sx={{
              width: '100%',
              maxWidth: '100%',
              height: 300,
              maxHeight: 300,
              objectFit: 'contain',
              objectPosition: 'center',
              borderRadius: 2,
              mb: 2,
              display: 'block',
              backgroundColor: theme.palette.gray[100],
              padding: 2,
            }}
          />
          <Typography variant="body1" sx={{ mb: 2 }}>
            {product.description}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
            ${product.price.toFixed(2)}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Quantity</InputLabel>
            <Select
              value={quantity}
              label="Quantity"
              onChange={(e: SelectChangeEvent<number>) =>
                setQuantity(Number(e.target.value))
              }
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleAddToCart} variant="contained">
          Add to cart
        </Button>
      </DialogActions>
    </Dialog>
  )
}


