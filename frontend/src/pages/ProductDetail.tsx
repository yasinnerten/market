import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { endpoints } from '@/services/api'
import { Product } from '@/types'
import { useApiQuery } from '@/hooks/useApi'

const ProductDetail = () => {
  const { id } = useParams()
  const [quantity, setQuantity] = useState(1)
  const cart = useCart()
  const { addItem } = cart || {}

  const { data: product, isLoading } = useApiQuery<Product>(
    ['product', id],
    () => endpoints.products.getOne(Number(id)).then(res => res.data)
  )

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600" />
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

  const handleAddToCart = () => {
    addItem?.(product.id, quantity)
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="aspect-square">
          <img
            src={product.imageUrl || '/placeholder.png'}
            alt={product.name}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 0 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {product.stock > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="font-medium text-gray-700">
                  Quantity:
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  {[...Array(Math.min(10, product.stock))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full btn btn-primary"
              >
                Add to Cart
              </button>
            </div>
          )}

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-4">
            <h2 className="text-lg font-semibold">Product Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-500">Category:</span>
                <span className="ml-2">{product.category}</span>
              </div>
              <div>
                <span className="font-medium text-gray-500">SKU:</span>
                <span className="ml-2">{product.id}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail 