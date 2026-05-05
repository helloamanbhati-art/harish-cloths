import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertCircle
} from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useOrders } from '../../contexts/OrderContext';
import { products } from '../../data/products';

export function AdminDashboard() {
  const { orders } = useOrders();

  // Calculate stats
  const totalOrders = orders?.length || 0;
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalWithGST, 0) || 0;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => !p.inStock).length;

  // Recent orders (last 5)
  const recentOrders = orders?.slice(0, 5) || [];

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: '+12.5%',
      trend: 'up',
      icon: IndianRupee,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Products',
      value: totalProducts.toString(),
      change: '+3',
      trend: 'up',
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Active Customers',
      value: '1,234',
      change: '+5.1%',
      trend: 'up',
      icon: Users,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const statusColors: Record<number, string> = {
    0: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-700',
    1: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-700',
    2: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-700',
    3: 'bg-orange-100 text-orange-800 border-orange-300 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-700',
    4: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/30 dark:text-green-400 dark:border-green-700',
  };

  const statusNames = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>
        <Button>
          <ArrowUpRight className="size-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2 dark:text-white">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {stat.trend === 'up' ? (
                        <TrendingUp className="size-3 text-green-600" />
                      ) : (
                        <TrendingDown className="size-3 text-red-600" />
                      )}
                      <span
                        className={`text-xs font-medium ${
                          stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-xs text-muted-foreground">from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`size-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="size-5 text-orange-600 dark:text-orange-400" />
              <div>
                <p className="font-semibold text-orange-900 dark:text-orange-200">
                  {lowStockProducts} products are out of stock
                </p>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  Review inventory and restock items
                </p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                View Products
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="dark:text-white">Recent Orders</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="size-12 mx-auto mb-3 opacity-50" />
                <p>No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm dark:text-white">{order.orderNumber}</p>
                        <Badge
                          variant="outline"
                          className={statusColors[order.currentStatus] || 'bg-gray-100 text-gray-800'}
                        >
                          {statusNames[order.currentStatus] || order.currentStatus}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {order.customer.name} • {order.items.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm flex items-center gap-0.5 dark:text-white">
                        <IndianRupee className="size-3" />
                        {order.totalWithGST.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.orderDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Selling Products */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="dark:text-white">Top Selling Products</CardTitle>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {products.slice(0, 5).map((product, index) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-lg border dark:border-gray-700 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                    {index + 1}
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="size-12 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate dark:text-white">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{typeof product.category === 'object' ? product.category?.name : product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-sm flex items-center gap-0.5 dark:text-white">
                      <IndianRupee className="size-3" />
                      {product.price}
                    </p>
                    <Badge variant="secondary" className="text-xs">
                      {Math.floor(Math.random() * 100)} sold
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}