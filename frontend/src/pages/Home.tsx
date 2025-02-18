import { useQuery } from '@tanstack/react-query'
import { endpoints } from '@/services/api'

export default function Home() {
  useQuery({
    queryKey: ['products'],
    queryFn: () => endpoints.products.getAll().then(res => res.data)
  })

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold">Welcome to Our Store</h1>
      <p className="mt-4">Start shopping our amazing products</p>
    </div>
  )
} 