import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { OrderWithItems } from '../../types';

interface Stats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  recentOrders: OrderWithItems[];
}

export const Reports = () => {
  const [stats, setStats] = useState<Stats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersResult, productsResult, recentOrdersResult] = await Promise.all([
        supabase.from('orders').select('total, status'),
        supabase.from('products').select('id'),
        supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              products (*)
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10),
      ]);

      const orders = ordersResult.data || [];
      const totalRevenue = orders
        .filter((o) => o.status === 'pending' || o.status === 'completed')
        .reduce((sum, order) => sum + order.total, 0);

      setStats({
        totalRevenue,
        totalOrders: orders.length,
        totalProducts: productsResult.data?.length || 0,
        recentOrders: (recentOrdersResult.data as OrderWithItems[]) || [],
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading reports...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-100">Total Revenue</span>
            <DollarSign size={24} className="text-green-100" />
          </div>
          <div className="text-3xl font-bold">₱{stats.totalRevenue.toFixed(2)}</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-100">Total Orders</span>
            <ShoppingBag size={24} className="text-blue-100" />
          </div>
          <div className="text-3xl font-bold">{stats.totalOrders}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-purple-100">Total Products</span>
            <Package size={24} className="text-purple-100" />
          </div>
          <div className="text-3xl font-bold">{stats.totalProducts}</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-orange-100">Avg Order Value</span>
            <TrendingUp size={24} className="text-orange-100" />
          </div>
          <div className="text-3xl font-bold">
            ₱
            {stats.totalOrders > 0
              ? (stats.totalRevenue / stats.totalOrders).toFixed(2)
              : '0.00'}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Order ID
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Customer
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Items
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Total
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-600">
                    {order.id.slice(0, 8)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {order.customer_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {order.order_items.length} items
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    ₱{order.total.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
