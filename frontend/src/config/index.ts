export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  imageUrl: import.meta.env.VITE_IMAGE_URL || 'http://localhost:8080/uploads',
  defaultPageSize: 10,
  supportEmail: 'support@example.com',
} 