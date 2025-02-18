import axios from 'axios'
import type { 
  ApiResponse, 
  Product, 
  Order, 
  Analytics, 
  Banner,
  OrderStatus 
} from '@/types'

const api = axios.create({
  baseURL: '/api'
})

export const adminEndpoints = {
  dashboard: {
    getAnalytics: () => 
      api.get<ApiResponse<Analytics>>('/admin/analytics'),
  },

  products: {
    getAll: () => 
      api.get<ApiResponse<Product[]>>('/admin/products'),
    getOne: (id: number) => 
      api.get<ApiResponse<Product>>(`/admin/products/${id}`),
    create: (data: FormData) => 
      api.post<ApiResponse<Product>>('/admin/products', data),
    update: (id: number, data: FormData) => 
      api.put<ApiResponse<Product>>(`/admin/products/${id}`, data),
    delete: (id: number) => 
      api.delete<ApiResponse<void>>(`/admin/products/${id}`),
    uploadImage: (id: number, file: File) => {
      const formData = new FormData()
      formData.append('image', file)
      return api.post<ApiResponse<string>>(`/admin/products/${id}/image`, formData)
    }
  },

  orders: {
    getAll: () => 
      api.get<ApiResponse<Order[]>>('/admin/orders'),
    getOne: (id: number) => 
      api.get<ApiResponse<Order>>(`/admin/orders/${id}`),
    updateStatus: (id: number, status: OrderStatus) => 
      api.put<ApiResponse<Order>>(`/admin/orders/${id}/status`, { status })
  },

  banners: {
    getAll: () => 
      api.get<ApiResponse<Banner[]>>('/admin/banners'),
    create: (data: Partial<Banner>) => 
      api.post<ApiResponse<Banner>>('/admin/banners', data),
    update: (id: number, data: Partial<Banner>) => 
      api.put<ApiResponse<Banner>>(`/admin/banners/${id}`, data),
    delete: (id: number) => 
      api.delete<ApiResponse<void>>(`/admin/banners/${id}`)
  }
} 