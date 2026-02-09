import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Public, Notifications, Message, FilterList, Logout } from '@mui/icons-material';
import { logout } from '../store/authSlice';
import ProductList from '../components/Products/ProductList';
import AddProductForm from '../components/Products/AddProductForm';
import type { Product } from '../types';

const ProductsPage: React.FC = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  
  const handleAddProductSuccess = (product: Product) => {
    console.log('Продукт успешно добавлен:', product);
  };
  
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  return (
    <>
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Панель управления продуктами
          </Typography>
          
          <IconButton color="inherit" aria-label="planet">
            <Public />
          </IconButton>
          
          <IconButton color="inherit" aria-label="notifications">
            <Notifications />
          </IconButton>
          
          <IconButton color="inherit" aria-label="messages">
            <Message />
          </IconButton>
          
          <IconButton color="inherit" aria-label="filters">
            <FilterList />
          </IconButton>
          
          <Button
            color="inherit"
            onClick={handleMenuOpen}
            aria-controls={open ? 'profile-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            sx={{ ml: 2 }}
          >
            {auth.user?.firstName || 'Профиль'}
          </Button>
          
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              'aria-labelledby': 'profile-button',
            }}
          >
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 1 }} />
              Выйти
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <ProductList 
        onAddProductClick={() => setShowAddProduct(true)} 
      />
      <AddProductForm 
        open={showAddProduct} 
        onClose={() => setShowAddProduct(false)} 
        onSuccess={handleAddProductSuccess} 
      />
    </>
  );
};

export default ProductsPage;