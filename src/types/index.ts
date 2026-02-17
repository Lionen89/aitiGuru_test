export interface Product {
  id: number;
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
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: {
    createdAt: string;
    updatedAt: string;
    barcode: string;
    qrCode: string;
  };
  tags: string[];
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  token: string;
  expiresIn: number;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: LoginResponse | null;
  token: string | null;
  rememberMe: boolean;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface SortConfig {
  key: keyof Product;
  direction: 'asc' | 'desc';
}

export interface AddProductRequest {
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
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface AddProductFormData {
  title: string;
  price: number;
  brand: string;
  sku: string;
  description?: string;
  category?: string;
  stock?: number;
  rating?: number;
  weight?: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface ContextMenuState {
  mouseX: number;
  mouseY: number;
  product: Product | null;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

export interface ActionHandlers {
  handleEditProduct: (product: Product) => void;
  handleDeleteProduct: (product: Product) => void;
  handleDuplicateProduct: (product: Product) => void;
}