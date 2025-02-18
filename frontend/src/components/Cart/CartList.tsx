import { useCart } from '@/hooks/useCart'
import CartItem from './CartItem.tsx'

const CartList = () => {
  const cart = useCart()
  
  if (!cart?.items.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mt-2">
          Add some products to your cart to see them here
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {cart.items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
      
      <div className="border-t pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold">
            ${cart.total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CartList 