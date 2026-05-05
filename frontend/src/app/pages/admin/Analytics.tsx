import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  IndianRupee,
  ShoppingBag,
  Users,
  Package,
  Calendar
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useOrders } from '../../contexts/OrderContext';
import { products } from '../../data/products';
import { useState, useMemo } from 'react';
import { Button } from '../../components/ui/button';

export function Analytics() {
  const { orders } = useOrders();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  // Generate revenue data for the last 30 days - memoized
  const revenueData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dayOrders = orders?.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === date.toDateString();
      }) || [];
      
      return {
        id: `day-${i}`, // Add unique ID
        date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
        revenue: dayOrders.reduce((sum, order) => sum + order.totalWithGST, 0),
        orders: dayOrders.length
      };
    });
  }, [orders]);

  // Category-wise sales data - memoized
  const categoryData = useMemo(() => [
    { id: 'cat-1', name: 'Silk', value: 45, color: '#8b5cf6' },
    { id: 'cat-2', name: 'Cotton', value: 30, color: '#3b82f6' },
    { id: 'cat-3', name: 'Chiffon', value: 15, color: '#ec4899' },
    { id: 'cat-4', name: 'Linen', value: 10, color: '#f59e0b' },
  ], []);

  // Top selling products - memoized
  const topProducts = useMemo(() => [
    { id: 'prod-1', name: 'Premium Silk Fabric', sales: 145, revenue: 72500 },
    { id: 'prod-2', name: 'Cotton Voile', sales: 120, revenue: 48000 },
    { id: 'prod-3', name: 'Designer Chiffon', sales: 98, revenue: 58800 },
    { id: 'prod-4', name: 'Linen Blend', sales: 87, revenue: 43500 },
    { id: 'prod-5', name: 'Silk Georgette', sales: 76, revenue: 45600 },
  ], []);

  // Monthly comparison - memoized
  const monthlyData = useMemo(() => [
    { id: 'month-1', month: 'Jan', revenue: 125000, orders: 45 },
    { id: 'month-2', month: 'Feb', revenue: 145000, orders: 52 },
    { id: 'month-3', month: 'Mar', revenue: 165000, orders: 58 },
    { id: 'month-4', month: 'Apr', revenue: 155000, orders: 55 },
    { id: 'month-5', month: 'May', revenue: 185000, orders: 65 },
    { id: 'month-6', month: 'Jun', revenue: 195000, orders: 68 },
  ], []);

  // Calculate key metrics
  const totalRevenue = orders?.reduce((sum, order) => sum + order.totalWithGST, 0) || 0;
  const totalOrders = orders?.length || 0;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const stats = [
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      change: '+12.5%',
      trend: 'up',
      icon: IndianRupee,
    },
    {
      title: 'Total Orders',
      value: totalOrders.toString(),
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingBag,
    },
    {
      title: 'Avg. Order Value',
      value: `₹${Math.round(avgOrderValue).toLocaleString('en-IN')}`,
      change: '+4.3%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: 'Total Products',
      value: products.length.toString(),
      change: '+2.1%',
      trend: 'up',
      icon: Package,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your business performance and insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={timeRange === '7d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('7d')}
          >
            7 Days
          </Button>
          <Button
            variant={timeRange === '30d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('30d')}
          >
            30 Days
          </Button>
          <Button
            variant={timeRange === '90d' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('90d')}
          >
            90 Days
          </Button>
          <Button
            variant={timeRange === '1y' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange('1y')}
          >
            1 Year
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const isPositive = stat.trend === 'up';
          return (
            <Card key={stat.title} className="dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold mt-2 dark:text-white">{stat.value}</p>
                    <div className="flex items-center gap-1 mt-2">
                      {isPositive ? (
                        <TrendingUp className="size-4 text-green-600" />
                      ) : (
                        <TrendingDown className="size-4 text-red-600" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {stat.change}
                      </span>
                      <span className="text-sm text-muted-foreground">vs last period</span>
                    </div>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Icon className="size-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Revenue Chart */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Revenue Overview</CardTitle>
          <p className="text-sm text-muted-foreground">
            Daily revenue for the last 30 days
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350} key="revenue-chart">
            <AreaChart data={revenueData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" stroke="currentColor" opacity={0.1} />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                stroke="currentColor"
              />
              <YAxis 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
                stroke="currentColor"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#8b5cf6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#revenueGradient)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Revenue & Orders */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Monthly Performance</CardTitle>
            <p className="text-sm text-muted-foreground">
              Revenue and orders comparison
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key="monthly-chart">
              <BarChart data={monthlyData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" stroke="currentColor" opacity={0.1} />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: 'currentColor' }}
                  stroke="currentColor"
                />
                <YAxis 
                  tick={{ fill: 'currentColor' }}
                  stroke="currentColor"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="orders" fill="#3b82f6" radius={[8, 8, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="dark:text-white">Category Distribution</CardTitle>
            <p className="text-sm text-muted-foreground">
              Sales by product category
            </p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300} key="category-chart">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${entry.id}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Products */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader>
          <CardTitle className="dark:text-white">Top Selling Products</CardTitle>
          <p className="text-sm text-muted-foreground">
            Best performing products this month
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center size-10 rounded-full bg-primary/10 text-primary font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium dark:text-white">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {product.sales} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold dark:text-white">
                    ₹{product.revenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}