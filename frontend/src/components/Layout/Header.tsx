import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">
            Market
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/products" className="hover:text-gray-600">
              Products
            </Link>
            
            {user ? (
              <>
                <Link to="/cart" className="relative hover:text-gray-600">
                  <ShoppingCartIcon className="h-6 w-6" />
                </Link>
                <Link to="/orders" className="hover:text-gray-600">
                  Orders
                </Link>
                <button
                  onClick={logout}
                  className="hover:text-gray-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-gray-600">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
} 