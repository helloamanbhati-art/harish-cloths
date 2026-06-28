import { Link, useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, Home, Package, Truck, MapPin, Clock, Phone, Mail, Copy, Check, IndianRupee } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { useOrders } from '../contexts/OrderContext';
import { usePageTitle } from '../hooks/usePageTitle';

export function OrderSuccess() {
  usePageTitle('Order Success');
  const navigate = useNavigate();
  const location = useLocation();
  const { addOrder } = useOrders();
  
  // Get order data from navigation state
  const orderData = location.state as {
    items: any[];
    totalPrice: number;
    paymentMethod: string;
    orderId?: string;
    orderNumber?: string;
    paymentId?: string;
    status?: string;
    selectedUPI?: string;
    upiId?: string;
    selectedBank?: string;
    selectedWallet?: string;
  } | null;
  
  // Redirect if no order data
  useEffect(() => {
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      navigate('/cart');
    }
  }, [orderData, navigate]);
  
  const [orderId] = useState(orderData?.orderId || `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const [orderNumber] = useState(orderData?.orderNumber || `HC${Math.random().toString(36).substr(2, 9).toUpperCase()}`);
  const [trackingId] = useState(`TRK${Math.random().toString(36).substr(2, 12).toUpperCase()}`);
  const [currentStatus, setCurrentStatus] = useState(0);
  const [copied, setCopied] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);

  // Popular Indian courier partners
  const courierPartners = [
    {
      name: 'Delhivery Express',
      phone: '1800-103-1960',
      email: 'support@delhivery.com',
      gradient: 'from-orange-500 to-red-500',
      website: 'www.delhivery.com',
      description: 'Premium Delivery Service',
    },
    {
      name: 'Blue Dart',
      phone: '1860-233-1234',
      email: 'care@bluedart.com',
      gradient: 'from-blue-600 to-blue-800',
      website: 'www.bluedart.com',
      description: 'Express Delivery Partner',
    },
    {
      name: 'DTDC Courier',
      phone: '1860-208-6344',
      email: 'customercare@dtdc.com',
      gradient: 'from-red-600 to-pink-600',
      website: 'www.dtdc.in',
      description: 'Trusted Courier Service',
    },
    {
      name: 'India Post',
      phone: '1800-11-2011',
      email: 'callcentre@indiapost.gov.in',
      gradient: 'from-green-600 to-teal-600',
      website: 'www.indiapost.gov.in',
      description: 'Speed Post Service',
    },
    {
      name: 'Ecom Express',
      phone: '1800-102-7737',
      email: 'care@ecomexpress.in',
      gradient: 'from-purple-600 to-indigo-600',
      website: 'www.ecomexpress.in',
      description: 'Reliable Express Delivery',
    },
  ];

  // Randomly assign a courier partner (in production, this would be based on location/availability)
  const assignedCourier = courierPartners[Math.floor(Math.random() * courierPartners.length)];

  // 🎉 Confetti Celebration Effect on Page Load
  useEffect(() => {
    // First burst - from center
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 300);

    // Second burst - from left
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
    }, 600);

    // Third burst - from right
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });
    }, 900);

    // Final celebration burst with stars
    setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 120,
        origin: { y: 0.4 },
        colors: ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4']
      });
    }, 1200);
  }, []);

  // Simulate real-time status updates (in production, this would come from backend)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatus(prev => {
        if (prev < 4) return prev + 1;
        return prev;
      });
    }, 8000); // Update every 8 seconds for demo

    return () => clearInterval(interval);
  }, []);

  // Calculate estimated delivery date (3-5 business days from now)
  const getEstimatedDelivery = () => {
    const today = new Date();
    today.setDate(today.getDate() + 4); // Add 4 days
    return today.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  const orderStatuses = [
    {
      id: 0,
      status: 'Order Placed',
      description: 'Your order has been confirmed',
      icon: CheckCircle,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
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

  // Save order to localStorage on component mount
  useEffect(() => {
    if (!orderSaved && orderData && orderData.items.length > 0) {
      const estimatedDeliveryDate = new Date();
      estimatedDeliveryDate.setDate(estimatedDeliveryDate.getDate() + 4);

      // Get device type
      const getDeviceType = (): 'Desktop' | 'Mobile' | 'Tablet' => {
        const width = window.innerWidth;
        if (width < 768) return 'Mobile';
        if (width < 1024) return 'Tablet';
        return 'Desktop';
      };

      const newOrder = {
        id: orderId,
        orderNumber,
        trackingId,
        invoiceNumber: `INV-${orderNumber}-${new Date().getFullYear()}`,
        // Transform cart items to order items structure
        items: orderData.items.map(cartItem => ({
          product: {
            id: cartItem.id,
            name: cartItem.name,
            price: cartItem.price,
            image: cartItem.image,
            category: cartItem.category,
            description: cartItem.description,
            brand: cartItem.brand,
            inStock: cartItem.inStock,
            rating: cartItem.rating,
            soldBy: cartItem.soldBy,
          },
          quantity: cartItem.quantity,
          selectedMeters: cartItem.selectedMeters,
          size: cartItem.selectedSize,
          color: cartItem.selectedColor,
        })),

        // Pricing breakdown
        subtotal: orderData.totalPrice,
        shippingCharges: 0, // Free shipping
        discount: 0,
        totalPrice: orderData.totalPrice,
        
        // Dates
        orderDate: new Date().toISOString(),
        estimatedDelivery: estimatedDeliveryDate.toISOString(),
        
        // Status
        currentStatus: 0,
        statusHistory: [
          {
            status: 0,
            statusName: 'Order Placed',
            timestamp: new Date().toISOString(),
            updatedBy: 'System',
            notes: 'Order successfully placed and payment confirmed',
          },
        ],
        
        // Courier
        courierPartner: {
          ...assignedCourier,
          trackingUrl: `https://${assignedCourier.website}/track/${trackingId}`,
        },
        
        // Customer Details (In production, get from user session/auth)
        customer: {
          id: 'CUST' + Math.random().toString(36).substr(2, 9).toUpperCase(),
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 98765 43210',
        },
        
        // Shipping Address (In production, get from checkout form)
        shippingAddress: {
          name: 'Priya Sharma',
          phone: '+91 98765 43210',
          email: 'priya.sharma@example.com',
          addressLine1: '123, MG Road, Apartment 4B',
          addressLine2: 'Koramangala',
          city: 'Bangalore',
          state: 'Karnataka',
          pincode: '560034',
          landmark: 'Near Sony World Signal',
          addressType: 'Home' as const,
        },
        // Payment Details
        paymentDetails: {
          method: 'Razorpay' as const,
          transactionId: orderData.paymentId || `TXN${Math.random().toString(36).substr(2, 16).toUpperCase()}`,
          paymentStatus: 'Completed' as const,
          paidAmount: orderData.totalPrice,
          paymentDate: new Date().toISOString(),
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: orderData.paymentId,
        },
        
        // Admin/Dashboard fields
        orderNotes: `[${new Date().toLocaleString()}] Order created via website checkout`,
        customerNotes: 'Please deliver between 10 AM - 6 PM',
        returnRequested: false,
        refundStatus: 'None' as const,
        cancellationRequested: false,
        
        // Metadata
        orderSource: 'Website' as const,
        deviceType: getDeviceType(),
        ipAddress: '192.168.1.1', // In production, get actual IP
      };

      addOrder(newOrder);
      setOrderSaved(true);
    }
  }, [orderSaved, orderData, orderId, orderNumber, trackingId, addOrder]);

  return (
    <div className="flex-1 p-4 md:p-8 max-w-5xl mx-auto">
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
                <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">Order Confirmed Successfully! 🎉</h1>
                <p className="text-gray-700 text-sm md:text-base">
                  Thank you for shopping with A&S. Your order is being processed.
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
                {orderData?.items.length} {orderData?.items.length === 1 ? 'Item' : 'Items'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Products List */}
            <div className="space-y-4 mb-6">
              {orderData?.items.map((item, index) => (
                <div
                  key={`${item.id}-${item.selectedMeters || 'piece'}-${index}`}
                  className="flex gap-4 p-4 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  {/* Product Image */}
                  <div className="size-20 rounded-lg overflow-hidden bg-white flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="size-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {item.category}
                    </p>

                    {/* Quantity & Meter Info */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                      {item.selectedSize && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Size:</span>
                          <span className="font-semibold">{item.selectedSize}</span>
                        </div>
                      )}
                      
                      {item.selectedColor && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Color:</span>
                          <span className="font-semibold">{item.selectedColor}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-semibold">{item.quantity}</span>
                      </div>
                      
                      {item.soldBy === 'meter' && item.selectedMeters && (
                        <div className="flex items-center gap-1.5">
                          <span className="text-muted-foreground">Length:</span>
                          <span className="font-semibold">{item.selectedMeters}m each</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5">
                        <span className="text-muted-foreground">Unit:</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.soldBy === 'meter' ? 'Per Meter' : 'Per Piece'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className="text-right flex flex-col justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Unit Price</p>
                      <p className="font-semibold flex items-center justify-end gap-0.5">
                        <IndianRupee className="size-3.5" />
                        {item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div className="pt-2 border-t mt-2">
                      <p className="text-xs text-muted-foreground mb-1">Subtotal</p>
                      <p className="text-lg font-bold flex items-center justify-end gap-0.5">
                        <IndianRupee className="size-4" />
                        {(
                          item.price *
                          item.quantity *
                          (item.selectedMeters || 1)
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
                  {orderData?.totalPrice.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping:</span>
                <span className="font-semibold text-green-600">FREE</span>
              </div>

              <div className="flex justify-between items-center pt-3 border-t">
                <span className="font-bold text-lg">Total Amount:</span>
                <span className="text-2xl font-bold text-primary flex items-center gap-1">
                  <IndianRupee className="size-5" />
                  {orderData?.totalPrice.toLocaleString('en-IN')}
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

      {/* View My Orders Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-6 text-center"
      >
        <Link to="/my-orders">
          <Button size="lg" className="gap-2">
            <Package className="size-5" />
            View My Orders
          </Button>
        </Link>
        <p className="text-sm text-muted-foreground mt-2">
          Access all your orders anytime - No login required!
        </p>
      </motion.div>
    </div>
  );
}
