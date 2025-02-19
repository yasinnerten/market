import axios from 'axios'
import type { 
  User,
  Product,
  ApiResponse,
  ApiError,
  LoginInput,
  RegisterInput,
  Category,
  Banner,
  Order,
  Analytics,
  AuthResponse
} from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorResponse = error.response?.data as ApiError
    return Promise.reject(errorResponse || error)
  }
)

export const endpoints = {
  auth: {
    login: (data: LoginInput) => 
      api.post<AuthResponse>('/auth/login', data),
    register: (data: RegisterInput) => 
      api.post<AuthResponse>('/auth/register', data),
    logout: () => {
      localStorage.removeItem('token');
      return api.post('/auth/logout');
    },
    me: () => api.get<ApiResponse<User>>('/auth/me'),
  },

  products: {
    getAll: () =>
      api.get<ApiResponse<Product[]>>('/products'),
    getCategories: () => api.get<ApiResponse<Category[]>>('/categories'),
    getOne: (id: number) =>
      api.get<ApiResponse<Product>>(`/products/${id}`),
    create: (data: FormData) =>
      api.post<ApiResponse<Product>>('/products', data),
    update: (id: number, data: FormData) =>
      api.put<ApiResponse<Product>>(`/products/${id}`, data),
    delete: (id: number) =>
      api.delete<ApiResponse<void>>(`/products/${id}`),
    uploadImage: (productId: number, imageFile: File) => {
      const formData = new FormData()
      formData.append('image', imageFile)
      return api.post<ApiResponse<string>>(`/products/${productId}/upload-image`, formData)
    }
  },

  wishlist: {
    getAll: () => api.get<ApiResponse<Product[]>>('/wishlist'),
    add: (productId: number) => api.post<ApiResponse<void>>('/wishlist', { productId }),
    remove: (productId: number) => api.delete<ApiResponse<void>>(`/wishlist/${productId}`),
  },

  banners: {
    getActive: () => api.get<ApiResponse<Banner>>('/banners/active'),
    getAll: () => api.get<ApiResponse<Banner[]>>('/admin/banners'),
  },

  admin: {
    getAboutContent: () => api.get<ApiResponse<string>>('/admin/about'),
    updateAboutContent: (content: string) => api.put<ApiResponse<void>>('/admin/about', { content }),
    getOrders: () => api.get<ApiResponse<Order[]>>('/admin/orders'),
    updateOrderStatus: (orderId: number, status: string) => 
      api.put<ApiResponse<void>>(`/admin/orders/${orderId}/status`, { status }),
    getAnalytics: () => api.get<ApiResponse<Analytics>>('/admin/analytics'),
  },
}

export default api

