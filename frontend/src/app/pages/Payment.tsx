import { Link, useNavigate } from 'react-router';
import { useCart } from '../contexts/CartContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';
import { ArrowLeft, Shield, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';

// Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

const isEmbeddedBrowser = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  const userAgent = window.navigator.userAgent || '';
  const isIframe = window.self !== window.top;
  const isWebViewLike =
    /WebView|wv|Electron|Headless|Codex/i.test(userAgent) ||
    userAgent.includes('Version/') && userAgent.includes('Chrome/');

  return isIframe || isWebViewLike;
};

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent || '';
  return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const RAZORPAY_MOCK_MODE = import.meta.env.VITE_RAZORPAY_MOCK_MODE === 'true';
const RAZORPAY_KEY =
  import.meta.env.VITE_RAZORPAY_KEY ||
  import.meta.env.VITE_RAZORPAY_KEY_ID ||
  'rzp_test_1DP5MM47F8wC1j';

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLLING_ATTEMPTS = 20; // 60 seconds total

if (!import.meta.env.VITE_RAZORPAY_KEY && !import.meta.env.VITE_RAZORPAY_KEY_ID) {
  console.warn('Razorpay publishable key not configured. Set VITE_RAZORPAY_KEY or VITE_RAZORPAY_KEY_ID.');
}

