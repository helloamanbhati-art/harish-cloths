import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Eye, Loader2 } from 'lucide-react';

interface OrderItem {
  product: string;
  productName: string;
  size?: string;
  quantity: number;
  price: number;
  subtotal: number;
  soldBy: 'meter' | 'piece';
  meters?: number;
}

interface CustomerOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress?: {
    city?: string;
    state?: string;
  };
  createdAt: string;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  useEffect(() => {
    // Fetch orders - Replace with actual API call
    setLoading(true);
    setTimeout(() => {
      setOrders([
        {
          _id: '1',
          orderNumber: 'ORD-001234',
          customerName: 'Aman Bhati',
          customerEmail: 'aman@example.com',
          customerPhone: '+91-9358587006',
          items: [
            {
              product: 'prod-1',
              productName: 'Cotton Shirt',
              size: 'L',
              quantity: 1,
              price: 1299,
              subtotal: 1299,
              soldBy: 'piece',
            },
            {
              product: 'prod-2',
              productName: 'Denim Jeans',
              size: '32',
              quantity: 2,
              price: 2499,
              subtotal: 4998,
              soldBy: 'piece',
            },
          ],
          total: 6297,
          status: 'shipped',
          shippingAddress: {
            city: 'Jodhpur',
            state: 'Rajasthan',
          },
          createdAt: '2024-05-25T10:30:00Z',
        },
        {
          _id: '2',
          orderNumber: 'ORD-001235',
          customerName: 'Priya Singh',
          customerEmail: 'priya@example.com',
          customerPhone: '+91-9876543210',
          items: [
            {
              product: 'prod-3',
              productName: 'Fabric Meter',
              quantity: 5,
              price: 450,
              subtotal: 2250,
              soldBy: 'meter',
              meters: 4.5,
            },
          ],
          total: 2250,
          status: 'pending',
          shippingAddress: {
            city: 'Mumbai',
            state: 'Maharashtra',
          },
          createdAt: '2024-05-26T15:45:00Z',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Orders</h1>
        <div className="text-sm text-muted-foreground">
          Total Orders: <span className="font-semibold">{orders.length}</span>
        </div>
      </div>

      {selectedOrder ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Order Details: {selectedOrder.orderNumber}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {new Date(selectedOrder.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Info */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm mb-3">Customer Information</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {selectedOrder.customerName}</p>
                  <p><span className="text-muted-foreground">Email:</span> {selectedOrder.customerEmail}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedOrder.customerPhone}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-sm mb-3">Status</h3>
                <Badge className={`text-sm py-1 px-3 ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status.toUpperCase()}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Order Items */}
            <div>
              <h3 className="font-semibold text-sm mb-3">Order Items</h3>
              <div className="space-y-3">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-muted/30 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-sm">{item.productName}</p>
                        {item.size && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            Size: {item.size}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{item.subtotal.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                    </div>
                    {item.soldBy === 'meter' && item.meters && (
                      <p className="text-xs text-muted-foreground">
                        {item.meters}m per piece
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Order Total */}
            <div className="flex justify-end">
              <div className="w-full md:w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.items.reduce((sum, item) => sum + item.subtotal, 0).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm border-t pt-2 font-semibold">
                  <span>Total:</span>
                  <span>₹{selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            {selectedOrder.shippingAddress && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold text-sm mb-2">Shipping Address</h3>
                  <p className="text-sm">
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardContent className="p-4">
                <div className="grid md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Order Number</p>
                    <p className="font-semibold">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-semibold">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Items</p>
                    <p className="font-semibold">{order.items.length} item(s)</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="font-semibold">₹{order.total.toLocaleString('en-IN')}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge className={`text-xs ${getStatusColor(order.status)}`}>
                      {order.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="size-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
