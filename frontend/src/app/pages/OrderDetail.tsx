import { useParams, Link, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Home, Package, Truck, MapPin, Clock, Phone, Mail, Copy, Check, IndianRupee, ArrowLeft, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useOrders } from '../contexts/OrderContext';
import { usePageTitle } from '../hooks/usePageTitle';

export function OrderDetail() {
  const { id } = useParams();
  usePageTitle('Order Details');
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useOrders();
  const order = id ? getOrderById(id) : undefined;
  const [copied, setCopied] = useState(false);

  // Simulate real-time status updates (in production, this would come from backend)
  useEffect(() => {
    if (!order) return;
    
    const interval = setInterval(() => {
      if (order.currentStatus < 4) {
        updateOrderStatus(order.id, order.currentStatus + 1);
      }
    }, 15000); // Update every 15 seconds for demo

    return () => clearInterval(interval);
  }, [order, updateOrderStatus]);

  if (!order) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-12">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-full bg-muted">
                <Package className="size-16 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/my-orders">
              <Button size="lg">
                <ArrowLeft className="size-5 mr-2" />
                Back to Orders
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const orderStatuses = [
    {
      id: 0,
      status: 'Order Placed',
      description: 'Your order has been confirmed',
      icon: CheckCircle,
      time: new Date(order.orderDate).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date(order.orderDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      id: 1,
      status: 'Processing',
      description: 'Your items are being prepared',
      icon: Package,
      time: '--:--',
      date: '--',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      id: 2,
      status: 'Shipped',
      description: 'Package is on the way',
      icon: Truck,
      time: '--:--',
      date: '--',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
    {
      id: 3,
      status: 'Out for Delivery',
      description: 'Package is nearby',
      icon: MapPin,
      time: '--:--',
      date: '--',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      id: 4,
      status: 'Delivered',
      description: 'Successfully delivered',
      icon: CheckCircle,
      time: '--:--',
      date: '--',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto">
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => navigate('/my-orders')}>
          <ArrowLeft className="size-4 mr-2" />
          Back to My Orders
        </Button>
      </div>

      {/* Success Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="mb-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="pt-6 pb-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <div className="p-3 rounded-full bg-green-500">
                  <CheckCircle className="size-10 md:size-12 text-white" />
                </div>
              </motion.div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Order Details</h1>
                <p className="text-gray-700 text-sm md:text-base">
                  Order placed on {formatDate(order.orderDate)}
                </p>
              </div>

              <Link to="/" className="md:ml-auto">
                <Button variant="outline" size="lg">
                  <Home className="size-5 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Order Items Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Order Summary</CardTitle>
              <Badge variant="outline" className="text-sm">
                {order.items.length} {order.items.length === 1 ? 'Item' : 'Items'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Products List */}
            <div className="space-y-4 mb-6">
              {order.items.map((item, idx) => (
                <div
                  key={`${item.productId || item.product?.id || item.product}-${item.selectedMeters || item.meters || 'piece'}-${idx}`}
                  className="flex gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="size-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={item.selectedVariant?.primaryImage || item.productImage || item.product?.image}
                      alt={item.productName || item.product?.name}
                      className="size-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 truncate">
                      {item.productName || item.product?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.brand || (typeof item.product?.brand === 'object' ? item.product.brand?.name : item.product?.brand)}
                    </p>

                    {/* Quantity & Meter Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      {item.size && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Size:</span>
                          <Badge variant="outline" className="text-xs font-semibold">
                            {item.size}
                          </Badge>
                        </div>
                      )}

                      {item.color && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Design:</span>
                          <Badge variant="outline" className="text-xs font-semibold">
                            {item.color}
                          </Badge>
                        </div>
                      )}
                      
                      {item.soldBy !== 'meter' ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="font-semibold">{item.quantity}</span>
                        </div>
                      ) : (
                        (item.selectedMeters || item.meters) && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">Length:</span>
                            <span className="font-semibold">{item.selectedMeters || item.meters} Meters</span>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className="text-right flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Unit Price</p>
                      <p className="font-semibold flex items-center justify-end gap-0.5">
                        <IndianRupee className="size-3.5" />
                        {(item.price || item.product?.price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="pt-2 border-t mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                      <p className="text-lg font-bold flex items-center justify-end gap-0.5">
                        <IndianRupee className="size-4" />
                        {(
                          item.subtotal || 
                          ((item.price || item.product?.price || 0) *
                            item.quantity)
                        ).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-semibold flex items-center gap-0.5">
                  <IndianRupee className="size-3.5" />
                  {(order.subtotal || order.totalPrice).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-semibold flex items-center gap-0.5">
                  <IndianRupee className="size-3.5" />
                  {(order.shippingCharges !== undefined ? order.shippingCharges : 80).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-bold text-lg">Total Amount:</span>
                <span className="text-2xl font-bold text-primary flex items-center gap-1">
                  <IndianRupee className="size-5" />
                  {Math.round(order.totalPrice).toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="size-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Payment Confirmed</span> - Your order has been successfully processed
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Live Order Tracking */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Details */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl md:text-2xl">Live Tracking</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Track your order in real-time</p>
                </div>
                <Badge className="bg-green-500 hover:bg-green-600">
                  <Clock className="size-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Order & Tracking IDs */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground mb-2">Order Number</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-lg">{order.orderNumber}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(order.orderNumber)}
                    >
                      {copied ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/50 border">
                  <p className="text-xs text-muted-foreground mb-2">Tracking ID</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-sm md:text-base">{order.trackingId}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(order.trackingId)}
                    >
                      {copied ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <Copy className="size-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <Truck className="size-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Estimated Delivery</p>
                    <p className="text-lg font-bold text-blue-700">{formatDate(order.estimatedDelivery)}</p>
                  </div>
                </div>
              </div>

              {/* Live Tracking Timeline */}
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Tracking Status</h3>
                  <Badge variant="outline" className="animate-pulse">
                    Auto-updating
                  </Badge>
                </div>

                <div className="relative">
                  {orderStatuses.map((item, index) => {
                    const Icon = item.icon;
                    const isCompleted = order.currentStatus >= index;
                    const isCurrent = order.currentStatus === index;
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative pb-8 last:pb-0"
                      >
                        <div className="flex items-start gap-4">
                          {/* Timeline Line */}
                          {index !== orderStatuses.length - 1 && (
                            <div className="absolute left-[20px] top-[40px] bottom-0 w-0.5 bg-border">
                              {isCompleted && (
                                <motion.div
                                  initial={{ height: 0 }}
                                  animate={{ height: '100%' }}
                                  transition={{ duration: 0.5 }}
                                  className="w-full bg-green-500"
                                />
                              )}
                            </div>
                          )}

                          {/* Status Icon */}
                          <motion.div
                            animate={{
                              scale: isCurrent ? [1, 1.1, 1] : 1,
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: isCurrent ? Infinity : 0,
                            }}
                            className={`relative z-10 flex items-center justify-center size-10 rounded-full border-2 ${
                              isCompleted
                                ? 'border-green-500 bg-green-500'
                                : 'border-muted bg-background'
                            }`}
                          >
                            <Icon
                              className={`size-5 ${
                                isCompleted ? 'text-white' : 'text-muted-foreground'
                              }`}
                            />
                            {isCurrent && (
                              <motion.div
                                animate={{
                                  scale: [1, 1.5, 1],
                                  opacity: [0.5, 0, 0.5],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                                className="absolute inset-0 rounded-full bg-green-500"
                              />
                            )}
                          </motion.div>

                          {/* Status Content */}
                          <div className="flex-1 pt-1">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <p className={`font-semibold ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {item.status}
                                  </p>
                                  {isCurrent && (
                                    <Badge className="bg-blue-500 animate-pulse">Current</Badge>
                                  )}
                                  {isCompleted && !isCurrent && (
                                    <CheckCircle className="size-4 text-green-500" />
                                  )}
                                </div>
                                <p className={`text-sm ${isCompleted ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
                                  {item.description}
                                </p>
                              </div>
                              
                              {isCompleted && (
                                <div className="text-right">
                                  <p className="text-xs text-muted-foreground">{item.date}</p>
                                  <p className="text-xs font-mono text-muted-foreground">{item.time}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Courier Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Courier Partner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${order.courierPartner.gradient}`}>
                  <Truck className="size-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">{order.courierPartner.name}</p>
                  <p className="text-xs text-muted-foreground">{order.courierPartner.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="size-4 text-muted-foreground" />
                  <span>{order.courierPartner.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="size-4 text-muted-foreground" />
                  <span className="text-xs">{order.courierPartner.email}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                <Phone className="size-4 mr-2" />
                Contact Courier
              </Button>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="size-5 text-amber-600" />
                Delivery Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 rounded-lg bg-white/70 border border-amber-200/50 space-y-1">
                <p className="font-semibold text-gray-900">{order.shippingAddress.name}</p>
                <p className="text-sm text-gray-700">{order.shippingAddress.addressLine1}</p>
                <p className="text-sm text-gray-700">{order.shippingAddress.addressLine2}</p>
                <p className="text-sm text-gray-700">
                  {order.shippingAddress.city}, {order.shippingAddress.state}
                </p>
                <p className="text-sm text-gray-700">{order.shippingAddress.pincode}</p>
                <div className="pt-2 mt-2 border-t border-amber-200/50 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-3.5 text-amber-600" />
                    <p className="text-xs font-medium text-gray-700">{order.shippingAddress.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}