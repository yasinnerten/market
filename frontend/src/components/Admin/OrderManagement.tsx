import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { endpoints } from '@/services/api';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    user_email: string;
    total: number;
    status: string;
    created_at: string;
    items: OrderItem[];
}

export default function OrderManagement() {
    const queryClient = useQueryClient();
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);
    const [statusFilter, setStatusFilter] = React.useState<string>('all');

    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders', statusFilter],
        queryFn: () => endpoints.admin.getOrders().then(res => res.data),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ orderId, status }: { orderId: number; status: string }) =>
            endpoints.admin.updateOrderStatus(orderId, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
            setSelectedOrder(null);
        },
    });

    const handleStatusChange = (orderId: number, newStatus: string) => {
        if (window.confirm(`Are you sure you want to change the status to ${newStatus}?`)) {
            updateStatusMutation.mutate({ orderId, status: newStatus });
        }
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Orders</h2>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="border rounded-md p-2"
                >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders?.data?.map((order: Order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.user_email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    ${order.total.toFixed(2)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className={`rounded px-2 py-1 text-sm font-semibold ${
                                            order.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : order.status === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : order.status === 'cancelled'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-blue-100 text-blue-800'
                                        }`}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(order.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Order #{selectedOrder.id}</h3>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ×
                            </button>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Customer</p>
                                <p className="font-medium">{selectedOrder.user_email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Order Items</p>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="text-left">Product</th>
                                            <th className="text-right">Quantity</th>
                                            <th className="text-right">Price</th>
                                            <th className="text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.product_name}</td>
                                                <td className="text-right">{item.quantity}</td>
                                                <td className="text-right">
                                                    ${item.price.toFixed(2)}
                                                </td>
                                                <td className="text-right">
                                                    ${(item.price * item.quantity).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="text-right">
                                <p className="text-lg font-bold">
                                    Total: ${selectedOrder.total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 