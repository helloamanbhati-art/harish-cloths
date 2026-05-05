import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import { Search, Users, TrendingUp, DollarSign, Package } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';

interface DerivedCustomer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  city: string;
  state: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

const statusConfig = {
  0: { label: 'Order Placed', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  1: { label: 'Processing', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  2: { label: 'Shipped', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  3: { label: 'Out for Delivery', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  4: { label: 'Delivered', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
};

export function CustomersManagement() {
  const { orders } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<DerivedCustomer | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Derive customers from orders
  const customers = useMemo(() => {
    const customerMap = new Map<string, DerivedCustomer>();

    orders.forEach(order => {
      if (!customerMap.has(order.customerPhone)) {
        // Parse address for city/state (simple extraction)
        const address = order.shippingAddress || '';
        const parts = address.split(',').map(p => p.trim());
        const city = parts[parts.length - 3] || 'Unknown';
        const state = parts[parts.length - 2] || 'Unknown';

        customerMap.set(order.customerPhone, {
          id: order.customerPhone,
          name: order.customerName,
          phone: order.customerPhone,
          email: order.customerEmail,
          city,
          state,
          totalOrders: 1,
          totalSpent: order.total,
          lastOrderDate: order.createdAt,
        });
      } else {
        const customer = customerMap.get(order.customerPhone)!;
        customer.totalOrders += 1;
        customer.totalSpent += order.total;
        if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
          customer.lastOrderDate = order.createdAt;
        }
      }
    });

    return Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  // Filter customers
  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email && customer.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Calculate stats
  const totalCustomers = customers.length;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeThisMonth = customers.filter(c => new Date(c.lastOrderDate) >= thirtyDaysAgo).length;
  const avgOrdersPerCustomer = totalCustomers > 0 ? (orders.length / totalCustomers).toFixed(1) : 0;
  const avgCustomerValue = totalCustomers > 0 ? Math.round(orders.reduce((sum, o) => sum + o.total, 0) / totalCustomers) : 0;

  const getCustomerOrders = (phone: string) => {
    return orders.filter(order => order.customerPhone === phone);
  };

  const handleViewOrders = (customer: DerivedCustomer) => {
    setSelectedCustomer(customer);
    setDialogOpen(true);
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getAvatarColor = (phone: string) => {
    const colors = [
      'bg-purple-200 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
      'bg-blue-200 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
      'bg-green-200 dark:bg-green-900/40 text-green-700 dark:text-green-300',
      'bg-orange-200 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300',
      'bg-pink-200 dark:bg-pink-900/40 text-pink-700 dark:text-pink-300',
      'bg-indigo-200 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
    ];
    const index = parseInt(phone.slice(-1)) % colors.length;
    return colors[index];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Customers</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Total {totalCustomers} customers
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Customers</p>
                <h3 className="text-2xl font-bold mt-1">{totalCustomers}</h3>
              </div>
              <div className="size-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="size-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active This Month</p>
                <h3 className="text-2xl font-bold mt-1">{activeThisMonth}</h3>
              </div>
              <div className="size-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="size-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Orders/Customer</p>
                <h3 className="text-2xl font-bold mt-1">{avgOrdersPerCustomer}</h3>
              </div>
              <div className="size-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Package className="size-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Avg Customer Value</p>
                <h3 className="text-2xl font-bold mt-1">₹{avgCustomerValue.toLocaleString('en-IN')}</h3>
              </div>
              <div className="size-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <DollarSign className="size-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          {filteredCustomers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <Users className="size-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No customers yet</p>
              <p className="text-sm">Orders will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Phone</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total Orders</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total Spent</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Last Order</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`size-10 rounded-full flex items-center justify-center font-bold ${getAvatarColor(customer.phone)}`}>
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {customer.email || 'No email'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">{customer.phone}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p>{customer.city}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{customer.state}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                          {customer.totalOrders}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-green-600 dark:text-green-400">
                          ₹{customer.totalSpent.toLocaleString('en-IN')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                        {getRelativeTime(customer.lastOrderDate)}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewOrders(customer)}
                        >
                          View Orders
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Customer Orders Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedCustomer && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <div>
                    <p className="text-xl">{selectedCustomer.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{selectedCustomer.phone}</p>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="py-4">
                <h3 className="font-medium mb-4">Order History</h3>
                <div className="space-y-3">
                  {getCustomerOrders(selectedCustomer.phone).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-medium">HC-2024-{order.id.padStart(6, '0')}</span>
                          <Badge className={statusConfig[order.status as keyof typeof statusConfig].color}>
                            {statusConfig[order.status as keyof typeof statusConfig].label}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })} • {order.items.length} items
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₹{order.total.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
