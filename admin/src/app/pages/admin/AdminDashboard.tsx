import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useOrders } from '../../contexts/OrderContext';
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

const products = [
  { id: '1', name: 'Silk Banarasi Fabric', brand: 'Banarasi Elite', price: 1200, soldBy: 'meter', inStock: true, category: 'Silk', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', description: 'Premium silk fabric' },
  { id: '2', name: 'Cotton Handloom', brand: 'Traditional Weaves', price: 500, soldBy: 'meter', inStock: true, category: 'Cotton', image: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400', description: 'Handwoven cotton' },
  { id: '3', name: 'Chiffon Designer', brand: 'Modern Fabrics', price: 900, soldBy: 'meter', inStock: false, category: 'Chiffon', image: 'https://images.unsplash.com/photo-1509319117210-6f1d2b3968b4?w=400', description: 'Designer chiffon' },
  { id: '4', name: 'Silk Kanjivaram', brand: 'South Silks', price: 1300, soldBy: 'piece', inStock: true, category: 'Silk', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400', description: 'Kanjivaram silk saree' },
  { id: '5', name: 'Georgette Print', brand: 'Modern Fabrics', price: 700, soldBy: 'meter', inStock: false, category: 'Georgette', image: 'https://images.unsplash.com/photo-1509319117210-6f1d2b3968b4?w=400', description: 'Printed georgette' },
];

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
  const { orders } = useOrders();

  // Calculate stats
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const activeCustomers = new Set(orders.map(o => o.customerPhone)).size;

  // Recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  // Top selling products (by frequency in orders)
  const productSales = new Map<string, { product: typeof products[0], count: number, revenue: number }>();
  orders.forEach(order => {
    order.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        const existing = productSales.get(product.id);
        const itemRevenue = item.soldBy === 'meter'
          ? item.price * item.quantity * (item.meters || 1)
          : item.price * item.quantity;

        if (existing) {
          existing.count += item.quantity;
          existing.revenue += itemRevenue;
        } else {
          productSales.set(product.id, { product, count: item.quantity, revenue: itemRevenue });
        }
      }
    });
  });

  const topProducts = Array.from(productSales.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Low stock products
  const lowStockProducts = products.filter(p => !p.inStock);

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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">
                  ₹{totalRevenue.toLocaleString('en-IN')}
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
                <h3 className="text-2xl font-bold mt-1">{totalOrders}</h3>
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
                <h3 className="text-2xl font-bold mt-1">{totalProducts}</h3>
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
                <h3 className="text-2xl font-bold mt-1">{activeCustomers}</h3>
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
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">#{order.id}</span>
                        <Badge className={statusConfig[order.status]?.color || 'bg-gray-100 text-gray-700'}>
                          {statusConfig[order.status]?.label || order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {order.customerName} • {order.items.length} items
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{order.total.toLocaleString('en-IN')}</p>
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
                {topProducts.map(({ product, count, revenue }) => (
                  <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="size-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {count} sales
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{revenue.toLocaleString('en-IN')}</p>
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
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{typeof product.category === 'object' ? product.category?.name : product.category}</p>
                  </div>
                  <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                    Out of Stock
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
