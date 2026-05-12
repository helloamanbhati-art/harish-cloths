import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingBag,
  Package,
  Users,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router';

const statusConfig = {
  0: { label: 'Order Placed', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  1: { label: 'Processing', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  2: { label: 'Shipped', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  3: { label: 'Out for Delivery', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  4: { label: 'Delivered', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
};

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  const getAuthHeaders = () => {
    const token = localStorage.getItem('adminToken');
    return {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    };
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard stats
        const dashRes = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard`, {
          headers: getAuthHeaders(),
        });

        if (!dashRes.ok) {
          throw new Error('Failed to fetch dashboard stats');
        }

        const dashData = await dashRes.json();
        
        if (dashData.success && dashData.data) {
          const { stats: dashStats, recentOrders: orders, topProducts: products, lowStockProducts: lowStock } = dashData.data;
          
          setStats({
            totalRevenue: dashStats.totalRevenue || 0,
            totalOrders: dashStats.totalOrders || 0,
            totalProducts: dashStats.totalProducts || 0,
            totalCustomers: dashStats.totalCustomers || 0,
          });

          setRecentOrders(orders || []);
          setTopProducts(products || []);
          setLowStockProducts(lowStock || []);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_BASE_URL]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          <ArrowUpRight className="size-4" />
          Generate Report
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
          <CardContent className="pt-6">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                    <h3 className="text-2xl font-bold mt-1">
                      ₹{stats.totalRevenue.toLocaleString('en-IN')}
                    </h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="size-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">+12.5%</span>
                    </div>
                  </div>
                  <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <IndianRupee className="size-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.totalOrders}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="size-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">+8.2%</span>
                    </div>
                  </div>
                  <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <ShoppingBag className="size-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Products</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.totalProducts}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingDown className="size-4 text-red-500" />
                      <span className="text-sm text-red-600 dark:text-red-400">-2.4%</span>
                    </div>
                  </div>
                  <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                    <Package className="size-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Active Customers</p>
                    <h3 className="text-2xl font-bold mt-1">{stats.totalCustomers}</h3>
                    <div className="flex items-center gap-1 mt-2">
                      <TrendingUp className="size-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">+15.3%</span>
                    </div>
                  </div>
                  <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <Users className="size-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Orders</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/admin/orders">View All</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentOrders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                    <ShoppingBag className="size-12 mb-3 opacity-50" />
                    <p>No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentOrders.map((order: any) => (
                      <div key={order._id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">#{order.orderNumber || order._id?.slice(-6)}</span>
                            <Badge className={statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700'}>
                              {statusConfig[order.status]?.label || order.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {order.customer?.firstName || order.firstName} • {order.items?.length || 0} items
                          </p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            {new Date(order.createdAt).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{order.total?.toLocaleString('en-IN') || '0'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Top Products */}
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                {topProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-gray-500 dark:text-gray-400">
                    <Package className="size-12 mb-3 opacity-50" />
                    <p>No sales data yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {topProducts.map((product: any) => (
                      <div key={product._id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="size-12 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {product.totalSales || 0} sales
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{product.price?.toLocaleString('en-IN') || '0'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertCircle className="size-5 text-red-500" />
                <CardTitle>Low Stock Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {lowStockProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-green-600 dark:text-green-400">
                  <CheckCircle2 className="size-12 mb-3" />
                  <p className="font-medium">All products are in stock</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {lowStockProducts.map((item: any) => (
                    <div key={item._id} className="flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                      <div>
                        <p className="font-medium">{item.product?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Available: {item.available || 0}
                        </p>
                      </div>
                      <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        Low Stock
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
