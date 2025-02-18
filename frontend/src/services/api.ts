import axios from 'axios'
import type { 
  User,
  Product,
  Order,
  ApiResponse,
  Analytics,
  Banner,
  ProductQueryParams,
  ApiError,
  LoginInput,
  RegisterInput,
  CartItem,
  Category
} from '@/types'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
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
    login: (credentials: LoginInput) =>
      api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials),
    register: (data: RegisterInput) =>
      api.post<ApiResponse<{ token: string; user: User }>>('/auth/register', data),
    me: () => 
      api.get<ApiResponse<User>>('/auth/me')
  },

  products: {
    getAll: (params?: ProductQueryParams) =>
      api.get<ApiResponse<Product[]>>('/products', { params }),
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
      return api.post<ApiResponse<string>>(`/products/${productId}/image`, formData)
    },
    getAllCategories: () =>
      api.get<ApiResponse<Category[]>>('/products/categories'),
  },

  cart: {
    get: () => 
      api.get<ApiResponse<CartItem[]>>('/cart'),
    addItem: (productId: number, quantity: number) =>
      api.post<ApiResponse<CartItem>>('/cart', { productId, quantity }),
    updateQuantity: (productId: number, quantity: number) =>
      api.put<ApiResponse<CartItem>>(`/cart/${productId}`, { quantity }),
    removeItem: (productId: number) =>
      api.delete<ApiResponse<void>>(`/cart/${productId}`)
  },

  orders: {
    create: () =>
      api.post<ApiResponse<Order>>('/orders'),
    getAll: () => 
      api.get<ApiResponse<Order[]>>('/orders'),
    getOne: (id: number) => 
      api.get<ApiResponse<Order>>(`/orders/${id}`),
    cancel: (id: number) => 
      api.post<ApiResponse<void>>(`/orders/${id}/cancel`)
  },

  admin: {
    getAnalytics: () =>
      api.get<ApiResponse<Analytics>>('/admin/analytics'),
    getBanners: () =>
      api.get<ApiResponse<Banner[]>>('/admin/banners'),
    updateBanner: (id: number, data: Partial<Banner>) =>
      api.put<ApiResponse<Banner>>(`/admin/banners/${id}`, data),
    getOrders: () =>
      api.get<ApiResponse<Order[]>>('/admin/orders'),
    updateOrderStatus: (orderId: number, status: string) =>
      api.put<ApiResponse<Order>>(`/admin/orders/${orderId}/status`, { status }),
    getAboutContent: () =>
      api.get<ApiResponse<string>>('/admin/about'),
    updateAboutContent: (content: string) =>
      api.put<ApiResponse<void>>('/admin/about', { content }),
  },

  banners: {
    getActive: () =>
      api.get<ApiResponse<Banner>>('/banners/active'),
    getAll: () =>
      api.get<ApiResponse<Banner[]>>('/banners')
  },

  wishlist: {
    getAll: () => 
      api.get<ApiResponse<Product[]>>('/wishlist'),
    add: (productId: number) => 
      api.post<ApiResponse<void>>('/wishlist', { productId }),
    remove: (productId: number) => 
      api.delete<ApiResponse<void>>(`/wishlist/${productId}`)
  }
}

export default endpoints