import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
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
import {
  Search,
  Eye,
  IndianRupee,
  Package,
  Truck,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import { toast } from 'sonner';

export function OrdersManagement() {
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const statusNames = ['Order Placed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
  
  const statusColors: Record<number, string> = {
    0: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    1: 'bg-blue-100 text-blue-800 border-blue-300',
    2: 'bg-purple-100 text-purple-800 border-purple-300',
    3: 'bg-orange-100 text-orange-800 border-orange-300',
    4: 'bg-green-100 text-green-800 border-green-300',
  };

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const handleStatusUpdate = (orderId: string, newStatus: number) => {
    updateOrderStatus(orderId, newStatus, `Status updated by admin to ${statusNames[newStatus]}`);
    toast.success('Order status updated successfully!');
    
    // Update selected order if it's open
    if (selectedOrder && selectedOrder.id === orderId) {
      const updatedOrder = orders.find(o => o.id === orderId);
      if (updatedOrder) {
        setSelectedOrder(updatedOrder);
      }
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.phone.includes(searchQuery);
    
    const matchesStatus =
      statusFilter === 'all' || order.currentStatus === parseInt(statusFilter);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Stats & Filters */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card className="md:col-span-3">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, customer name, or phone..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="pt-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="0">Order Placed</SelectItem>
                <SelectItem value="1">Processing</SelectItem>
                <SelectItem value="2">Shipped</SelectItem>
                <SelectItem value="3">Out for Delivery</SelectItem>
                <SelectItem value="4">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{filteredOrders.length}</p>
              <p className="text-sm text-muted-foreground mt-1">Orders</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Number</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono font-medium">
                      {order.orderNumber}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {order.customer.phone}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{order.items.length} items</Badge>
                    </TableCell>
                    <TableCell className="font-semibold">
                      <div className="flex items-center gap-0.5">
                        <IndianRupee className="size-3" />
                        {order.totalWithGST.toLocaleString('en-IN')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusColors[order.currentStatus]}
                      >
                        {statusNames[order.currentStatus]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(order.orderDate).toLocaleDateString('en-IN')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="size-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="size-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No orders found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Customer & Status */}
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="size-4 text-muted-foreground" />
                      <span className="font-medium">{selectedOrder.customer.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="size-4 text-muted-foreground" />
                      <span>{selectedOrder.customer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="size-4 text-muted-foreground" />
                      <span>{selectedOrder.customer.email}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Update Order Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={selectedOrder.currentStatus.toString()}
                      onValueChange={(value) =>
                        handleStatusUpdate(selectedOrder.id, parseInt(value))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusNames.map((status, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Badge
                      variant="outline"
                      className={`mt-3 ${statusColors[selectedOrder.currentStatus]}`}
                    >
                      Current: {statusNames[selectedOrder.currentStatus]}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Shipping Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent className="text-sm">
                  <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                  <p>{selectedOrder.shippingAddress.addressLine1}</p>
                  {selectedOrder.shippingAddress.addressLine2 && (
                    <p>{selectedOrder.shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} -{' '}
                    {selectedOrder.shippingAddress.pincode}
                  </p>
                  <p className="mt-2 text-muted-foreground">
                    Phone: {selectedOrder.shippingAddress.phone}
                  </p>
                </CardContent>
              </Card>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className="flex gap-3 p-3 rounded-lg border"
                      >
                        <img
                          src={item.selectedVariant?.primaryImage || item.productImage || item.product?.image}
                          alt={item.productName || item.product?.name}
                          className="size-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.productName || item.product?.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.brand || (typeof item.product?.brand === 'object' ? item.product.brand?.name : item.product?.brand)}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-sm">
                            <span>Qty: {item.quantity}</span>
                            {(item.selectedMeters || item.meters) && (
                              <span>× {item.selectedMeters || item.meters}m each</span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold flex items-center gap-0.5">
                            <IndianRupee className="size-3" />
                            {(
                              item.subtotal ||
                              ((item.price || item.product?.price || 0) *
                                item.quantity)
                            ).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="mt-4 pt-4 border-t space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span className="font-semibold flex items-center gap-0.5">
                        <IndianRupee className="size-3" />
                        {selectedOrder.subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">GST (18%):</span>
                      <span className="font-semibold flex items-center gap-0.5">
                        <IndianRupee className="size-3" />
                        {selectedOrder.gstAmount.toFixed(0)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t">
                      <span className="font-bold">Total:</span>
                      <span className="font-bold text-lg flex items-center gap-0.5">
                        <IndianRupee className="size-4" />
                        {selectedOrder.totalWithGST.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Courier Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Truck className="size-4" />
                    Courier Partner
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Partner:</span>
                    <span className="font-medium">{selectedOrder.courierPartner.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tracking ID:</span>
                    <span className="font-mono font-medium">{selectedOrder.trackingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{selectedOrder.courierPartner.phone}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

