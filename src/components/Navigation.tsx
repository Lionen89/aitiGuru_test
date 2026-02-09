import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';

const Navigation: React.FC = () => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
      <Button 
        component={Link} 
        to="/login" 
        variant="outlined"
      >
        Login Page
      </Button>
      <Button 
        component={Link} 
        to="/products" 
        variant="outlined"
      >
        Products Page
      </Button>
    </Box>
  );
};

export default Navigation;