export function Payment() {
  usePageTitle('Payment');
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const pollingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const paymentCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load Razorpay script
  useEffect(() => {
    if (RAZORPAY_MOCK_MODE) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      toast.error('Failed to load payment gateway');
      setScriptLoaded(false);
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (pollingTimeoutRef.current) clearTimeout(pollingTimeoutRef.current);
      if (paymentCheckTimeoutRef.current) clearTimeout(paymentCheckTimeoutRef.current);
    };
  }, []);

  // Check cart on mount
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const finalAmount = totalPrice;

  // Poll for payment status
  const pollPaymentStatus = async (
    orderId: string,
    razorpayOrderId: string,
    maxAttempts: number = MAX_POLLING_ATTEMPTS
  ) => {
    let attempts = 0;

    const checkStatus = async (): Promise<void> => {
      if (attempts >= maxAttempts) {
        setIsPolling(false);
        toast.info(
          'Payment verification took longer than expected. Your order status will be checked automatically. Please check your account.'
        );
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/v1/payments/order-status/${orderId}`,
          {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const paymentStatus = data.data?.paymentStatus;

          if (paymentStatus === 'paid') {
            // Payment confirmed
            setIsPolling(false);
            toast.success('Payment confirmed! Finalizing your order...');
            
            // Navigate to success page
            navigate('/order-success', {
              state: {
                items,
                totalPrice: data.data?.total || finalAmount,
                paymentMethod: 'razorpay',
                orderId: orderId,
                orderNumber: data.data?.orderNumber,
                paymentId: data.data?.razorpayPaymentId,
                status: data.data?.status,
              },
            });

            setTimeout(() => clearCart(), 100);
            return;
          }
        }

        // Not yet confirmed, retry
        attempts++;
        pollingTimeoutRef.current = setTimeout(checkStatus, POLLING_INTERVAL);
      } catch (error) {
        console.error('Polling error:', error);
        attempts++;
        pollingTimeoutRef.current = setTimeout(checkStatus, POLLING_INTERVAL);
      }
    };

    checkStatus();
  };

  const processMockPayment = async (createdOrder: any, razorpayOrder: any) => {
    const now = Date.now();
    const mockResponse = {
      razorpay_order_id: razorpayOrder.id,
      razorpay_payment_id: `pay_mock_${now}`,
      razorpay_signature: `sig_mock_${now}`,
    };

    toast.info('Mock payment mode is enabled. Completing payment locally.');
    await handlePaymentSuccess(mockResponse, createdOrder._id);
  };

  const handlePayment = async () => {
    if (!scriptLoaded && !RAZORPAY_MOCK_MODE) {
      toast.error('Payment gateway is loading. Please wait...');
      return;
    }

    if (items.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    if (!RAZORPAY_MOCK_MODE && isEmbeddedBrowser()) {
      toast.error('Razorpay checkout may fail inside this embedded browser. Open this page in Chrome or Edge to complete payment.');
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Get checkout data from session storage
      const checkoutData = sessionStorage.getItem('checkoutData');
      if (!checkoutData) {
        toast.error('Checkout data not found. Please go back to checkout.');
        setIsProcessing(false);
        return;
      }

      const parsedCheckoutData = JSON.parse(checkoutData);
      const contactNumber = String(parsedCheckoutData.shippingAddress.phone || '')
        .replace(/\D/g, '')
        .slice(-10);

      // Step 2: Create order via backend API
      const orderPayload = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          meters: item.selectedMeters || 1,
          selectedSize: item.selectedSize || null,
          selectedColor: item.selectedColor || null,
          selectedVariant: item.selectedVariant || null,
        })),
        shippingAddress: parsedCheckoutData.shippingAddress,
        email: parsedCheckoutData.email,
        paymentMethod: 'razorpay',
        shippingMethod: 'standard',
        couponCode: parsedCheckoutData.couponCode || null,
        customerNotes: parsedCheckoutData.customerNotes || '',
      };

      const orderResponse = await fetch(`${API_BASE_URL}/api/v1/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create order');
      }

      const orderData = await orderResponse.json();
      const createdOrderData = orderData.data;
      const createdOrder = createdOrderData?.order;
      const razorpayOrder = createdOrderData?.razorpayOrder;

      if (!createdOrder || !razorpayOrder) {
        throw new Error('Razorpay order not created');
      }

      if (RAZORPAY_MOCK_MODE) {
        await processMockPayment(createdOrder, razorpayOrder);
        return;
      }

      // Step 3: Open Razorpay payment modal with mobile app support
      const options = {
        key: RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        order_id: razorpayOrder.id,
        name: 'Harish Cloths - Premium Fabrics',
        description: 'Purchase of premium fabric products',
        image: '/logo.png', // Add your logo
        handler: (response: RazorpayResponse) => {
          handlePaymentSuccess(response, createdOrder._id);
        },
        prefill: {
          name: parsedCheckoutData.shippingAddress.fullName || '',
          email: parsedCheckoutData.email || '',
          contact: contactNumber,
        },
        notes: {
          order_number: createdOrder.orderNumber,
          order_id: createdOrder._id,
          customer_email: parsedCheckoutData.email,
        },
        retry: {
          enabled: true,
          max_count: 3,
        },
        theme: {
          color: '#1a1a1a',
          backdrop_color: 'rgba(0, 0, 0, 0.7)',
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast.info('Payment cancelled. Your order has been saved.');
            // Start polling to check if payment was made via app
            setIsPolling(true);
            pollPaymentStatus(createdOrder._id, razorpayOrder.id, 10);
          },
          onfocus: () => {
            console.log('Payment window focused');
          },
          onblur: () => {
            console.log('Payment window blurred - user may have left for payment app');
          },
        },
        // Mobile app support
        method: {
          upi: isMobileDevice() ? 'all' : 'off', // Enable all UPI on mobile
          netbanking: true,
          card: true,
          wallet: true,
        },
        // Async behavior for mobile
        async: true,
        // For automatic app opening on mobile
        recurring: false,
        display_rmpost: false,
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', (response: any) => {
        setIsProcessing(false);
        handlePaymentFailure(response, createdOrder._id);
      });

      razorpay.on('payment.authorized', () => {
        console.log('Payment authorized, polling for confirmation...');
        // Start polling for payment confirmation
        setIsPolling(true);
        pollPaymentStatus(createdOrder._id, razorpayOrder.id);
      });

      razorpay.open();
    } catch (error) {
      setIsProcessing(false);
      const errorMessage = error instanceof Error ? error.message : 'Failed to initiate payment';
      toast.error(errorMessage);
      console.error('Payment error:', error);
    }
  };

  const handlePaymentFailure = async (response: any, orderId: string) => {
    try {
      console.error('Payment failed:', response);
      const failureMessage = response.error?.description || 'Payment failed. Please try again.';
      
      toast.error(failureMessage);

      // Notify backend of failure
      await fetch(`${API_BASE_URL}/api/v1/payments/failure`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayOrderId: response.error?.metadata?.order_id,
          failureReason: response.error?.description || 'Unknown error',
          errorCode: response.error?.code,
          errorSource: response.error?.source,
          errorStep: response.error?.step,
          errorReason: response.error?.reason,
        }),
      }).catch(err => console.error('Failed to log payment failure:', err));

      if (isEmbeddedBrowser()) {
        toast.info('This payment window is running inside an embedded browser. Please retry in Chrome or Edge.');
      }
    } catch (error) {
      console.error('Error handling payment failure:', error);
    }
  };

  const handlePaymentSuccess = async (response: RazorpayResponse, orderId: string) => {
    try {
      console.log('Payment response received:', response);
      setIsPolling(true);

      // Step 1: Verify payment signature with backend
      const verifyResponse = await fetch(`${API_BASE_URL}/api/v1/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        }),
      });

      if (!verifyResponse.ok) {
        const errorData = await verifyResponse.json();
        throw new Error(errorData.message || 'Payment verification failed');
      }

      const verifyData = await verifyResponse.json();
      console.log('Payment verified:', verifyData);

      // Clear checkout data from session
      sessionStorage.removeItem('checkoutData');

      setIsPolling(false);
      toast.success('Payment successful! Your order has been confirmed.');

      // Navigate to success page with order details
      navigate('/order-success', {
        state: {
          items,
          totalPrice: verifyData.data.total || finalAmount,
          paymentMethod: 'razorpay',
          orderId: verifyData.data.orderId,
          orderNumber: verifyData.data.orderNumber,
          paymentId: response.razorpay_payment_id,
          status: verifyData.data.status,
        },
      });

      // Clear cart after navigation
      setTimeout(() => clearCart(), 100);
    } catch (error) {
      setIsProcessing(false);
      setIsPolling(false);
      const errorMessage = error instanceof Error ? error.message : 'Payment verification failed';
      console.error('Payment verification error:', error);

      toast.error(errorMessage);
      
      // Start polling as fallback
      setIsPolling(true);
      pollPaymentStatus(orderId, '', 15);
      
      setTimeout(() => {
        toast.info('Checking payment status... Please wait.');
      }, 2000);
    }
  };

  return (
    <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto">
      <Link to="/checkout">
        <Button variant="ghost" className="mb-4 md:mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Checkout
        </Button>
      </Link>

      <h1 className="text-xl md:text-2xl mb-4 md:mb-6">Payment</h1>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-2">
          <Card className="border-2">
            <CardContent className="p-4 md:p-6">
              <div className="space-y-6">
                {/* Polling Status */}
                {isPolling && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                    <Loader2 className="size-5 text-blue-600 mt-0.5 animate-spin flex-shrink-0" />
                    <div>
                      <p className="font-medium text-blue-900 text-sm">Verifying Payment</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Payment app may have opened on your device. Please complete the payment to continue.
                      </p>
                    </div>
                  </div>
                )}

                {/* Payment Info */}
                <div className="text-center py-8 space-y-4">
                  <div className="size-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="size-8 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">Secure Payment</h2>
                    <p className="text-sm md:text-base text-muted-foreground">
                      You will be redirected to Razorpay's secure payment gateway
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Payment Methods Info */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Accepted Payment Methods:</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs font-medium">UPI</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs font-medium">Cards</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs font-medium">Net Banking</p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg text-center">
                      <p className="text-xs font-medium">Wallets</p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Mobile Payment Info */}
                {isMobileDevice() && (
                  <>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="size-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-green-900 text-sm">Mobile Payment Ready</p>
                          <p className="text-xs text-green-700 mt-1">
                            Your device supports UPI and payment apps. Click "Pay Securely" to open the payment app.
                          </p>
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </>
                )}

                {/* Security Features */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Security Features:</p>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                      <span>256-bit SSL encryption</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                      <span>PCI DSS compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-600 flex-shrink-0" />
                      <span>Secure payment gateway by Razorpay</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Pay Button */}
                <Button
                  onClick={handlePayment}
                  className="w-full"
                  size="lg"
                  disabled={isProcessing || !scriptLoaded || isPolling}
                >
                  {!scriptLoaded && !RAZORPAY_MOCK_MODE ? (
                    <>
                      <Loader2 className="size-4 md:size-5 mr-2 animate-spin" />
                      <span className="text-sm md:text-base">Loading Payment Gateway...</span>
                    </>
                  ) : isProcessing || isPolling ? (
                    <>
                      <Loader2 className="size-4 md:size-5 mr-2 animate-spin" />
                      <span className="text-sm md:text-base">
                        {isPolling ? 'Verifying Payment...' : 'Processing...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Shield className="size-4 md:size-5 mr-2" />
                      <span className="text-sm md:text-base">Pay ₹{finalAmount.toLocaleString('en-IN')} Securely</span>
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our Terms & Conditions
                </p>
                {RAZORPAY_MOCK_MODE && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="size-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-yellow-700">
                        Local mock payment is enabled. No real Razorpay charge will be created.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg md:text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground line-clamp-1 pr-2">
                      {item.name} x {item.quantity}{' '}
                      {item.soldBy === 'meter' ? 'meters' : 'pcs'}
                    </span>
                    <span className="flex-shrink-0">
                      ₹{(
                        item.soldBy === 'meter' && item.selectedMeters
                          ? item.price * item.selectedMeters * item.quantity
                          : item.price * item.quantity
                      ).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t">
                <div>
                  <p className="text-sm md:text-base font-semibold">Total</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-lg md:text-xl">
                    ₹{finalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-2 text-[10px] md:text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Shield className="size-3 md:size-4 flex-shrink-0" />
                  <span>100% Secure Payments</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="size-3 md:size-4 flex-shrink-0" />
                  <span>Instant payment confirmation</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
