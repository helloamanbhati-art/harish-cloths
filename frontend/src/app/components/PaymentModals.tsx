import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  QrCode, 
  Copy, 
  Check, 
  Loader2, 
  CheckCircle2, 
  X,
  Smartphone,
  CreditCard,
  Building2,
  Wallet as WalletIcon,
  Shield
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  onSuccess: () => void;
  paymentType: 'upi' | 'card' | 'netbanking' | 'wallet';
  selectedApp?: string;
  upiId?: string;
  bankName?: string;
  walletName?: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  amount,
  onSuccess,
  paymentType,
  selectedApp,
  upiId,
  bankName,
  walletName
}: PaymentModalProps) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [countdown, setCountdown] = useState(180); // 3 minutes
  const [copied, setCopied] = useState(false);

  const upiIdToUse = upiId || `merchant@paytm`;

  useEffect(() => {
    if (isOpen && paymentStatus === 'pending') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStatus('failed');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isOpen, paymentStatus]);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiIdToUse);
    setCopied(true);
    toast.success('UPI ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayNow = () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      const success = Math.random() > 0.1; // 90% success rate for demo
      if (success) {
        setPaymentStatus('success');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else {
        setPaymentStatus('failed');
      }
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getAppColor = (app: string) => {
    switch (app) {
      case 'googlepay':
        return 'from-blue-500 to-blue-700';
      case 'phonepe':
        return 'from-purple-600 to-purple-800';
      case 'paytm':
        return 'from-blue-500 to-blue-700';
      case 'bhim':
        return 'from-orange-500 to-orange-700';
      default:
        return 'from-primary to-primary/80';
    }
  };

  const getAppName = (app: string) => {
    switch (app) {
      case 'googlepay':
        return 'Google Pay';
      case 'phonepe':
        return 'PhonePe';
      case 'paytm':
        return 'Paytm';
      case 'bhim':
        return 'BHIM UPI';
      default:
        return 'UPI App';
    }
  };

  const renderUPIPayment = () => (
    <div className="space-y-6">
      {/* Header with App Logo */}
      {selectedApp && (
        <div className={`bg-gradient-to-br ${getAppColor(selectedApp)} p-6 rounded-2xl text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Smartphone className="size-6" />
              </div>
              <div>
                <p className="text-sm opacity-90">Pay using</p>
                <p className="text-xl font-bold">{getAppName(selectedApp)}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
              UPI
            </Badge>
          </div>
          <div className="text-center py-4">
            <p className="text-sm opacity-90 mb-1">Amount to Pay</p>
            <p className="text-4xl font-bold">₹{amount.toLocaleString('en-IN')}</p>
          </div>
        </div>
      )}

      {/* QR Code Section */}
      <div className="bg-muted/50 p-6 rounded-xl text-center">
        <div className="bg-white p-6 rounded-xl inline-block mb-4 shadow-lg">
          <div className="w-48 h-48 bg-gradient-to-br from-muted via-background to-muted flex items-center justify-center rounded-lg">
            <QrCode className="size-32 text-muted-foreground" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          Scan QR code with your {selectedApp ? getAppName(selectedApp) : 'UPI'} app
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="size-3" />
          <span>Secured by UPI</span>
        </div>
      </div>

      {/* UPI ID Section */}
      <div className="space-y-2">
        <p className="text-sm font-medium text-center">Or pay using UPI ID</p>
        <div className="flex gap-2">
          <div className="flex-1 bg-muted px-4 py-3 rounded-lg font-mono text-sm">
            {upiIdToUse}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={handleCopyUPI}
            className="shrink-0"
          >
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
          </Button>
        </div>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
        <div className="size-2 bg-green-500 rounded-full animate-pulse" />
        <span>Time remaining: {formatTime(countdown)}</span>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={handlePayNow}
          disabled={paymentStatus !== 'pending'}
        >
          {paymentStatus === 'processing' ? (
            <>
              <Loader2 className="size-5 mr-2 animate-spin" />
              Verifying Payment...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle2 className="size-5 mr-2" />
              Payment Successful
            </>
          ) : (
            <>
              <Smartphone className="size-5 mr-2" />
              I've Paid ₹{amount.toLocaleString('en-IN')}
            </>
          )}
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Cancel Payment
        </Button>
      </div>
    </div>
  );

  const renderCardPayment = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <CreditCard className="size-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Card Payment</p>
              <p className="text-xl font-bold">Secure Checkout</p>
            </div>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm opacity-90 mb-1">Amount to Pay</p>
          <p className="text-4xl font-bold">₹{amount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-xl text-center space-y-4">
        <div className="flex justify-center gap-4 mb-6">
          <div className="h-12 w-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            VISA
          </div>
          <div className="h-12 w-16 bg-gradient-to-br from-red-600 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            MC
          </div>
          <div className="h-12 w-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">
            Rupay
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Your card will be processed securely
        </p>
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="size-3" />
          <span>PCI DSS Compliant</span>
        </div>
      </div>

      <div className="space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={handlePayNow}
          disabled={paymentStatus !== 'pending'}
        >
          {paymentStatus === 'processing' ? (
            <>
              <Loader2 className="size-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle2 className="size-5 mr-2" />
              Payment Successful
            </>
          ) : (
            <>
              <CreditCard className="size-5 mr-2" />
              Pay ₹{amount.toLocaleString('en-IN')}
            </>
          )}
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderNetBankingPayment = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <Building2 className="size-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Net Banking</p>
              <p className="text-xl font-bold">{bankName || 'Your Bank'}</p>
            </div>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm opacity-90 mb-1">Amount to Pay</p>
          <p className="text-4xl font-bold">₹{amount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-xl space-y-4">
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <Shield className="size-5 text-blue-600" />
          <p className="text-sm">
            You will be redirected to your bank's secure login page
          </p>
        </div>
        
        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="size-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="font-medium">Redirecting to {bankName || 'bank'}...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please wait while we connect to your bank
            </p>
          </div>
        )}

        {paymentStatus === 'pending' && (
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="size-1.5 bg-primary rounded-full" />
              <span>Enter your internet banking credentials</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="size-1.5 bg-primary rounded-full" />
              <span>Complete OTP verification</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="size-1.5 bg-primary rounded-full" />
              <span>Confirm payment authorization</span>
            </li>
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={handlePayNow}
          disabled={paymentStatus !== 'pending'}
        >
          {paymentStatus === 'processing' ? (
            <>
              <Loader2 className="size-5 mr-2 animate-spin" />
              Connecting...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle2 className="size-5 mr-2" />
              Payment Successful
            </>
          ) : (
            <>
              <Building2 className="size-5 mr-2" />
              Continue to Bank
            </>
          )}
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderWalletPayment = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-2xl text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 rounded-xl">
              <WalletIcon className="size-6" />
            </div>
            <div>
              <p className="text-sm opacity-90">Digital Wallet</p>
              <p className="text-xl font-bold">{walletName || 'Wallet'}</p>
            </div>
          </div>
        </div>
        <div className="text-center py-4">
          <p className="text-sm opacity-90 mb-1">Amount to Pay</p>
          <p className="text-4xl font-bold">₹{amount.toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-xl space-y-4">
        {paymentStatus === 'processing' && (
          <div className="text-center py-8">
            <Loader2 className="size-12 mx-auto mb-4 animate-spin text-primary" />
            <p className="font-medium">Opening {walletName}...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Please approve the payment request
            </p>
          </div>
        )}

        {paymentStatus === 'pending' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center">
                <WalletIcon className="size-6 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Wallet Balance</p>
                <p className="text-sm text-muted-foreground">Sufficient balance available</p>
              </div>
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              You'll receive a payment notification on your {walletName} app
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Button
          className="w-full"
          size="lg"
          onClick={handlePayNow}
          disabled={paymentStatus !== 'pending'}
        >
          {paymentStatus === 'processing' ? (
            <>
              <Loader2 className="size-5 mr-2 animate-spin" />
              Waiting for approval...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle2 className="size-5 mr-2" />
              Payment Successful
            </>
          ) : (
            <>
              <WalletIcon className="size-5 mr-2" />
              Pay with {walletName}
            </>
          )}
        </Button>
        <Button variant="ghost" className="w-full" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );

  const renderPaymentContent = () => {
    if (paymentStatus === 'success') {
      return (
        <div className="text-center py-8 space-y-4">
          <div className="size-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your payment of ₹{amount.toLocaleString('en-IN')} has been processed
            </p>
          </div>
        </div>
      );
    }

    if (paymentStatus === 'failed') {
      return (
        <div className="text-center py-8 space-y-4">
          <div className="size-20 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <X className="size-10 text-red-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold mb-2">Payment Failed</h3>
            <p className="text-muted-foreground">
              The payment could not be completed. Please try again.
            </p>
          </div>
          <Button onClick={() => setPaymentStatus('pending')} className="mt-4">
            Try Again
          </Button>
        </div>
      );
    }

    switch (paymentType) {
      case 'upi':
        return renderUPIPayment();
      case 'card':
        return renderCardPayment();
      case 'netbanking':
        return renderNetBankingPayment();
      case 'wallet':
        return renderWalletPayment();
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete the payment to proceed with your order.
          </DialogDescription>
        </DialogHeader>
        {renderPaymentContent()}
      </DialogContent>
    </Dialog>
  );
}
