import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { endpoints } from '@/services/api'
import ProductGrid from '@/components/Products/ProductGrid.tsx'

const Products = () => {
  const [searchParams] = useSearchParams()
  const [sortBy, setSortBy] = useState('newest')
  const category = searchParams.get('category')
  const search = searchParams.get('search')

  const { isLoading } = useQuery({
    queryKey: ['products', { category, search, sortBy }],
    queryFn: () => endpoints.products.getAll().then(res => res.data)
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">
          {category ? `${category} Products` : 'All Products'}
        </h1>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="newest">Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <ProductGrid />
      )}
    </div>
  )
}

export default Products 