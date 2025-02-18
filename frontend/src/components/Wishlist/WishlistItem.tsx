import { useCart } from '@/hooks/useCart'
import { Product } from '@/types'
import { useWishlist } from '@/hooks/useWishlist'
interface WishlistItemProps {
  product: Product
}

export default function WishlistItem({ product }: WishlistItemProps) {
  const { removeFromWishlist } = useWishlist()
  const cart = useCart()
  const { addItem } = cart || {}

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <img
        src={product.image}
        alt={product.name}
        className="w-24 h-24 object-cover rounded"
      />
      
      <div className="flex-grow">
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600">${product.price.toFixed(2)}</p>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => addItem?.(product.id, 1)}
          disabled={product.stock <= 0}
          className="btn btn-primary"
        >
          Add to Cart
        </button>
        <button
          onClick={() => removeFromWishlist(product.id)}
          className="btn btn-outline-danger"
        >
          Remove
        </button>
      </div>
    </div>
  )
} 