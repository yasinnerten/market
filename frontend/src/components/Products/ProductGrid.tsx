import { useApiQuery } from '@/hooks/useApi'
import { endpoints } from '@/services/api'
import { Product } from '@/types'
import ProductCard from './ProductCard'
import { getErrorMessage } from '@/utils/errorHandler'

export default function ProductGrid() {
  const { data, isLoading, error } = useApiQuery<Product[]>(
    ['products'],
    () => endpoints.products.getAll().then(res => res.data)
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {getErrorMessage(error)}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {data?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}