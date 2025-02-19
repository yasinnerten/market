import { useQuery } from '@tanstack/react-query';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { endpoints } from '@/services/api';
import { Analytics, ApiResponse } from '@/types';

export default function Dashboard() {
    const { data: analytics, isLoading } = useQuery<ApiResponse<Analytics>>({
        queryKey: ['admin-analytics'],
        queryFn: () => endpoints.admin.getAnalytics().then(res => res.data)
    });

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                    <p className="text-2xl font-bold">${analytics?.data.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Orders</h3>
                    <p className="text-2xl font-bold">{analytics?.data.totalOrders}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Average Order Size</h3>
                    <p className="text-2xl font-bold">${analytics?.data.averageOrderSize.toFixed(2)}</p>
                </div>
            </div>

            {/* Revenue Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Revenue Over Time</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics?.data.dailyRevenue}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="revenue" stroke="#4F46E5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Top Products */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Product</th>
                                <th className="text-right py-2">Units Sold</th>
                                <th className="text-right py-2">Revenue</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics?.data.topProducts.map((product) => (
                                <tr key={product.id} className="border-b">
                                    <td className="py-2 flex items-center">
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-8 h-8 object-cover rounded mr-2"
                                        />
                                        {product.name}
                                    </td>
                                    <td className="text-right py-2">{product.sold}</td>
                                    <td className="text-right py-2">${product.revenue.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2">Order ID</th>
                                <th className="text-left py-2">Customer</th>
                                <th className="text-right py-2">Amount</th>
                                <th className="text-center py-2">Status</th>
                                <th className="text-right py-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {analytics?.data.recentOrders.map((order) => (
                                <tr key={order.id} className="border-b">
                                    <td className="py-2">#{order.id}</td>
                                    <td className="py-2">{order.user_email}</td>
                                    <td className="text-right py-2">${order.total.toFixed(2)}</td>
                                    <td className="text-center py-2">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="text-right py-2">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
} 