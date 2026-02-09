import React, { Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const Login = React.lazy(() => import('../components/Login'));

const LoginPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      <Login />
    </Suspense>
  );
};

export default LoginPage;