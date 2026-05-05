import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Search, Eye, ShoppingBag, Truck, CreditCard, MapPin } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import { toast } from 'sonner';

const statusConfig = {
  0: { label: 'Order Placed', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  1: { label: 'Processing', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  2: { label: 'Shipped', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  3: { label: 'Out for Delivery', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  4: { label: 'Delivered', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
};

type OrderStatus = keyof typeof statusConfig;

export function OrdersManagement() {
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const orderNumber = `HC-2024-${order.id.padStart(6, '0')}`;
    const matchesSearch =
      orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status.toString() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setNewStatus(order.status as OrderStatus);
    setDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;

    updateOrderStatus(selectedOrder.id, newStatus as any);
    toast.success('Order status updated successfully');
    setSelectedOrder({ ...selectedOrder, status: newStatus as any });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Orders Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Total {orders.length} orders
        </p>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search by order number, customer name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="0">Order Placed</SelectItem>
                <SelectItem value="1">Processing</SelectItem>
                <SelectItem value="2">Shipped</SelectItem>
                <SelectItem value="3">Out for Delivery</SelectItem>
                <SelectItem value="4">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
        </CardHeader>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
              <ShoppingBag className="size-16 mb-4 opacity-50" />
              <p className="text-lg font-medium">No orders found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Order #</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Customer</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Items</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Total</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const orderNumber = `HC-2024-${order.id.padStart(6, '0')}`;
                    return (
                      <tr key={order.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="py-3 px-4">
                          <span className="font-mono font-medium">{orderNumber}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{order.customerName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.customerPhone}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{order.items.length} items</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">
                              {order.items.map(item => item.productName).join(', ')}
                            </p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-bold">₹{(order.total || 0).toLocaleString('en-IN')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">with GST</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <Badge className={statusConfig[order.status as OrderStatus]?.color || 'bg-gray-100'}>
                            {statusConfig[order.status as OrderStatus]?.label || order.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {formatDate(order.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="size-4" />
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <div>
                    <span className="font-mono">HC-2024-{selectedOrder.id.padStart(6, '0')}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-4">
                      {formatDate(selectedOrder.createdAt)}
                    </span>
                  </div>
                  <Badge className={statusConfig[selectedOrder.status as OrderStatus].color}>
                    {statusConfig[selectedOrder.status as OrderStatus].label}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Status Update */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Update Order Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Select value={newStatus.toString()} onValueChange={(value) => setNewStatus(value as OrderStatus)}>
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">Order Placed</SelectItem>
                          <SelectItem value="1">Processing</SelectItem>
                          <SelectItem value="2">Shipped</SelectItem>
                          <SelectItem value="3">Out for Delivery</SelectItem>
                          <SelectItem value="4">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleUpdateStatus}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                      >
                        Update Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Customer Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <MapPin className="size-4" />
                      Customer Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Name</Label>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Phone</Label>
                        <p className="font-medium">{selectedOrder.customerPhone}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Email</Label>
                        <p className="font-medium">{selectedOrder.customerEmail}</p>
                      </div>
                    </div>
                    {selectedOrder.shippingAddress && (
                      <div className="mt-4">
                        <Label className="text-gray-500 dark:text-gray-400">Shipping Address</Label>
                        <p className="font-medium mt-1">{selectedOrder.shippingAddress}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <ShoppingBag className="size-4" />
                      Order Items
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedOrder.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="size-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{typeof item.brand === 'object' ? item.brand?.name : item.brand}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {item.quantity} {item.soldBy === 'meter' ? 'pcs' : 'pcs'}
                              {item.soldBy === 'meter' && item.meters && ` × ${item.meters} meters`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price} / {item.soldBy}</p>
                            <p className="font-bold">
                              ₹{(item.soldBy === 'meter' ? item.price * item.quantity * (item.meters || 1) : item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Price Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <CreditCard className="size-4" />
                      Price Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span>₹{selectedOrder.subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                        <span>₹{selectedOrder.tax.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                        <span className="text-green-600 dark:text-green-400">Free</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Discount</span>
                        <span>₹0</span>
                      </div>
                      <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total (with GST)</span>
                        <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment & Courier Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <CreditCard className="size-4" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Payment Method</Label>
                        <p className="font-medium">UPI</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Transaction ID</Label>
                        <p className="font-mono text-sm">TXN{Date.now().toString().slice(-10)}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Payment Status</Label>
                        <Badge className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mt-1">
                          Paid
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Truck className="size-4" />
                        Courier Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Courier Name</Label>
                        <p className="font-medium">Delhivery Express</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Contact</Label>
                        <p className="font-medium">+91 98765 43210</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Tracking ID</Label>
                        <p className="font-mono text-sm">DELV{Date.now().toString().slice(-12)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
