import { AppBar, Toolbar, Typography, IconButton, Badge, Avatar, Box } from '@mui/material'
import { ShoppingCart, Brightness4, Brightness7 } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useTheme } from '@/context/ThemeContext'

export function Header() {
  const navigate = useNavigate()
  const { getTotalItems } = useCart()
  const { mode, toggleTheme } = useTheme()
  const totalItems = getTotalItems()

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        color: 'text.primary',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: 64,
      }}
    >
      <Toolbar
        sx={{
          maxWidth: 1360,
          width: '100%',
          mx: 'auto',
          px: 3,
          justifyContent: 'space-between',
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{ fontWeight: 600, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Shop CRM
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
            sx={{ color: 'text.primary' }}
            aria-label="toggle theme"
          >
            {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
          <IconButton
            color="inherit"
            onClick={() => navigate('/cart')}
            sx={{ color: 'text.primary' }}
          >
            <Badge badgeContent={totalItems} color="secondary">
              <ShoppingCart />
            </Badge>
          </IconButton>
          <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>U</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}


