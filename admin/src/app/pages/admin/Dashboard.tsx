import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Table } from '../../components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Package, MoreVertical } from 'lucide-react';

const salesData = [
  { month: 'Jan', orders: 45, revenue: 32000 },
  { month: 'Feb', orders: 52, revenue: 38000 },
  { month: 'Mar', orders: 48, revenue: 35000 },
  { month: 'Apr', orders: 61, revenue: 45000 },
  { month: 'May', orders: 55, revenue: 40000 },
  { month: 'Jun', orders: 67, revenue: 52000 },
  { month: 'Jul', orders: 72, revenue: 58000 },
  { month: 'Aug', orders: 68, revenue: 54000 },
  { month: 'Sep', orders: 75, revenue: 62000 },
  { month: 'Oct', orders: 80, revenue: 68000 },
  { month: 'Nov', orders: 85, revenue: 72000 },
  { month: 'Dec', orders: 90, revenue: 78000 },
];

const categoryData = [
  { name: 'Silk', value: 45000, color: '#8B5CF6' },
  { name: 'Cotton', value: 38000, color: '#06B6D4' },
  { name: 'Chiffon', value: 25000, color: '#10B981' },
];

const userGrowthData = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 180 },
  { month: 'Mar', users: 240 },
  { month: 'Apr', users: 320 },
  { month: 'May', users: 410 },
  { month: 'Jun', users: 520 },
  { month: 'Jul', users: 640 },
  { month: 'Aug', users: 780 },
  { month: 'Sep', users: 920 },
  { month: 'Oct', users: 1100 },
  { month: 'Nov', users: 1300 },
  { month: 'Dec', users: 1520 },
];

const inventoryData = [
  { name: 'In Stock', value: 68, color: '#10B981' },
  { name: 'Low Stock', value: 22, color: '#F59E0B' },
  { name: 'Out of Stock', value: 10, color: '#EF4444' },
];

const recentOrders = [
  { id: '#ORD-001', customer: 'Priya Sharma', product: 'Silk Banarasi', quantity: 3, amount: 3600, status: 0 },
  { id: '#ORD-002', customer: 'Anjali Patel', product: 'Cotton Handloom', quantity: 5, amount: 2500, status: 1 },
  { id: '#ORD-003', customer: 'Neha Kumar', product: 'Chiffon Designer', quantity: 2, amount: 1800, status: 2 },
  { id: '#ORD-004', customer: 'Kavya Reddy', product: 'Silk Kanjivaram', quantity: 4, amount: 5200, status: 3 },
  { id: '#ORD-005', customer: 'Isha Gupta', product: 'Georgette Print', quantity: 3, amount: 2100, status: 4 },
];

const statusConfig = {
  0: { label: 'Pending', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  1: { label: 'Processing', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  2: { label: 'Shipped', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  3: { label: 'Out for Delivery', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  4: { label: 'Delivered', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
};

export function Dashboard() {
  const totalRevenue = 300000;
  const newUsers = 500;
  const totalOrders = 850;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Welcome back, Admin!</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
          Generate Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Sales</p>
                <h3 className="text-2xl font-bold mt-1">₹{(totalRevenue / 1000).toFixed(1)}k</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="size-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">+12.5%</span>
                </div>
              </div>
              <div className="size-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <DollarSign className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">New Users</p>
                <h3 className="text-2xl font-bold mt-1">{newUsers}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="size-4 text-green-500" />
                  <span className="text-sm text-green-600 dark:text-green-400">+8.2%</span>
                </div>
              </div>
              <div className="size-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                <Users className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">{totalOrders}</h3>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingDown className="size-4 text-red-500" />
                  <span className="text-sm text-red-600 dark:text-red-400">-2.4%</span>
                </div>
              </div>
              <div className="size-12 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                <ShoppingBag className="size-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Report */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Sales Report</CardTitle>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="revenue" fill="url(#colorRevenue)" radius={[8, 8, 0, 0]} />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#10B981" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Categories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Categories</CardTitle>
              <Button variant="ghost" size="sm">See More</Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry) => (
                    <Cell key={`category-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-4">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Growth</CardTitle>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-green-600 dark:text-green-400">+28%</span>
                <TrendingUp className="size-4 text-green-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-3xl font-bold">9,500</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total registered users</p>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                <XAxis dataKey="month" stroke="#6B7280" />
                <YAxis stroke="#6B7280" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="users" stroke="#10B981" fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Situation */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Inventory Situation</CardTitle>
              <Button variant="ghost" size="icon">
                <MoreVertical className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {inventoryData.map((entry) => (
                    <Cell key={`inventory-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: number) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {inventoryData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="size-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm">View All Orders</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Qty</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="py-3 px-4 font-medium">{order.id}</td>
                    <td className="py-3 px-4">{order.customer}</td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{order.product}</td>
                    <td className="py-3 px-4">{order.quantity}</td>
                    <td className="py-3 px-4 font-medium">₹{order.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                        {statusConfig[order.status as keyof typeof statusConfig].label}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
