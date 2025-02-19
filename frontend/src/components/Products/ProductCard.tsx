import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'
import { useWishlist } from '@/hooks/useWishlist'
interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  const cart = useCart()
  const { addItem } = cart || {}
  const { addToWishlist, isInWishlist } = useWishlist()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/products/${product.id}`}>
        <img
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary-600">
            ${product.price.toFixed(2)}
          </span>
          
          <div className="flex space-x-2">
            <button
              onClick={() => addToWishlist(product.id)}
              className={`p-2 rounded-full ${
                isInWishlist(product.id)
                  ? 'text-red-500'
                  : 'text-gray-400 hover:text-red-500'
              }`}
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            
            <button
              disabled={product.stock <= 0}
              onClick={() => addItem?.(product.id, 1)}
              className={`px-4 py-2 rounded ${
                product.stock > 0
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCard 