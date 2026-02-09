import axios from 'axios';
import type { LoginRequest, LoginResponse, ProductsResponse, Product } from '../types';

const API_BASE_URL = 'https://dummyjson.com';


const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});


api.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {

    return Promise.reject(error);
  }
);


export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/refresh', { refreshToken });
    return response.data;
  },


};


export const productsApi = {
  getProducts: async (limit: number = 20, skip: number = 0, search?: string): Promise<ProductsResponse> => {
    let url = `/products?limit=${limit}&skip=${skip}`;
    if (search) {
      url += `&q=${encodeURIComponent(search)}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  searchProducts: async (query: string, limit: number = 20, skip: number = 0): Promise<ProductsResponse> => {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`);
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },


  addProduct: async (productData: {
    title: string;
    description: string;
    price: number;
    discountPercentage: number;
    rating: number;
    stock: number;
    brand: string;
    category: string;
    thumbnail: string;
    images: string[];
    sku: string;
    weight: number;
  }): Promise<Product> => {

    await new Promise(resolve => setTimeout(resolve, 1000));
    

    const simulatedProduct: Product = {
      ...productData,
      id: Math.floor(Math.random() * 10000),
      returnPolicy: '30 days return policy',
      meta: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        barcode: `BAR${Math.floor(Math.random() * 1000000)}`,
        qrCode: `QR${Math.floor(Math.random() * 1000000)}`,
      },
      tags: ['general'],
      reviews: [],
      dimensions: {
        width: productData.dimensions?.width || 10,
        height: productData.dimensions?.height || 10,
        depth: productData.dimensions?.depth || 10,
      },
      minimumOrderQuantity: 1,
      warrantyInformation: '6 months warranty',
      shippingInformation: 'Ships in 2 business days',
      availabilityStatus: 'In Stock',
    };
    
    return simulatedProduct;
  },
};

export default api;