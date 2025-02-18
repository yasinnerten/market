import { useApiQuery } from '@/hooks/useApi'
import { useParams } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { endpoints } from '@/services/api'
import { Product } from '@/types'


const ProductDetail = () => {
  const { id } = useParams()
  const cart = useCart()
  const { addItem } = cart || {}

  const { data: product, isLoading } = useApiQuery<Product>(
    ['product', id],
    () => endpoints.products.getOne(Number(id)).then(res => res.data)
  )

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="bg-gray-200 h-96 rounded-lg" />
        <div className="mt-6 space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-600">
          Product not found
        </h2>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          className="w-full h-96 object-cover rounded-lg"
        />
      </div>

      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
        <p className="text-2xl font-semibold text-primary-600">
          ${product.price.toFixed(2)}
        </p>
        
        <div className="prose max-w-none">
          <p>{product.description}</p>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => addItem?.(product.id, 1)}
            disabled={product.stock <= 0}
            className={`px-8 py-3 rounded-lg text-lg transition-colors ${
              product.stock > 0
                ? 'bg-primary-600 hover:bg-primary-700 text-white'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          {product.stock > 0 && (
            <span className="text-sm text-gray-500">
              {product.stock} in stock
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail 