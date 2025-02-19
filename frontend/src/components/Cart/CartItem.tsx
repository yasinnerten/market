import { useCart } from '@/hooks/useCart'
import { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

const CartItem = ({ item }: CartItemProps) => {
  const cart = useCart()

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <img
        src={item.product.imageUrl}
        alt={item.product.name}
        className="w-24 h-24 object-cover rounded"
      />
      
      <div className="flex-grow">
        <h3 className="font-semibold">{item.product.name}</h3>
        <p className="text-gray-600">
          ${item.product.price.toFixed(2)} × {item.quantity}
        </p>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => cart?.updateQuantity(item.productId, item.quantity - 1)}
          className="p-1 rounded hover:bg-gray-100"
        >
          -
        </button>
        <span className="w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => cart?.updateQuantity(item.productId, item.quantity + 1)}
          className="p-1 rounded hover:bg-gray-100"
        >
          +
        </button>
        <button
          onClick={() => cart?.removeItem(item.productId)}
          className="ml-4 text-red-500 hover:text-red-600"
        >
          Remove
        </button>
      </div>
    </div>
  )
}

export default CartItem 