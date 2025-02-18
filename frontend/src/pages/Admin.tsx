import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import AdminLayout from '@/components/Admin/AdminLayout'
import Dashboard from '@/components/Admin/Dashboard'
import ProductManagement from '@/components/Admin/ProductManagement'
import OrderManagement from '@/components/Admin/OrderManagement'

export default function Admin() {
  const { user } = useAuth()

  // Protect admin routes
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
      </Routes>
    </AdminLayout>
  )
} 