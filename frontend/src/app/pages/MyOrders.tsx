import { Link } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Package, ChevronRight, ShoppingBag, IndianRupee, Truck, CheckCircle, Clock } from 'lucide-react';
import { useOrders } from '../contexts/OrderContext';
import { motion } from 'motion/react';
import { usePageTitle } from '../hooks/usePageTitle';

export function MyOrders() {
  usePageTitle('My Orders');
  const { orders } = useOrders();

  const getStatusInfo = (status: number) => {
    const statusMap = [
      { label: 'Order Placed', color: 'bg-green-500', icon: CheckCircle },
      { label: 'Processing', color: 'bg-blue-500', icon: Package },
      { label: 'Shipped', color: 'bg-orange-500', icon: Truck },
      { label: 'Out for Delivery', color: 'bg-purple-500', icon: Truck },
      { label: 'Delivered', color: 'bg-green-600', icon: CheckCircle },
    ];
    return statusMap[status] || statusMap[0];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 md:p-8">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-12 pb-12">
            <div className="flex justify-center mb-6">
              <div className="p-6 rounded-full bg-muted">
                <ShoppingBag className="size-16 text-muted-foreground" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-3">No Orders Yet</h2>
            <p className="text-muted-foreground mb-6">
              You haven't placed any orders. Start shopping to see your orders here!
            </p>
            <Link to="/">
              <Button size="lg">
                <ShoppingBag className="size-5 mr-2" />
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-muted-foreground">
          View and track all your orders in one place
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-blue-100">
                <Package className="size-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{orders.length}</p>
                <p className="text-sm text-muted-foreground">Total Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-orange-100">
                <Truck className="size-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.currentStatus < 4).length}
                </p>
                <p className="text-sm text-muted-foreground">In Transit</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-green-100">
                <CheckCircle className="size-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {orders.filter((o) => o.currentStatus === 4).length}
                </p>
                <p className="text-sm text-muted-foreground">Delivered</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order, index) => {
          const statusInfo = getStatusInfo(order.currentStatus);
          const StatusIcon = statusInfo.icon;

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <Link to={`/order/${order.id}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                      {/* Product Images Stack */}
                      <div className="flex gap-2">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div
                            key={idx}
                            className="size-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border-2 border-background shadow-sm"
                            style={{ marginLeft: idx > 0 ? '-12px' : '0', zIndex: 3 - idx }}
                          >
                            <img
                              src={item.selectedVariant?.primaryImage || item.productImage || item.product?.image}
                              alt={item.productName || item.product?.name}
                              className="size-full object-cover"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div
                            className="size-20 rounded-lg bg-muted flex items-center justify-center border-2 border-background shadow-sm"
                            style={{ marginLeft: '-12px', zIndex: 0 }}
                          >
                            <p className="text-sm font-bold text-muted-foreground">
                              +{order.items.length - 3}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Order Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-lg">
                                Order #{order.orderNumber}
                              </h3>
                              <Badge className={`${statusInfo.color} text-white`}>
                                <StatusIcon className="size-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Placed on {formatDate(order.orderDate)}
                            </p>
                          </div>

                          <div className="text-left sm:text-right">
                            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                            <p className="text-xl font-bold flex items-center gap-1">
                              <IndianRupee className="size-4" />
                              {Math.round(order.totalPrice).toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Order Items Summary */}
                        <div className="mb-3">
                          <p className="text-sm text-muted-foreground mb-2">
                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted text-sm"
                              >
                                <span className="truncate max-w-[150px]">
                                  {item.productName || item.product?.name}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {item.selectedMeters ? `${item.selectedMeters} Meters` : `×${item.quantity}`}
                                  {item.size ? ` - ${item.size}` : ''}
                                  {item.color ? ` - ${item.color}` : ''}
                                </Badge>
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="flex items-center px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground">
                                +{order.items.length - 2} more
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {order.currentStatus === 4 ? 'Delivered' : 'Expected by'}{' '}
                              <span className="font-semibold text-foreground">
                                {formatDate(order.estimatedDelivery)}
                              </span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm">
                            <Truck className="size-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {order.courierPartner.name}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="hidden lg:flex items-center">
                        <ChevronRight className="size-6 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </CardContent>
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
