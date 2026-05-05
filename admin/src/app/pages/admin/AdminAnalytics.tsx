import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useOrders } from '../../contexts/OrderContext';
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, IndianRupee, ShoppingBag, BarChart3, PieChartIcon } from 'lucide-react';

type TimeRange = '7D' | '30D' | '90D' | '1Y';

const categoryColors: Record<string, string> = {
  Silk: '#8b5cf6',
  Cotton: '#3b82f6',
  Chiffon: '#ec4899',
  Linen: '#f59e0b',
  Georgette: '#10b981',
  Velvet: '#ef4444',
  Other: '#6b7280',
};

export function AdminAnalytics() {
  const { orders } = useOrders();
  const [timeRange, setTimeRange] = useState<TimeRange>('30D');

  // Calculate date range
  const getDateRange = () => {
    const now = new Date();
    const days = timeRange === '7D' ? 7 : timeRange === '30D' ? 30 : timeRange === '90D' ? 90 : 365;
    const start = new Date(now);
    start.setDate(start.getDate() - days);
    return { start, end: now, days };
  };

  const { start, end, days } = getDateRange();

  // Filter orders by time range
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= start && orderDate <= end;
    });
  }, [orders, start, end]);

  // Calculate stats
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalRevenue / totalOrdersCount : 0;

  // Previous period for comparison
  const prevStart = new Date(start);
  prevStart.setDate(prevStart.getDate() - days);
  const prevOrders = orders.filter(order => {
    const orderDate = new Date(order.createdAt);
    return orderDate >= prevStart && orderDate < start;
  });
  const prevRevenue = prevOrders.reduce((sum, order) => sum + order.total, 0);
  const prevOrdersCount = prevOrders.length;

  const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
  const ordersChange = prevOrdersCount > 0 ? ((totalOrdersCount - prevOrdersCount) / prevOrdersCount) * 100 : 0;

  // Revenue over time data
  const revenueOverTime = useMemo(() => {
    const dataMap = new Map<string, { date: string; revenue: number; orders: number }>();

    // Initialize all dates
    for (let i = 0; i < days; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dateStr = date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      dataMap.set(dateStr, { date: dateStr, revenue: 0, orders: 0 });
    }

    // Fill with actual data
    filteredOrders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const dateStr = orderDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
      const existing = dataMap.get(dateStr);
      if (existing) {
        existing.revenue += order.total;
        existing.orders += 1;
      }
    });

    return Array.from(dataMap.values());
  }, [filteredOrders, days, start]);

  // Sales by category
  const salesByCategory = useMemo(() => {
    const categoryMap = new Map<string, number>();

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const category = item.productName.includes('Silk') ? 'Silk' :
                        item.productName.includes('Cotton') ? 'Cotton' :
                        item.productName.includes('Chiffon') ? 'Chiffon' :
                        item.productName.includes('Linen') ? 'Linen' :
                        item.productName.includes('Georgette') ? 'Georgette' :
                        item.productName.includes('Velvet') ? 'Velvet' : 'Other';

        const revenue = item.soldBy === 'meter'
          ? item.price * item.quantity * (item.meters || 1)
          : item.price * item.quantity;

        categoryMap.set(category, (categoryMap.get(category) || 0) + revenue);
      });
    });

    return Array.from(categoryMap.entries()).map(([name, value]) => ({
      name,
      value,
      color: categoryColors[name] || categoryColors.Other,
    }));
  }, [filteredOrders]);

  // Monthly revenue (last 6 months)
  const monthlyRevenue = useMemo(() => {
    const monthMap = new Map<string, number>();
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-IN', { month: 'short' });
      monthMap.set(monthKey, 0);
    }

    orders.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthKey = orderDate.toLocaleDateString('en-IN', { month: 'short' });
      if (monthMap.has(monthKey)) {
        monthMap.set(monthKey, (monthMap.get(monthKey) || 0) + order.total);
      }
    });

    return Array.from(monthMap.entries()).map(([month, revenue]) => ({ month, revenue }));
  }, [orders]);

  // Top products
  const topProducts = useMemo(() => {
    const productMap = new Map<string, { name: string; units: number; revenue: number }>();

    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        const existing = productMap.get(item.productId);
        const revenue = item.soldBy === 'meter'
          ? item.price * item.quantity * (item.meters || 1)
          : item.price * item.quantity;

        if (existing) {
          existing.units += item.quantity;
          existing.revenue += revenue;
        } else {
          productMap.set(item.productId, {
            name: item.productName,
            units: item.quantity,
            revenue,
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [filteredOrders]);

  const maxRevenue = Math.max(...topProducts.map(p => p.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Detailed insights and performance metrics
          </p>
        </div>
        <div className="flex gap-2">
          {(['7D', '30D', '90D', '1Y'] as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
              className={timeRange === range ? 'bg-gradient-to-r from-purple-600 to-indigo-600' : ''}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {revenueChange >= 0 ? (
                    <TrendingUp className="size-4 text-green-500" />
                  ) : (
                    <TrendingDown className="size-4 text-red-500" />
                  )}
                  <span className={`text-sm ${revenueChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
                  </span>
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
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">{totalOrdersCount}</h3>
                <div className="flex items-center gap-1 mt-2">
                  {ordersChange >= 0 ? (
                    <TrendingUp className="size-4 text-green-500" />
                  ) : (
                    <TrendingDown className="size-4 text-red-500" />
                  )}
                  <span className={`text-sm ${ordersChange >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {ordersChange >= 0 ? '+' : ''}{ordersChange.toFixed(1)}%
                  </span>
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
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Order Value</p>
                <h3 className="text-2xl font-bold mt-1">₹{Math.round(avgOrderValue).toLocaleString('en-IN')}</h3>
              </div>
              <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <BarChart3 className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Conversion Insights</p>
                <h3 className="text-2xl font-bold mt-1">{salesByCategory.length}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Categories</p>
              </div>
              <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <PieChartIcon className="size-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Area Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="flex items-center justify-center h-[300px] text-gray-500 dark:text-gray-400">
              <p>No data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueOverTime}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                />
                <YAxis
                  stroke="#6B7280"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'revenue') return [`₹${value.toLocaleString('en-IN')}`, 'Revenue'];
                    return [value, 'Orders'];
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Two Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart - Sales by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Sales by Category</CardTitle>
          </CardHeader>
          <CardContent>
            {salesByCategory.length === 0 ? (
              <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-gray-400">
                <p>No data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={salesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {salesByCategory.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart - Monthly Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            {monthlyRevenue.every(m => m.revenue === 0) ? (
              <div className="flex items-center justify-center h-[250px] text-gray-500 dark:text-gray-400">
                <p>No data yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={monthlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                  <XAxis dataKey="month" stroke="#6B7280" style={{ fontSize: '12px' }} />
                  <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
                  />
                  <Bar dataKey="revenue" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent>
          {topProducts.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
              <p>No data yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 w-16">Rank</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Product Name</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Units Sold</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Revenue</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400 w-48">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product, index) => (
                    <tr key={product.name} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 px-4">
                        <div className="size-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center font-bold text-purple-700 dark:text-purple-300">
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{product.name}</td>
                      <td className="py-3 px-4">{product.units}</td>
                      <td className="py-3 px-4 font-bold">₹{product.revenue.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-4">
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full"
                            style={{ width: `${(product.revenue / maxRevenue) * 100}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
