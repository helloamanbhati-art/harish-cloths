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
import { Search, Eye, ShoppingBag, Truck, CreditCard, MapPin, Copy } from 'lucide-react';
import { useOrders } from '../../contexts/OrderContext';
import { toast } from 'sonner';

const statusConfig = {
  0: { label: 'Order Placed', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  1: { label: 'Processing', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  2: { label: 'Shipped', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  3: { label: 'Out for Delivery', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  4: { label: 'Delivered', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  pending: { label: 'Pending', color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' },
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  processing: { label: 'Processing', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' },
  delivered: { label: 'Delivered', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' },
  refunded: { label: 'Refunded', color: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300' },
};

type OrderStatus = keyof typeof statusConfig;

const getOrderNumber = (order: any) => {
  if (order.orderNumber) return order.orderNumber;
  if (order.id) return `HC-2024-${String(order.id).padStart(6, '0')}`;
  return 'N/A';
};

const renderAddress = (address: any) => {
  if (!address) return <p className="text-sm text-gray-500">N/A</p>;

  const houseName = address.houseName || address.addressLine1 || '';
  const building = address.building || '';
  const street = address.street || '';
  const landmark = address.landmark ? `Landmark: ${address.landmark}` : '';
  const cityState = [address.city, address.state].filter(Boolean).join(', ');
  const pinCode = address.zipCode || address.pincode || address.zip || '';

  return (
    <div className="space-y-1 text-sm leading-relaxed text-gray-800 dark:text-gray-200">
      {address.fullName && <p className="font-semibold text-gray-900 dark:text-white text-base mb-1">{address.fullName}</p>}
      {address.phone && <p className="text-gray-600 dark:text-gray-400">📞 {address.phone}</p>}
      {(houseName || building) && (
        <p className="text-gray-800 dark:text-gray-200">
          {[houseName, building].filter(Boolean).join(', ')}
        </p>
      )}
      {street && <p className="text-gray-800 dark:text-gray-200">{street}</p>}
      {landmark && <p className="text-gray-500 dark:text-gray-400 italic">{landmark}</p>}
      {(cityState || pinCode) && (
        <p className="text-gray-900 dark:text-gray-100 font-semibold mt-1">
          {[cityState, pinCode].filter(Boolean).join(' - ')}
        </p>
      )}
      {address.country && <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{address.country}</p>}
    </div>
  );
};

const getAddressString = (address: any) => {
  if (!address) return '';
  const houseName = address.houseName || address.addressLine1 || '';
  const building = address.building || '';
  const street = address.street || '';
  const landmark = address.landmark ? `Landmark: ${address.landmark}` : '';
  const cityState = [address.city, address.state].filter(Boolean).join(', ');
  const pinCode = address.zipCode || address.pincode || address.zip || '';

  const parts = [
    address.fullName,
    address.phone ? `Phone: ${address.phone}` : null,
    [houseName, building].filter(Boolean).join(', '),
    street,
    landmark,
    [cityState, pinCode].filter(Boolean).join(' - '),
    address.country || 'India'
  ].filter(Boolean);

  return parts.join('\n');
};

const formatOrderStatus = (status: any) => {
  if (status === 'pending') return 'Pending';
  if (status === 'confirmed') return 'Confirmed';
  if (status === 'processing') return 'Processing';
  if (status === 'shipped') return 'Shipped';
  if (status === 'out_for_delivery') return 'Out for Delivery';
  if (status === 'delivered') return 'Delivered';
  if (status === 'cancelled') return 'Cancelled';
  if (status === 'refunded') return 'Refunded';
  return String(status);
};

export function OrdersManagement() {
  const { orders, updateOrderStatus } = useOrders();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('');
  const [activeLightbox, setActiveLightbox] = useState<{ images: string[]; activeIndex: number } | null>(null);

  const getVariantImages = (item: any) => {
    // Read only from order.items.selectedVariant snapshot
    if (item.selectedVariant) {
      if (item.selectedVariant.galleryImages && item.selectedVariant.galleryImages.length > 0) {
        return item.selectedVariant.galleryImages;
      }
      if (item.selectedVariant.images && item.selectedVariant.images.length > 0) {
        return item.selectedVariant.images.map((img: any) => typeof img === 'string' ? img : img.imageUrl);
      }
    }
    // Fallback solely to item's stored productImage (no product catalog query)
    return [item.productImage].filter(Boolean);
  };

  const getItemImage = (item: any) => {
    // Read only from order.items.selectedVariant snapshot
    if (item.selectedVariant) {
      if (item.selectedVariant.primaryImage) return item.selectedVariant.primaryImage;
      if (item.selectedVariant.thumbnail) return item.selectedVariant.thumbnail;
      if (item.selectedVariant.images && item.selectedVariant.images.length > 0) {
        const primaryImg = item.selectedVariant.images.find((img: any) => img.isPrimary) || item.selectedVariant.images[0];
        return typeof primaryImg === 'string' ? primaryImg : primaryImg.imageUrl;
      }
    }
    // Fallback solely to item's stored productImage (no product catalog query)
    return item.productImage || '';
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const orderNumber = getOrderNumber(order);
    const matchesSearch =
      orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || String(order.status) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: typeof orders[0]) => {
    setSelectedOrder(order);
    setNewStatus(order.status as OrderStatus);
    setDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (!selectedOrder || !newStatus) return;

    const orderId = selectedOrder.id || selectedOrder._id;
    updateOrderStatus(orderId, newStatus as any);
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
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
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Payment</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const orderNumber = getOrderNumber(order);
                    return (
                      <tr key={order.id || order._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
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
                              {order.items.map(item => {
                                const sizeInfo = item.size ? ` (${item.size})` : '';
                                const colorInfo = item.color ? ` [${item.color}]` : '';
                                return item.productName + sizeInfo + colorInfo;
                              }).join(', ')}
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
                          <div className="space-y-1">
                            <Badge className={order.paymentStatus === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : order.paymentStatus === 'failed' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'}>
                              {order.paymentStatus ? String(order.paymentStatus).toUpperCase() : 'PENDING'}
                            </Badge>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {order.paymentDetails?.transactionId || order.paymentDetails?.razorpayPaymentId || 'Awaiting payment'}
                            </p>
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
                    <span className="font-mono">{getOrderNumber(selectedOrder)}</span>
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
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
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
                      <div className="mt-4 space-y-2 border-t pt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-gray-500 dark:text-gray-400 font-semibold text-sm">
                            Shipping Address
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 gap-1.5 text-xs px-2.5"
                            onClick={() => {
                              const text = getAddressString(selectedOrder.shippingAddress);
                              navigator.clipboard.writeText(text);
                              toast.success('Shipping address copied to clipboard!');
                            }}
                          >
                            <Copy className="size-3.5" />
                            Copy Address
                          </Button>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
                          {renderAddress(selectedOrder.shippingAddress)}
                        </div>
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
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm transition-all hover:shadow-md">
                          {/* Image and details container */}
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <img
                              src={getItemImage(item)}
                              alt={item.productName}
                              className="size-20 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity border border-gray-100 dark:border-gray-850 flex-shrink-0"
                              title="Click to view all design images"
                              onClick={() => {
                                const imgs = getVariantImages(item);
                                setActiveLightbox({ images: imgs, activeIndex: 0 });
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 dark:text-white text-base leading-snug">{item.productName}</p>
                              <p className="text-[11px] text-gray-400 font-mono mt-0.5">{item.productId}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{typeof item.brand === 'object' ? item.brand?.name : item.brand}</p>
                              
                              <div className="flex flex-wrap gap-1.5 mt-2.5">
                                {item.selectedVariant?.variantName && (
                                  <Badge variant="outline" className="text-xs bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300">
                                    Variant: {item.selectedVariant.variantName}
                                  </Badge>
                                )}
                                {item.selectedVariant?.color && (
                                  <Badge variant="outline" className="text-xs">
                                    Color: {item.selectedVariant.color}
                                  </Badge>
                                )}
                                {item.selectedVariant?.pattern && (
                                  <Badge variant="outline" className="text-xs max-w-[200px] truncate">
                                    Pattern: {item.selectedVariant.pattern}
                                  </Badge>
                                )}
                                {item.selectedVariant?.sku && (
                                  <Badge variant="outline" className="text-xs font-mono">
                                    SKU: {item.selectedVariant.sku}
                                  </Badge>
                                )}
                                {item.size && (
                                  <Badge variant="outline" className="text-xs">
                                    Size: {item.size}
                                  </Badge>
                                )}
                                {item.color && !item.selectedVariant?.color && (
                                  <Badge variant="outline" className="text-xs">
                                    Design: {item.color}
                                  </Badge>
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  Qty: {item.quantity}
                                </Badge>
                                {item.soldBy === 'meter' && item.meters && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.meters} meters
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Pricing details aligned right on desktop, stacked with horizontal layout on mobile */}
                          <div className="flex sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-800 text-right shrink-0">
                            <div className="text-left sm:text-right">
                              <span className="sm:hidden text-[10px] text-gray-400 block mb-0.5">Unit Price</span>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                ₹{item.selectedVariant?.priceAtPurchase || item.price} / {item.soldBy}
                              </p>
                            </div>
                            <div className="text-right mt-0 sm:mt-2">
                              <span className="sm:hidden text-[10px] text-gray-400 block mb-0.5 font-bold">Subtotal</span>
                              <p className="font-extrabold text-lg text-primary">
                                ₹{(item.soldBy === 'meter' ? (item.selectedVariant?.priceAtPurchase || item.price) * item.quantity * (item.meters || 1) : (item.selectedVariant?.priceAtPurchase || item.price) * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
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
                        <p className="font-medium">{selectedOrder.paymentMethod || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Transaction ID</Label>
                        <p className="font-mono text-sm">
                          {selectedOrder.paymentDetails?.transactionId || selectedOrder.paymentDetails?.razorpayPaymentId || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Payment Status</Label>
                        <Badge className={selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 mt-1' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 mt-1'}>
                          {selectedOrder.paymentStatus ? String(selectedOrder.paymentStatus).toUpperCase() : 'Unknown'}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Razorpay Order ID</Label>
                        <p className="font-mono text-sm break-all">
                          {selectedOrder.paymentDetails?.razorpayOrderId || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Paid At</Label>
                        <p className="font-medium">
                          {selectedOrder.paymentDetails?.paidAt ? new Date(selectedOrder.paymentDetails.paidAt).toLocaleString('en-IN') : 'N/A'}
                        </p>
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
                        <p className="font-medium">{selectedOrder.carrier || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Tracking ID</Label>
                        <p className="font-mono text-sm">{selectedOrder.trackingNumber || 'N/A'}</p>
                      </div>
                      <div>
                        <Label className="text-gray-500 dark:text-gray-400">Shipping Method</Label>
                        <p className="font-medium">{selectedOrder.shippingMethod || 'N/A'}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Gallery Lightbox Dialog */}
      <Dialog open={!!activeLightbox} onOpenChange={(open) => !open && setActiveLightbox(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Design Image Gallery</DialogTitle>
          </DialogHeader>
          {activeLightbox && activeLightbox.images.length > 0 && (
            <div className="space-y-4 py-4">
              {/* Active Image (Big Size) */}
              <div className="aspect-square max-h-[50vh] overflow-hidden rounded-lg bg-muted flex items-center justify-center relative">
                <img
                  src={activeLightbox.images[activeLightbox.activeIndex]}
                  alt="Design preview large"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              {/* Thumbnails Gallery */}
              {activeLightbox.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {activeLightbox.images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveLightbox({ ...activeLightbox, activeIndex: idx })}
                      className={`relative size-16 rounded-md overflow-hidden border-2 shrink-0 ${
                        activeLightbox.activeIndex === idx ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/60'
                      }`}
                    >
                      <img src={imgUrl} className="w-full h-full object-cover" alt={`Thumb ${idx + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
