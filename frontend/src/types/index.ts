// Base model interface
interface BaseModel {
  id: number
  createdAt: string
  updatedAt: string
}

// User related interfaces
export interface User extends BaseModel {
  email: string
  name: string
  role: 'user' | 'admin'
  isAdmin: boolean
}

export interface LoginInput {
  email: string
  password: string
}

export interface RegisterInput extends LoginInput {
  name: string
}

export interface AuthResponse {
  token: string
  user: User
}

// Product related interfaces
export interface Product extends BaseModel {
  image: any
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string
  category: string
}

export interface ProductQueryParams {
  search?: string
  category?: string
  sort?: 'price_asc' | 'price_desc' | 'newest'
  page?: number
  limit?: number
}

// Cart related interfaces
export interface CartItem {
  id: number
  productId: number
  product: Product
  quantity: number
  price: number
}

export interface Cart {
  items: CartItem[]
  total: number
}

// Order related interfaces
export interface OrderItem extends BaseModel {
  productId: number
  product: Product
  product_name: string
  quantity: number
  price: number
}

export interface Order extends BaseModel {
  items: OrderItem[]
  total: number
  status: OrderStatus
  shippingAddress: string
  user_email: string
  created_at: string
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled'

// Admin related interfaces
export interface Analytics extends BaseModel {
  totalRevenue: number
  totalOrders: number
  averageOrderSize: number
  dailyRevenue: Array<{
    date: string
    revenue: number
  }>
  topProducts: Array<{
    product: Product
    sold: number
    revenue: number
  }>
  recentOrders: Array<{
    order: Order
    user: User
  }>
}

export interface Banner extends BaseModel {
  title: string
  subtitle: string
  imageUrl: string
  ctaText: string
  ctaLink: string
  isActive: boolean
}

// API Response interfaces
export interface ApiResponse<T> {
  id: File | null
  data: T
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

// Pagination interfaces
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// File upload interfaces
export interface FileUploadResponse {
  url: string
  filename: string
}

// Search interfaces
export interface SearchResult<T> {
  items: T[]
  total: number
  took: number
}

// Filter interfaces
export interface FilterOptions {
  categories: string[]
  priceRange: {
    min: number
    max: number
  }
  sortOptions: Array<{
    value: string
    label: string
  }>
}

export interface Category extends BaseModel {
  name: string
  slug: string
  description?: string
} 