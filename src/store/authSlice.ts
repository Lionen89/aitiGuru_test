import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../types';


const getInitialAuthState = (): AuthState => {
  const storedRememberMe = localStorage.getItem('rememberMe');
  const token = storedRememberMe === 'true' 
    ? localStorage.getItem('authToken') 
    : sessionStorage.getItem('authToken');
  
  if (token) {
    try {

      return {
        isAuthenticated: true,
        user: JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null'),
        token,
        rememberMe: storedRememberMe === 'true',
      };
    } catch (error) {

      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    }
  }
  
  return {
    isAuthenticated: false,
    user: null,
    token: null,
    rememberMe: false,
  };
};

const initialState: AuthState = getInitialAuthState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: any; token: string; rememberMe: boolean }>) => {
      const { user, token, rememberMe } = action.payload;
      
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      state.rememberMe = rememberMe;
      

      if (rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rememberMe', 'true');

        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user');
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('rememberMe', 'false');

        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.rememberMe = false;
      

      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    },
    loginFailure: (state) => {

      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.rememberMe = false;
    },
  },
});


export const { loginSuccess, logout, loginFailure } = authSlice.actions;


export default authSlice.reducer;