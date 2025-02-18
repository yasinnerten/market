import { useCart } from '@/hooks/useCart'
import CartList from '@/components/Cart/CartList.tsx'
const Cart = () => {
  const cart = useCart()
  const items = cart?.items || []
  const total = cart?.total || 0

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <CartList />
        </div>
        
        {items.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2 font-semibold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary w-full">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart 