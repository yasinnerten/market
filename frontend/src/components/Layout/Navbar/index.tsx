import { Link } from 'react-router-dom'
import { useCart } from '@/hooks/useCart'
import SearchBar from './SearchBar.tsx'
import CartButton from './CartButton.tsx'
import UserMenu from './UserMenu.tsx'

const Navbar = () => {
  const cart = useCart()
  const items = cart?.items || []

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo and main navigation */}
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-primary-600">
              Market
            </Link>
            <div className="hidden md:flex space-x-6">
              <Link to="/products" className="text-gray-700 hover:text-primary-600">
                Products
              </Link>
              <Link to="/categories" className="text-gray-700 hover:text-primary-600">
                Categories
              </Link>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            <SearchBar />
          </div>

          {/* User navigation */}
          <div className="flex items-center space-x-4">
            <CartButton count={items.length} />
            <UserMenu />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar 