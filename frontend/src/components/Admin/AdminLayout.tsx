import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    React.useEffect(() => {
        if (user?.role !== 'admin') {
            navigate('/');
        }
    }, [user, navigate]);

    const isActive = (path: string) => {
        return location.pathname === `/admin${path}` ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-700';
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 min-h-screen p-4">
                <h2 className="text-white text-xl font-semibold mb-6">Admin Panel</h2>
                <nav className="space-y-2">
                    <Link
                        to="/admin"
                        className={`block px-4 py-2 rounded-md ${isActive('/')}`}
                    >
                        Dashboard
                    </Link>
                    <Link
                        to="/admin/products"
                        className={`block px-4 py-2 rounded-md ${isActive('/products')}`}
                    >
                        Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        className={`block px-4 py-2 rounded-md ${isActive('/orders')}`}
                    >
                        Orders
                    </Link>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow">
                    <div className="px-4 py-6">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Admin Dashboard
                        </h1>
                    </div>
                </header>

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
} 