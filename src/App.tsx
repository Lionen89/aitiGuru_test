import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppSelector } from './store';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const auth = useAppSelector(state => state.auth);

  return (
    <Router>
        <Routes>
          <Route path="/login" element={
            auth.isAuthenticated ? <Navigate to="/products" replace /> : <LoginPage />
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to={auth.isAuthenticated ? "/products" : "/login"} replace />} />
        </Routes>
    </Router>
  );
}

export default App;
